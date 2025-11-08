import { z } from "zod";

import type { MemoryStore } from "./memory/memory-store";
import type { AssistantMessage, AssistantToolCall } from "./types";

const conversationSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  input: z.string(),
  channel: z.enum(["whatsapp", "telegram", "web"]),
  attachments: z
    .array(
      z.object({
        type: z.enum(["image", "audio", "file"]),
        url: z.string(),
        mimeType: z.string().optional()
      })
    )
    .default([])
});

export type ConversationInput = z.infer<typeof conversationSchema>;
export type OrchestratorDeps = {
  memory: MemoryStore;
  tools: AssistantToolCall[];
  model: {
    generate: (messages: AssistantMessage[]) => Promise<AssistantMessage>;
  };
};

export class AssistantOrchestrator {
  constructor(private readonly deps: OrchestratorDeps) {}

  async handleConversation(raw: ConversationInput) {
    const payload = conversationSchema.parse(raw);

    const history = await this.deps.memory.getConversation(
      payload.workspaceId,
      payload.userId,
      payload.channel
    );

    const messages: AssistantMessage[] = [
      ...history,
      { role: "user", content: payload.input }
    ];

    const response = await this.deps.model.generate(messages);

    await this.deps.memory.append({
      workspaceId: payload.workspaceId,
      channel: payload.channel,
      userId: payload.userId,
      messages: [
        { role: "user", content: payload.input },
        response
      ]
    });

    return response;
  }
}

