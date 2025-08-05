import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Toolbar from "@/components/toolbar";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
 
    if(!session) {
        redirect("/")
    }

    return (
        <div className="w-full h-full flex flex-col">
            <Toolbar session={session.session} user={session.user} />
            <div className="w-full h-full flex-1">
                <p>meow</p>
            </div>
        </div>
    )
}