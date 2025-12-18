import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCExecutionsParams } from "./use-executions-params";
import { ExecutionStatus } from "@/generated/prisma/enums";
// hook to fetch all Executions using suspense

export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useCExecutionsParams();

  return useSuspenseQuery({
    ...trpc.executions.getMany.queryOptions(params),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;

      const hasRunningExecutions = data.items.some(
        (execution) => execution.status === ExecutionStatus.RUNNING
      );

      return hasRunningExecutions ? 2000 : false;
    },
  });
};

// hook to fetch a single executions using suspense
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};
