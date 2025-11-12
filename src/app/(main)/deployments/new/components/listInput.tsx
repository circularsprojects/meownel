import { Button } from "@/components/ui/button";
import { Pencil, Plus, X } from "lucide-react";
import { useState } from "react";

export default function ListInput({
    id,
    list,
    onChange
}: {
    id: string;
    list: string[];
    onChange: (newList: string[]) => void;
}) {
    const updateItem = (index: number, newValue: string) => {
        const newList = [...list];
        newList[index] = newValue;
        onChange(newList);
    }

    return (
        <div className="flex flex-col w-full rounded-md border border-zinc-800 text-white [&>*]:p-2 [&>*:nth-child(even)]:bg-zinc-900 overflow-scroll no-scrollbar max-h-48" id={id}>
            {list.map((item, index) => (
                <Item key={index} value={item} onChange={(newValue) => updateItem(index, newValue)} />
            ))}
            <div className="flex flex-row justify-between items-center gap-4">
                <input type="text" placeholder="new..." className="w-full text-white outline-none duration-200 font-mono" />
                <Button type="button" variant="outline" size="sm" className="opacity-50 hover:opacity-100 duration-100">
                    <Plus />
                    Add
                </Button>
            </div>
        </div>
    )
}

function Item({
    value,
    onChange
}: {
    value: string;
    onChange: (newValue: string) => void;
}) {
    const [editable, setEditable] = useState(false);

    const updateValue = (newValue: string) => {
        onChange(newValue);
    };

    if (!editable) {
        return (
            <div className="flex flex-row justify-between items-center gap-4">
                <p className="font-mono">{value}</p>
                <div>
                    <Button type="button" variant="ghost" size="sm" className="opacity-50 hover:opacity-100 duration-100" onClick={()=>{setEditable(true)}}>
                        <Pencil />
                    </Button>
                    <Button type="button" variant="destructiveGhost" size="sm" className="opacity-50 hover:opacity-100 duration-100">
                        <X />
                    </Button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-row justify-between items-center gap-4">
                <input type="text" placeholder="new..." className="w-full text-white/70 outline-none duration-200 font-mono" value={value} onChange={(e) => updateValue(e.target.value)} />
                <Button type="button" variant="outline" size="sm" className="opacity-50 hover:opacity-100 duration-100" onClick={()=>{setEditable(false)}}>
                    <Pencil />
                    Save
                </Button>
            </div>
        )
    }
}