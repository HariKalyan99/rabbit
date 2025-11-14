import { getQueryClient, trpc } from "@/trpc/server";
import React, { Suspense } from "react";
import Client from "./client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const page = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <Client />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default page;
