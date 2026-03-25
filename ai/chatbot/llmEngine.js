const DEFAULT_TIMEOUT_MS = 8000;

const buildPrompt = ({ message, context = {} }) => {
  return [
    "You are an agriculture assistant for farmers.",
    "Answer briefly, clearly, and practically in English.",
    "Use the provided farm context when relevant.",
    "If context is missing, do not invent precise numbers.",
    "",
    `User message: ${message}`,
    `Context: ${JSON.stringify(context)}`,
  ].join("\n");
};

const callOpenAICompatible = async ({ message, context = {} }) => {
  const apiUrl = process.env.LLM_API_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || "gpt-4o-mini";

  if (!apiUrl || !apiKey) {
    throw new Error("LLM is enabled but LLM_API_URL or LLM_API_KEY is missing");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful agricultural assistant. Respond in concise English grounded in the given farm context.",
          },
          {
            role: "user",
            content: buildPrompt({ message, context }),
          },
        ],
        temperature: 0.4,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("LLM response did not include message content");
    }

    return {
      original: content,
      metadata: {
        provider: "openai-compatible",
        model,
        used_llm: true,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
};

const generateLLMResponse = async ({ message, context = {} }) => {
  return callOpenAICompatible({ message, context });
};

module.exports = { generateLLMResponse };