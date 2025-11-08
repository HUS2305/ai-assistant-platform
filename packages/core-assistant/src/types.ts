export type AssistantRole = "system" | "user" | "assistant" | "tool";

export type AssistantMessage =
  | {
      role: Exclude<AssistantRole, "tool">;
      content: string;
    }
  | {
      role: "tool";
      name: string;
      content: string;
    };

export type AssistantToolCall = {
  name: string;
  description: string;
  execute: (input: unknown) => Promise<unknown>;
};

