"use client";
export default function MarginChips({ set }: { set: (v:number)=>void }) {
    const presets = [15,25,35];
    return (
        <div className="flex gap-2">
            {presets.map(p=>(
                <button key={p} onClick={()=>set(p)} className="border rounded-lg px-3 py-1 hover:bg-gray-50 hover:text-[#191919]">
                    {p}%
                </button>
            ))}
        </div>
    );
}
