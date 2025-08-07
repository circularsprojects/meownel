"use client";

import { useState } from "react";

export default function InstanceList() {
    const [filter, setFilter] = useState("");

    return (
        <div className="flex flex-row w-[48rem] justify-between">
            <input
                type="search" 
                id="filter"
                placeholder="Filter instances" 
                className="p-2 rounded-md border border-zinc-800 text-white w-full focus:border-pink-500 outline-none duration-200" 
                onChange={(e) => setFilter(e.target.value)}
                required
            />
        </div>
    )
}