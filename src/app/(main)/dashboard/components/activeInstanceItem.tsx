import { Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function ServerRowItem({name, image}: {name: string, image: string}) {
    return (
        <div className="w-full border border-zinc-800 p-2 rounded-md flex flex-row justify-between">
            <div>
                <h2 className="text-md font-bold">{name}</h2>
                <p className="text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap max-w-[16rem]">
                    {image}
                </p>
            </div>
            <button className="flex items-center justify-center p-2 rounded-md bg-zinc-800 border-zinc-700 border aspect-square hover:bg-zinc-700 hover:border-zinc-600 duration-100 cursor-pointer active:bg-zinc-600">
                <HugeiconsIcon icon={Settings02Icon} />
            </button>
        </div>
    )
}