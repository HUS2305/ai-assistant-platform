import { describe, expect, it } from "vitest";

import { InMemoryStore } from "./memory/memory-store";
import { AssistantOrchestrator } from "./orchestrator";

describe("AssistantOrchestrator", () => {
  it("records conversation responses", async () => {
    const memory = new InMemoryStore();
    const orchestrator = new AssistantOrchestrator({
      memory,
      tools: [],
      model: {
        async generate(messages) {
          const last = messages.at(-1);
          return { role: "assistant", content: `Echo: ${last?.content ?? ""}` };
        }
      }
    });

    const response = await orchestrator.handleConversation({
      workspaceId: "workspace-1",
      userId: "123",
      channel: "web",
      input: "Hello there",
      attachments: []
    });

    expect(response.content).toContain("Hello there");

    const history = await memory.getConversation("workspace-1", "123", "web");
    expect(history).toHaveLength(2);
  });
});

