"use client";

import { useState } from "react";
import NodeDropdown from "./nodeDropdown";
import { Input } from "@/components/ui/input";
import Instance from "./Instance";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function InstanceList() {
    const [filter, setFilter] = useState("");
    const [nodeFilter, setNodeFilter] = useState("");

    return (
        <div className="w-full h-full flex flex-col gap-4 items-center px-8 lg:px-38 xl:px-72">
            <h1 className="text-3xl font-bold mt-4">Instances</h1>
            <div className="flex flex-row max-w-[44rem] w-full gap-2">
                <Input type="search" placeholder="Filter instances" {...{ value: filter, onChange: (e) => setFilter(e.target.value) }} />
                <NodeDropdown {...{ value: nodeFilter, onChange: setNodeFilter }} />
                <Button variant="outline"><Plus/>New</Button>
            </div>
            <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid w-full gap-4">
                <Instance name="meowing" node="kube-node-1" image="itzg/minecraft-serverrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr" />
                <Instance name="meowing" node="kube-node-1" image="itzg/minecraft-server" />
                <Instance name="meowing" node="kube-node-1" image="itzg/minecraft-server" />
                <Instance name="meowing" node="kube-node-1" image="itzg/minecraft-server" />
            </div>
        </div> 
    )
}