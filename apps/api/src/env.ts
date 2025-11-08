import { config } from "dotenv";
import { z } from "zod";

config({ path: process.env.ENV_FILE ?? ".env" });

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  OPENAI_API_KEY: z.string().default("test-openai-key"),
  DATABASE_URL: z
    .string()
    .default("postgresql://user:password@localhost:5432/ai_assistant"),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional()
});

const result = schema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment variables", result.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = result.data;

