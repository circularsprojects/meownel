import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Toolbar from "@/components/toolbar";
import ActiveInstances from "./components/activeInstances";

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
                {/* I Do Not Care if the image is "unoptimized". I want this to be a PIXEL PERFECT image, and ANY sort of compression ruins it. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/meownel.png" alt="" className="pixelated relative -z-10" width={512} height={256} />
                <ActiveInstances />
                {/* <button className="bg-pink-500 w-[48.5rem] p-2 rounded-xl">
                    Create New Instance
                </button> */}
            </div>
        </div>
    )
}