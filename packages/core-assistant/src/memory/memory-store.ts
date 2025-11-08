import type { AssistantMessage } from "../types";

export type ConversationHistory = {
  workspaceId: string;
  userId: string;
  channel: "whatsapp" | "telegram" | "web";
  messages: AssistantMessage[];
};

export interface MemoryStore {
  getConversation(
    workspaceId: string,
    userId: string,
    channel: ConversationHistory["channel"]
  ): Promise<AssistantMessage[]>;
  append(history: ConversationHistory): Promise<void>;
}

export class InMemoryStore implements MemoryStore {
  private store = new Map<string, AssistantMessage[]>();

  private key(
    workspaceId: string,
    userId: string,
    channel: ConversationHistory["channel"]
  ) {
    return `${workspaceId}:${channel}:${userId}`;
  }

  async getConversation(
    workspaceId: string,
    userId: string,
    channel: ConversationHistory["channel"]
  ): Promise<AssistantMessage[]> {
    return this.store.get(this.key(workspaceId, userId, channel)) ?? [];
  }

  async append(history: ConversationHistory): Promise<void> {
    const key = this.key(history.workspaceId, history.userId, history.channel);
    const existing = this.store.get(key) ?? [];
    this.store.set(key, [...existing, ...history.messages]);
  }
}

