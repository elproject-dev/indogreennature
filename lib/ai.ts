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
}

/**
 * Memanggil gateway OmniRoute AI (OpenAI-compatible) yang berjalan di VPS Helipod
 */
export async function callOmniRouteAI({
  systemPrompt,
  userPrompt,
  messages = [],
  temperature = 0.7,
  model = process.env.OMNIROUTE_MODEL || 'kc/kilo-auto/free',
}: GenerateOptions): Promise<string> {
  const baseUrl = process.env.OMNIROUTE_BASE_URL || 'https://ai.indogreennature.com/v1';
  const apiKey = process.env.OMNIROUTE_API_KEY;

  if (!apiKey) {
    throw new Error('OMNIROUTE_API_KEY belum diatur di file environment (.env.local).');
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

  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
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
