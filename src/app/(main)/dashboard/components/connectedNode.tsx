"use client";

export default function ConnectedNode({name}: {name: string}) {
    return (
        <div className="w-full border-l-4 border-zinc-800 p-2 rounded-md flex flex-row justify-between">
            <div>
                <h2 className="text-md font-bold">{name}</h2>
            </div>
        </div>
    )
}