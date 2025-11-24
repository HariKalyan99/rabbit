import { requireAuth } from "@/lib/auth-utils";



const Page = async() => {
    await requireAuth(); //protect routes

    return <p>Workflows</p>
}

export default Page;