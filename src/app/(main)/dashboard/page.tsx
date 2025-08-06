import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Toolbar from "@/components/toolbar";
import ServerRowItem from "./components/serverRowItem";

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
            <div className="w-full h-full flex items-center justify-center">
                <div className="flex p-2 gap-2">
                    <div className="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] min-h-[12rem]">
                        <h1 className="text-2xl font-bold mb-3">Active Servers</h1>
                        <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto no-scrollbar">
                            <ServerRowItem name="meow server" image="itzg/minecraft-server" />
                            <ServerRowItem name="goob server" image="itzg/minecraft-server" />
                            <ServerRowItem name="paw craft" image="itzg/minecraft-server" />
                        </div>
                    </div>
                    <div className="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] min-h-[12rem]">
                        <h1 className="text-2xl font-bold mb-3">Active Proxies</h1>
                        <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto no-scrollbar">
                            <ServerRowItem name="gate proxy" image="itzg/minecraft-server" />
                            <ServerRowItem name="geyser" image="itzg/minecraft-server" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}