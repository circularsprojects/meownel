import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Power, Settings } from "lucide-react";

export default function Deployment({ name, display_name, node, image, running }: { name: string; display_name: string; node: string; image: string, running?: boolean }) {
    async function powerAction() {
        if (running) {
            toast({
                title: "Stopping deployment...",
                description: `Scaling deployment "${name}" to 0 on node "${node}"`,
            })
        } else {
            toast({
                title: "Starting deployment...",
                description: `Scaling deployment "${name}" to 1 on node "${node}"`,
            })
        }
    }

    return (
        <div className="p-4 bg-card">
            <div className="flex flex-row items-center gap-2">
                {running ? (
                    <span className="size-3 block rounded-full bg-green-500" />
                ): (
                    <span className="size-3 block rounded-full bg-red-500" />
                )}
                <h2 className="text-xl font-semibold">{display_name}</h2>
            </div>
            <p className="text-muted-foreground text-sm overflow-hidden text-ellipsis whitespace-nowrap">Node: <span className="font-mono">{node}</span></p>
            <p className="text-muted-foreground text-sm overflow-hidden text-ellipsis whitespace-nowrap">Image: <span className="font-mono">{image}</span></p>
            <div className="flex flex-row mt-2 gap-2">
                <Button variant="outline" size="sm" onClick={powerAction}><Power /> {running ? "Stop" : "Start"}</Button>
                <Button variant="outline" size="sm"><Settings />Manage</Button>
            </div>
        </div>
    )
}