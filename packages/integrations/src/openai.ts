import OpenAI from "openai";

export type OpenAIConfig = {
  apiKey: string;
};

export const createOpenAIClient = (config: OpenAIConfig) => {
  if (!config.apiKey) {
    throw new Error("OPENAI_API_KEY is required");
  }

  return new OpenAI({
    apiKey: config.apiKey
  });
};

