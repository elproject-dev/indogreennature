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
}

/**
 * Memanggil gateway OmniRoute AI (OpenAI-compatible) yang berjalan di VPS Helipod
 */
export async function callOmniRouteAI({
  systemPrompt,
  userPrompt,
  messages = [],
  temperature = 0.7,
  model = process.env.OMNIROUTE_MODEL || 'agy/gemini-3.8-flash-medium',
  baseUrl,
  apiKey,
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

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${activeApiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: finalMessages,
      temperature,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OmniRoute error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Tidak ada respon yang dikembalikan oleh OmniRoute AI.');
  }

  return content;
}
