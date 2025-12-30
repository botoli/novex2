export type AiMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
const DEFAULT_MODEL = "deepseek-chat"; // или "deepseek-coder" для программирования

// Ключ DeepSeek API предоставленный пользователем
const FALLBACK_KEY =
  "sk-16eab81679b141ebad344ed96a4a02ff";

const getApiKey = () =>
  (globalThis as any)?.process?.env?.DEEPSEEK_API_KEY ||
  (import.meta as any)?.env?.VITE_DEEPSEEK_API_KEY ||
  FALLBACK_KEY;

function getModel() {
  return (
    (globalThis as any)?.process?.env?.DEEPSEEK_MODEL ||
    (import.meta as any)?.env?.VITE_DEEPSEEK_MODEL ||
    DEFAULT_MODEL
  );
}

export async function sendChatCompletion(
  messages: AiMessage[]
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API ключ DeepSeek не задан");

  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getModel(),
      messages,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`DeepSeek error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return (
    data?.choices?.[0]?.message?.content || "AI не вернул содержимое ответа"
  );
}
