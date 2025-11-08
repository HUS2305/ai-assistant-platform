import { prisma } from "@ai-assistant/db";

import type { AssistantMessage } from "../types";
import type {
  ConversationHistory,
  MemoryStore
} from "./memory-store";

const toMessages = (payload: unknown): AssistantMessage[] => {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload as AssistantMessage[];
};

export class PrismaMemoryStore implements MemoryStore {
  async getConversation(
    workspaceId: string,
    userId: string,
    channel: ConversationHistory["channel"]
  ): Promise<AssistantMessage[]> {
    const conversation = await prisma.conversation.findUnique({
      where: {
        workspaceId_channel_userId: {
          workspaceId,
          channel,
          userId
        }
      }
    });

    return toMessages(conversation?.messages);
  }

  async append(history: ConversationHistory): Promise<void> {
    const existing = await this.getConversation(
      history.workspaceId,
      history.userId,
      history.channel
    );

    const messages: AssistantMessage[] = [...existing, ...history.messages];

    await prisma.conversation.upsert({
      where: {
        workspaceId_channel_userId: {
          workspaceId: history.workspaceId,
          channel: history.channel,
          userId: history.userId
        }
      },
      create: {
        workspaceId: history.workspaceId,
        userId: history.userId,
        channel: history.channel,
        messages
      },
      update: {
        messages
      }
    });
  }
}

