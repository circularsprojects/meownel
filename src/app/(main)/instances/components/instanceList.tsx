"use client";

import { useState, useEffect } from "react";
import NodeDropdown from "./nodeDropdown";
import { Input } from "@/components/ui/input";
import Instance from "./Instance";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "@/components/toast";

export default function InstanceList() {
    const [filter, setFilter] = useState("");
    const [nodeFilter, setNodeFilter] = useState("");
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
        <div className="w-full h-full flex flex-col gap-4 items-center px-8 lg:px-38 xl:px-72">
            <h1 className="text-3xl font-bold mt-4">Instances</h1>
            <div className="flex flex-row max-w-[44rem] w-full gap-2">
                <Input type="search" placeholder="Filter instances" {...{ value: filter, onChange: (e) => setFilter(e.target.value) }} />
                <NodeDropdown {...{ value: nodeFilter, onChange: setNodeFilter }} />
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
                        {instances.map((instance) => {
                            if ((instance.display_name.toLowerCase().includes(filter.toLowerCase()) || instance.name.toLowerCase().includes(filter.toLowerCase())) &&
                                (nodeFilter === "" || instance.node === nodeFilter)) {
                                return <Instance key={instance.name} {...instance} />;
                            }
                            return null;
                        })}
                    </div>
                )
            )}
        </div> 
    )
}