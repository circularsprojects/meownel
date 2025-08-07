import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Toolbar from "@/components/toolbar";
import ActiveInstanceItem from "./components/activeInstanceItem";

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
            <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                <div className="flex p-2 gap-2">
                    <div className="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] min-h-[12rem]">
                        <h1 className="text-2xl font-bold mb-3">Active Instances</h1>
                        <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto no-scrollbar">
                            <ActiveInstanceItem name="meow server" image="itzg/minecraft-server" />
                            <ActiveInstanceItem name="goob server" image="itzg/minecraft-server" />
                            <ActiveInstanceItem name="paw craft" image="itzg/minecraft-server" />
                        </div>
                    </div>
                    <div className="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] min-h-[12rem]">
                        <h1 className="text-2xl font-bold mb-3">Active Proxies</h1>
                        <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto no-scrollbar">
                            <ActiveInstanceItem name="gate proxy" image="itzg/minecraft-server" />
                            <ActiveInstanceItem name="geyser" image="itzg/minecraft-server" />
                        </div>
                    </div>
                </div>
                {/* <button className="bg-pink-500 w-[48.5rem] p-2 rounded-xl">
                    Create New Instance
                </button> */}
            </div>
        </div>
    )
}