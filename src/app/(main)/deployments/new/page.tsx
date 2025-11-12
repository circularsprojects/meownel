import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Toolbar from "@/components/toolbar";
import DeploymentForm from "./components/deploymentForm";

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
            <div className="flex flex-col items-center mt-8">
                <DeploymentForm />
            </div>
        </div>
    )
}