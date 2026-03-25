const { getResponse } = require("./responseEngine");
const { translate } = require("./translator");
const { generateLLMResponse } = require("./llmEngine");

const shouldUseLLM = () => process.env.USE_LLM === "true";

/**
 * processChat - Main chat engine entry point
 * @param {object} opts
 * @param {string} opts.message    - User's raw message
 * @param {string} opts.language   - ISO code: 'en' | 'hi' | 'te'
 * @param {object} opts.context    - Farm context: { disease, riskLevel, projectedYield, trustScore }
 * @returns {{ reply: string, original: string, metadata: object }}
 */
const processChat = async ({ message, language = "en", context = {} }) => {
  let original;
  let metadata = {
    engine: "rules",
    used_llm: false,
    fallback_used: false,
  };

  if (shouldUseLLM()) {
    try {
      const llmResult = await generateLLMResponse({ message, context });
      original = llmResult.original;
      metadata = {
        ...metadata,
        ...llmResult.metadata,
        engine: "llm",
        used_llm: true,
      };
    } catch (error) {
      original = getResponse(message, context);
      metadata = {
        ...metadata,
        engine: "rules_fallback",
        fallback_used: true,
        fallback_reason: error.message,
      };
    }
  } else {
    original = getResponse(message, context);
  }

  const reply = translate(original, language);
  return { reply, original, metadata };
};

module.exports = { processChat };
