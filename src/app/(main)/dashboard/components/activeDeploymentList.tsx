"use client";

import { useEffect, useState } from "react";
import ActiveDeployment from "./activeDeployment";
import { toast } from "@/components/toast";
import { LoaderCircle } from "lucide-react";
import { V1DeploymentList } from "@kubernetes/client-node";

export default function ActiveDeploymentList() {
    const [deployments, setDeployments] = useState<V1DeploymentList | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let statusCode: number;

        fetch("/api/deployments")
            .then(res => {
                statusCode = res.status;
                return res.json();
            })
            .then(data => {
                setDeployments(data);
                setLoading(false);
            })
            .catch((err) => {
                toast({
                    title: `Error fetching deployments (${statusCode})`,
                    description: err.message,
                });
                setDeployments(null);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex p-2 gap-2">
            <div className="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] min-h-[12rem]">
                <h1 className="text-2xl font-bold mb-3">Active Deployments</h1>
                <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto">
                    {loading ? (
                        <LoaderCircle className="animate-spin h-12 w-12 text-gray-500" />
                    ) : (
                        error ? (
                            <div className="bg-red-500/50 border border-red-500 p-2">
                                <p>{error}</p>
                            </div>
                        ) : (
                            <>
                            {deployments && deployments.items.map((deployment) => {
                                const metadata = deployment.metadata!;
                                const name = metadata.name!;
                                const displayName = metadata?.annotations?.displayName;
                                const replicas = deployment.spec?.replicas;
    
                                const containers = deployment.spec?.template.spec?.containers;
                                const bestImage = (() => {
                                    if (!containers || containers.length === 0) return null;
                                    if (containers.length === 1) return containers[0].image;
                                    for (const container of containers) {
                                        if (container.image?.includes("java") || container.image?.includes("minecraft")) {
                                            return container.image;
                                        }
                                    }
                                })();

                                if (replicas && replicas > 0) {
                                    return <ActiveDeployment key={name} name={displayName ? displayName : name} image={bestImage ? bestImage : "Unknown Image"} />;
                                }
                                return null;
                            })}
                            </>
                        )
                    )}
                </div>
            </div>
            <div className="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] min-h-[12rem]">
                <h1 className="text-2xl font-bold mb-3">Connected Nodes</h1>
                <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto">
                    {/* {loading ? (
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
                    )} */}
                </div>
            </div>
        </div>
    )
}