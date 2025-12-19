import HandleBars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { openaiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

HandleBars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(jsonString);

  return safeString;
});

type OpenAiData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  // publish loading state for manual trigger

  await publish(
    openaiChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.variableName) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("OpenAi node: Variable name is missing");
  }

  if (!data.credentialId) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("OpenAI node: Credential is missing");
  }

  if (!data.userPrompt) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("OpenAi node: User prompt is missing");
  }

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId, // this can be injected
        userId,
      },
    });
  });

  if (!credential) {
    throw new NonRetriableError("Gemini node: Credential not found");
  }

  const systemPrompt = data.systemPrompt
    ? HandleBars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";

  const userPrompt = HandleBars.compile(data.userPrompt)(context);

  // fetch credentials that user selected

  const openai = createOpenAI({
    apiKey: decrypt(credential.value),
  });

  try {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai("gpt-5"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      openaiChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw error;
  }
};
