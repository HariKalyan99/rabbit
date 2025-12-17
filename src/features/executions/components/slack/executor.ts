import HandleBars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";

HandleBars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(jsonString);

  return safeString;
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  // publish loading state for manual trigger

  await publish(
    slackChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("Slack node: Content message is required");
  }
  const rawContent = HandleBars.compile(data.content)(context);
  const content = decode(rawContent);

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(
          slackChannel().status({
            nodeId,
            status: "error",
          })
        );

        throw new NonRetriableError("Slack node: Webhook URL is required");
      }
      await ky.post(data.webhookUrl, {
        json: {
          content, // The key depends on the workflow config
        },
      });

      if (!data.variableName) {
        await publish(
          slackChannel().status({
            nodeId,
            status: "error",
          })
        );

        throw new NonRetriableError("Slack node: Variable name is missing");
      }

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(
      slackChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw error;
  }
};
