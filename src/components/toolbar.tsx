"use client";

import { Session, User } from "better-auth";
import { authClient } from "@/utils/auth-client";
import Navlink from "./navlink"
import { redirect } from "next/navigation";

export default function Toolbar({ session, user }: { session: Session, user: User }) {
    return (
        <div className="flex w-dvw flex-row items-center justify-between p-4 bg-zinc-950 border-b border-zinc-900">
            <div className="flex flex-row items-center gap-4">
                <h1 className="text-2xl font-bold">meownel</h1>
                <Navlink href="/dashboard" title="home"/>
                <Navlink href="/deployments" title="deployments"/>
            </div>
            <div className="hidden sm:flex flex-row items-center gap-4">
                <p className="text-sm text-zinc-400">Logged in as {user.name}</p>
                <div className="w-[1px] h-[32px] bg-zinc-800" />
                <button 
                    className="text-sm text-pink-500 hover:underline cursor-pointer"
                    onClick={async () => {
                        await authClient.signOut({
                            fetchOptions: {
                                onSuccess() {
                                    redirect("/");
                                }
                            }
                        });
                    }}
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}