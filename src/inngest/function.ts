import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();
const openAi = createOpenAI();

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2",
      }
    );

    const { steps: openAiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai("gpt-4"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2",
      }
    );

    return { geminiSteps, openAiSteps };
  }
);
