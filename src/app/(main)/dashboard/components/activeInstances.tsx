"use client";

import { useEffect, useState } from "react";
import ActiveInstanceItem from "./activeInstanceItem";
import { toast } from "@/components/toast";
import { LoaderCircle } from "lucide-react";

export default function ActiveInstances() {
    const [instances, setInstances] = useState<Instance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let statusCode: number;

        fetch("/api/instances")
            .then(res => {
                statusCode = res.status;
                return res.json();
            })
            .then(data => {
                setInstances(data);
                setLoading(false);
            })
            .catch((err) => {
                toast({
                    title: `Error fetching instances (${statusCode})`,
                    description: err.message,
                });
                setInstances([]);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex p-2 gap-2">
            <div className="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] min-h-[12rem]">
                <h1 className="text-2xl font-bold mb-3">Active Instances</h1>
                <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto">
                    {loading ? (
                        <LoaderCircle className="animate-spin h-12 w-12 text-gray-500" />
                    ) : (
                        error ? (
                            <div className="bg-red-500/50 border border-red-500 p-2">
                                <p>{error}</p>
                            </div>
                        ) : (
                            instances.map(instance => {
                                if (!instance.tags?.includes("proxy")) {
                                    return <ActiveInstanceItem key={instance.name} name={instance.display_name} image={instance.image} />
                                }
                            })
                        )
                    )}
                </div>
            </div>
            <div className="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] min-h-[12rem]">
                <h1 className="text-2xl font-bold mb-3">Active Proxies</h1>
                <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto">
                    {loading ? (
                        <LoaderCircle className="animate-spin h-12 w-12 text-gray-500" />
                    ) : (
                        error ? (
                            <div className="bg-red-500/50 border border-red-500 p-2">
                                <p>{error}</p>
                            </div>
                        ) : (
                            instances.map(instance => {
                                if (instance.tags?.includes("proxy")) {
                                    return <ActiveInstanceItem key={instance.name} name={instance.display_name} image={instance.image} />
                                }
                            })
                        )
                    )}
                </div>
            </div>
        </div>
    )
}