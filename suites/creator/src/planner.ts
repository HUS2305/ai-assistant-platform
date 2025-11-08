import { z } from "zod";

import type { AssistantMessage } from "@ai-assistant/core-assistant";

const contentPlanSchema = z.object({
  topic: z.string(),
  platforms: z.array(z.enum(["instagram", "tiktok", "twitter", "linkedin"])),
  postsPerWeek: z.number().min(1).max(14)
});

export type ContentPlanRequest = z.infer<typeof contentPlanSchema>;

export type ContentPlan = {
  caption: string;
  hashtags: string[];
  scheduledAt: string;
};

export interface CreatorPlanner {
  planContent(request: ContentPlanRequest): Promise<ContentPlan[]>;
}

export class CreatorSuitePlanner implements CreatorPlanner {
  constructor(
    private readonly deps: {
      model: {
        generate: (messages: AssistantMessage[]) => Promise<AssistantMessage>;
      };
    }
  ) {}

  async planContent(request: ContentPlanRequest): Promise<ContentPlan[]> {
    const payload = contentPlanSchema.parse(request);
    const prompt: AssistantMessage[] = [
      {
        role: "system",
        content:
          "You are a social media strategist. Provide a JSON array of up to 3 content ideas."
      },
      {
        role: "user",
        content: JSON.stringify(payload)
      }
    ];

    const response = await this.deps.model.generate(prompt);

    try {
      const parsed = JSON.parse(response.content) as ContentPlan[];
      return parsed;
    } catch (error) {
      console.error("Failed to parse content plan", error);
      return [];
    }
  }
}

