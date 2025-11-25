import { z } from "zod";
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { TRPCError } from "@trpc/server";
import { workflowsRouter } from "@/features/workflows/servers/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
