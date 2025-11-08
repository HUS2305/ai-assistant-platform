import { z } from "zod";

import type { AssistantMessage } from "@ai-assistant/core-assistant";
import type { GmailConfig } from "@ai-assistant/integrations";

const emailThreadSchema = z.object({
  subject: z.string(),
  messages: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      date: z.string(),
      text: z.string()
    })
  )
});

export type EmailThread = z.infer<typeof emailThreadSchema>;

export class EmailSummarizer {
  constructor(
    private readonly deps: {
      model: {
        generate: (messages: AssistantMessage[]) => Promise<AssistantMessage>;
      };
      gmail: {
        config: GmailConfig;
      };
    }
  ) {}

  async summarize(thread: EmailThread) {
    const payload = emailThreadSchema.parse(thread);

    const prompt: AssistantMessage[] = [
      {
        role: "system",
        content:
          "Summarize the email thread, highlight action items and deadlines. Reply in markdown."
      },
      {
        role: "user",
        content: JSON.stringify(payload)
      }
    ];

    const response = await this.deps.model.generate(prompt);
    return response.content;
  }
}

