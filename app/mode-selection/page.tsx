'use client'

import { useRouter } from "next/navigation";


export default function ModeSelection() {
    const router = useRouter();

    const handleModeSelect = (mode: 'solo' | 'multiplayer') => {
        router.push(`/?modes=${mode}`)
    };



    return(
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-white px-4">
            <h1 className="text-3xl font-bold">Select Game Mode</h1>
            <button onClick={() => handleModeSelect("solo")} className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold shadow-md hover:bg-yellow-300">Solo</button>
            <button onClick={() => handleModeSelect("multiplayer")} className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold shadow-md hover:bg-yellow-300">Multiplayer</button>
        </div>
    )
    
}