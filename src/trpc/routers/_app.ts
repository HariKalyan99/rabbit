import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    // console.log({ userId: ctx.auth.user.id });
    return prisma.wrokflow.findMany();
  }),
  createWorkflow:protectedProcedure.mutation(async () => {
    
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "tron@gmail.com"
      }
    })
    return {success: true, message: "Job queued"}
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
