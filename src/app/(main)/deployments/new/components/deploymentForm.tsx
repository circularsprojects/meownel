"use client";

import { useState } from "react";
import NodeDropdown from "../../components/nodeDropdown";
import FormInput from "./formInput";
import ListInput from "./listInput";

export default function DeploymentForm() {
    const [formData, setFormData] = useState({
        name: "",
        label: "",
        node: "",
        image: "",
        dataMountPath: "",
        envVars: ["test1", "test2", "test3"] as string[],
    });

    const [autoName, setAutoName] = useState("my-awesome-server-1");

    const updateLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, label: e.target.value });
        const generatedName = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
        setAutoName(generatedName.length > 0 ? generatedName : "my-awesome-server-1");
    };

    const updateEnvVars = (newEnvVars: string[]) => {
        setFormData({ ...formData, envVars: newEnvVars });
    };

    return (
        <div className="flex flex-col gap-6 p-8 sm:border-pink-500 sm:border-2 w-full sm:w-[48rem] shadow-lg">
            <h1 className="text-3xl font-bold">Creating a new Deployment</h1>
            <form onSubmit={() => {}} className="flex flex-col justify-evenly gap-4">
                <FormInput
                    label="Deployment Label"
                    id="label"
                    placeholder="My Awesome Server!!!11!!"
                    onChange={(e) => {
                        updateLabel(e);
                    }}
                    value={formData.label}
                    required
                />
                
                <FormInput
                    label="Deployment Name"
                    id="name"
                    placeholder={autoName}
                    onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                    }}
                    value={formData.name}
                />    

                <div className="flex flex-col gap-2">
                    <label htmlFor="node">Deployment Node</label>
                    <NodeDropdown {...{ value: formData.node, onChangeAction: (value) => setFormData({ ...formData, node: value }), id: "node" }} />
                </div>

                <FormInput
                    label="Deployment Image"
                    id="image"
                    placeholder="itzg/minecraft-server"
                    onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                    }}
                    value={formData.image}
                />

                <FormInput
                    label="Data Mount Path"
                    id="data-mount-path"
                    placeholder="~/servers/minecraft-server"
                    onChange={(e) => {
                        setFormData({ ...formData, dataMountPath: e.target.value });
                    }}
                    required
                    value={formData.dataMountPath}
                />

                <div className="flex flex-col gap-2">
                    <label htmlFor="node">Environment Variables</label>
                    <ListInput id="vars" list={formData.envVars} onChange={updateEnvVars} />
                </div>
            </form>
        </div>
    )
}