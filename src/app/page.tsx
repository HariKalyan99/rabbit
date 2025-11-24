"use client";

import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());


  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success('Ai Job queued')
    },
    onError: () => {
      toast.error('Something went wrong!')
    }
  }))
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success('Job queued')
    }
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 gap-y-6 flex-col">
      Prtected server component <div>{JSON.stringify(data, null, 2)}</div>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Workflow
      </Button>

      <Button onClick={() => testAi.mutate()} disabled={testAi.isPending}>
      testAi
      </Button>
      <LogoutButton />
    </div>
  );
};

export default Page;
