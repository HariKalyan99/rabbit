import { LoginForm } from "@/features/auth/components/login-form";
import { requireNoAuth } from "@/lib/auth-utils";
import Image from "next/image";
import Link from "next/link";

const Page = async () => {
  await requireNoAuth();
  return <LoginForm />;
};

export default Page;
