export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerateOptions {
  systemPrompt?: string;
  userPrompt?: string;
  messages?: ChatMessage[];
  temperature?: number;
  model?: string;
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
}

function cleanHtmlError(raw: string, status: number): string {
  if (raw.includes('504 Gateway Time-out') || status === 504) {
    return 'Gateway Timeout (504): Server model upstream membutuhkan waktu terlalu lama untuk merespons.';
  }
  if (raw.includes('502 Bad Gateway') || status === 502) {
    return 'Bad Gateway (502): Server model upstream sedang tidak dapat dijangkau.';
  }
  // Hapus tag HTML jika ada
  const stripped = raw.replace(/<[^>]*>?/gm, '').trim()
  return stripped.length > 200 ? `${stripped.slice(0, 200)}...` : stripped
}

/**
 * Memanggil gateway OmniRoute AI (OpenAI-compatible) dengan auto-fallback dan timeout guard
 */
export async function callOmniRouteAI({
  systemPrompt,
  userPrompt,
  messages = [],
  temperature = 0.7,
  model = process.env.OMNIROUTE_MODEL || 'agy/gemini-3.8-flash-medium',
  baseUrl,
  apiKey,
  timeoutMs = 28000,
}: GenerateOptions): Promise<string> {
  const activeBaseUrl = baseUrl || process.env.OMNIROUTE_BASE_URL || 'https://ai.indogreennature.com/v1';
  const activeApiKey = apiKey || process.env.OMNIROUTE_API_KEY;

  if (!activeApiKey) {
    throw new Error('OMNIROUTE_API_KEY belum diatur. Silakan atur melalui Web Pengaturan AI atau file environment (.env.local).');
  }

  const finalMessages: ChatMessage[] = [];

  if (systemPrompt) {
    finalMessages.push({ role: 'system', content: systemPrompt });
  }

  if (messages && messages.length > 0) {
    finalMessages.push(...messages);
  } else if (userPrompt) {
    finalMessages.push({ role: 'user', content: userPrompt });
  }

  const url = `${activeBaseUrl.replace(/\/+$/, '')}/chat/completions`;

  // Daftar model candidate dengan fallback berurutan
  const defaultStableModel = process.env.OMNIROUTE_MODEL || 'agy/gemini-3.8-flash-medium';
  const candidateModels = Array.from(new Set([
    model,
    defaultStableModel,
    'auto/fast',
    'auto/chat',
  ])).filter(Boolean);

  let lastError: Error | null = null;

  for (let i = 0; i < candidateModels.length; i++) {
    const currentModel = candidateModels[i];
    const isFallback = i > 0;

    if (isFallback) {
      console.warn(`[OmniRoute AI] Mencoba model fallback (${i}/${candidateModels.length - 1}): ${currentModel}`);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeApiKey}`,
        },
        body: JSON.stringify({
          model: currentModel,
          messages: finalMessages,
          temperature,
        }),
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text();
        const cleaned = cleanHtmlError(errorText, response.status);
        throw new Error(`OmniRoute error (${response.status}) [${currentModel}]: ${cleaned}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error(`Tidak ada konten respon yang dikembalikan oleh OmniRoute AI [${currentModel}].`);
      }

      return content;
    } catch (err: any) {
      clearTimeout(timer);
      const isAbort = err.name === 'AbortError' || err.message?.includes('aborted');
      const errMsg = isAbort
        ? `Request timeout (${Math.round(timeoutMs / 1000)}s) pada model [${currentModel}]`
        : err.message || 'Unknown error';

      console.warn(`[OmniRoute AI] Percobaan dengan model ${currentModel} gagal: ${errMsg}`);
      lastError = new Error(errMsg);

      // Lanjut coba model berikutnya
      continue;
    }
  }

  throw lastError || new Error('Semua model AI OmniRoute gagal merespons.');
}
