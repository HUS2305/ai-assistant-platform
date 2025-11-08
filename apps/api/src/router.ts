import { initTRPC } from "@trpc/server";
import { z } from "zod";

import {
  AssistantOrchestrator,
  type AssistantMessage,
  InMemoryStore
} from "@ai-assistant/core-assistant";
import { createOpenAIClient } from "@ai-assistant/integrations";
import { CreatorSuitePlanner } from "@ai-assistant/suite-creator";
import { EmailSummarizer } from "@ai-assistant/suite-email";

import { env } from "./env";

const t = initTRPC.create();

const memory = new InMemoryStore();

const openai = createOpenAIClient({
  apiKey: env.OPENAI_API_KEY
});

const model = {
  async generate(messages: AssistantMessage[]) {
    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: messages.map((message) => ({
        role: message.role,
        content: message.content
      }))
    });

    const assistantMessage = completion.output_text ?? "";

    return {
      role: "assistant" as const,
      content: assistantMessage
    };
  }
};

const orchestrator = new AssistantOrchestrator({
  memory,
  tools: [],
  model
});

const creatorPlanner = new CreatorSuitePlanner({
  model
});

const emailSummarizer = new EmailSummarizer({
  model,
  gmail: {
    config: {
      clientId: "",
      clientSecret: "",
      redirectUri: "",
      refreshToken: ""
    }
  }
});

export const appRouter = t.router({
  health: t.procedure.query(() => ({ status: "ok" })),
  converse: t.procedure
    .input(
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
        channel: z.enum(["whatsapp", "telegram", "web"]),
        input: z.string()
      })
    )
    .mutation(async ({ input }) => {
      return orchestrator.handleConversation({
        workspaceId: input.workspaceId,
        userId: input.userId,
        channel: input.channel,
        input: input.input,
        attachments: []
      });
    }),
  creatorPlan: t.procedure
    .input(
      z.object({
        topic: z.string(),
        platforms: z.array(z.enum(["instagram", "tiktok", "twitter", "linkedin"])),
        postsPerWeek: z.number().min(1).max(14)
      })
    )
    .mutation(({ input }) => creatorPlanner.planContent(input)),
  emailSummaries: t.procedure
    .input(
      z.object({
        subject: z.string(),
        messages: z.array(
          z.object({
            from: z.string(),
            to: z.string(),
            date: z.string(),
            text: z.string()
          })
        )
      })
    )
    .mutation(({ input }) => emailSummarizer.summarize(input))
});

export type AppRouter = typeof appRouter;

