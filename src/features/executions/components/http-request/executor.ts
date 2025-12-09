import HandleBars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as kyOptions } from "ky";

HandleBars.registerHelper("json", (context) =>
  JSON.stringify(context, null, 2)
);

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // publish loading state for manual trigger

  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  if (!data.variableName) {
    throw new NonRetriableError("Variable name not configured");
  }

  if (!data.method) {
    throw new NonRetriableError("Method not configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = HandleBars.compile(data.endpoint)(context);
    const method = data.method;
    const options: kyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = HandleBars.compile(data.body || "{}")(context);
      JSON.parse(resolved);
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  // publish success state for manual trigger
  return result;
};
