"use client";

import { useEffect, useState } from "react";
import ActiveDeployment from "./activeDeployment";
import { toast } from "@/components/toast";
import { LoaderCircle } from "lucide-react";
import { V1DeploymentList } from "@kubernetes/client-node";
import ConnectedNode from "./connectedNode";

export default function ActiveDeploymentList() {
    const [deployments, setDeployments] = useState<V1DeploymentList | null>(null);
    const [dLoading, setdLoading] = useState(true);
    const [dError, setdError] = useState<string | null>(null);

    const [nodes, setNodes] = useState<string[]>([]);
    const [nLoading, setnLoading] = useState(true);
    const [nError, setnError] = useState<string | null>(null);

    useEffect(() => {
        let statusCode: number;

        fetch("/api/deployments")
            .then(res => {
                statusCode = res.status;
                return res.json();
            })
            .then(data => {
                if (statusCode === 200) {
                    setDeployments(data);
                } else {
                    setDeployments(null);
                    setdError(`Error fetching deployments: ${data.message ? data.message : data.body ? data.body : `Error code ${statusCode}`}`);
                }
                setdLoading(false);
            })
            .catch((err) => {
                toast({
                    title: `Error fetching deployments (${statusCode})`,
                    description: err.message,
                });
                setDeployments(null);
                setdError(err.message);
                setdLoading(false);
            });
    }, []);

    useEffect(() => {
        let statusCode: number;

        fetch("/api/nodes")
            .then(res => {
                statusCode = res.status;
                return res.json();
            })
            .then(data => {
                if (statusCode === 200) {
                    setNodes(data);
                } else {
                    setNodes([]);
                    setnError(`Error fetching nodes: ${data.message ? data.message : data.body ? data.body : `Error code ${statusCode}`}`);
                }
                setnLoading(false);
            })
            .catch((err) => {
                toast({
                    title: `Error fetching nodes (${statusCode})`,
                    description: err.message,
                });
                setNodes([]);
                setnError(err.message);
                setnLoading(false);
            });
    }, []);

    return (
        <div className="flex p-2 gap-2">
            <div className="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] max-w-[40rem] min-h-[12rem]">
                <h1 className="text-2xl font-bold mb-3">Active Deployments</h1>
                <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto">
                    {dLoading ? (
                        <LoaderCircle className="animate-spin h-12 w-12 text-gray-500" />
                    ) : (
                        dError ? (
                            <div className="bg-red-500/50 border border-red-500 p-2">
                                <p>{dError}</p>
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
            <div className="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] max-w-[40rem] min-h-[12rem]">
                <h1 className="text-2xl font-bold mb-3">Connected Nodes</h1>
                <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto">
                    {nLoading ? (
                        <LoaderCircle className="animate-spin h-12 w-12 text-gray-500" />
                    ) : (
                        nError ? (
                            <div className="bg-red-500/50 border border-red-500 p-2">
                                <p>{nError}</p>
                            </div>
                        ) : (
                            nodes.map((node) => {
                                return <ConnectedNode name={node} key={node} />;
                            })
                        )
                    )}
                </div>
            </div>
        </div>
    )
}