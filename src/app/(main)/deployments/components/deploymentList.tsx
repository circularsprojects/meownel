"use client";

import { useState, useEffect } from "react";
import NodeDropdown from "./nodeDropdown";
import { Input } from "@/components/ui/input";
import Deployment from "./deployment";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "@/components/toast";
import { V1DeploymentList } from "@kubernetes/client-node";

export default function DeploymentList() {
    const [filter, setFilter] = useState("");
    const [nodeFilter, setNodeFilter] = useState("");
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
        <div className="w-full h-full flex flex-col gap-4 items-center px-8 lg:px-38 xl:px-72">
            <h1 className="text-3xl font-bold mt-4">Deployments</h1>
            <div className="flex flex-row max-w-[44rem] w-full gap-2">
                <Input type="search" placeholder="Filter deployments" {...{ value: filter, onChange: (e) => setFilter(e.target.value) }} />
                <NodeDropdown {...{ value: nodeFilter, onChangeAction: setNodeFilter }} />
                <Button variant="outline"><Plus/>New</Button>
            </div>
            {loading ? (
                <LoaderCircle className="animate-spin h-12 w-12 text-gray-500" />
            ) : (
                error ? (
                    <div className="bg-red-500/50 border border-red-500 p-2">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid w-full gap-4">
                        {/* {instances.map((instance) => {
                            if ((instance.display_name.toLowerCase().includes(filter.toLowerCase()) || instance.name.toLowerCase().includes(filter.toLowerCase())) &&
                                (nodeFilter === "" || instance.node === nodeFilter)) {
                                return <Instance key={instance.name} {...instance} />;
                            }
                            return null;
                        })} */}
                        {deployments && deployments.items.map((deployment) => {
                            const metadata = deployment.metadata!;
                            const name = metadata.name!;
                            const displayName = metadata?.annotations?.displayName;
                            const node = deployment.spec?.template.spec?.nodeSelector?.["kubernetes.io/hostname"];
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
                            
                            if ((displayName?.toLowerCase().includes(filter.toLowerCase()) || name?.toLowerCase().includes(filter.toLowerCase())) && (nodeFilter === "" || node === nodeFilter)) {
                                return <Deployment key={name} name={name} display_name={displayName ? displayName : name} node={node ? node : "Unknown Node"} image={bestImage ? bestImage : "Unknown Image"} running={replicas ? replicas > 0 : false} />;
                            }
                            return null;
                        })}
                    </div>
                )
            )}
        </div> 
    )
}