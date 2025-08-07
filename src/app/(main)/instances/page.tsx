import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Toolbar from "@/components/toolbar";
import InstanceList from "./components/instanceList";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
 
    if(!session) {
        redirect("/")
    }

    return (
        <div className="flex flex-col h-dvh w-dvw">
            <Toolbar session={session.session} user={session.user} />
            <div className="w-full h-full flex flex-col gap-4 items-center px-72">
                <h1 className="text-3xl font-bold mt-4">Instances</h1>
                <InstanceList />
            </div>
        </div>
    )
}