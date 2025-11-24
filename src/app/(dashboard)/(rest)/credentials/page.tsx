import { requireAuth } from "@/lib/auth-utils";

const Page = async() => {
    await requireAuth(); //protect routes

    return <p>Credentials</p>
}

export default Page;