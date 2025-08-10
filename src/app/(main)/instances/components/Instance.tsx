import { Button } from "@/components/ui/button";
import { Power, Settings } from "lucide-react";

export default function Instance({ name, node, image }: { name: string; node: string; image: string }) {
    return (
        <div className="p-4 bg-card">
            <div className="flex flex-row items-center gap-2">
                <span className="size-3 block rounded-full bg-green-500" />
                <h2 className="text-xl font-semibold">{name}</h2>
            </div>
            <p className="text-muted-foreground text-sm overflow-hidden text-ellipsis whitespace-nowrap">Node: <span className="font-mono">{node}</span></p>
            <p className="text-muted-foreground text-sm overflow-hidden text-ellipsis whitespace-nowrap">Image: <span className="font-mono">{image}</span></p>
            <div className="flex flex-row mt-2 gap-2">
                <Button variant="outline" size="sm"><Power />Stop</Button>
                <Button variant="outline" size="sm"><Settings />Manage</Button>
            </div>
        </div>
    )
}