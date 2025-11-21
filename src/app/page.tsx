import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 gap-y-6 flex-col">
      Prtected server component {" "}
      <div>
      {JSON.stringify(data, null, 2)}
      </div>
      <LogoutButton />
    </div>
  );
};

export default Page;
