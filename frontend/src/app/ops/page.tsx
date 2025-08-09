"use client";

import { useMemo, useState } from "react";

type Aircraft = { tail: string; position: string };
type Leg = { id: string; start: string; end: string; etd?: string; eta?: string };
type OptimizerResponse = {
    error?: string;
    assignment?: Record<string, string[]>;
    objective_nm?: number;
};

export default function OpsPage() {
    const [aircraft, setAircraft] = useState(
        `[{"tail":"N123","position":"KTEB"},{"tail":"N456","position":"KVNY"}]`
    );
    const [legs, setLegs] = useState(
        `[
{"id":"L1","start":"KTEB","end":"KMIA","etd":"2025-08-10T10:00:00Z","eta":"2025-08-10T13:00:00Z"},
{"id":"L2","start":"KVNY","end":"KLAS","etd":"2025-08-10T11:00:00Z","eta":"2025-08-10T12:00:00Z"}
]`
    );
    const [result, setResult] = useState<OptimizerResponse | null>(null);
    const [error, setError] = useState<string>("");

    const parsedAircraft = useMemo<Aircraft[] | null>(() => {
        try {
            return JSON.parse(aircraft) as Aircraft[];
        } catch {
            return null;
        }
    }, [aircraft]);

    const parsedLegs = useMemo<Leg[] | null>(() => {
        try {
            return JSON.parse(legs) as Leg[];
        } catch {
            return null;
        }
    }, [legs]);

    async function run() {
        setError("");
        setResult(null);
        try {
            const r = await fetch("/api/optimizer/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ aircraft: parsedAircraft, legs: parsedLegs }),
            });
            const json = (await r.json()) as OptimizerResponse;
            if (!r.ok || json.error) setError(json.error || "Optimizer error");
            else setResult(json);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Network error";
            setError(msg);
        }
    }

    // ====== SAMPLE LOADERS ======
    function loadTinySample() {
        setAircraft(`[{"tail":"N100","position":"KTEB"}]`);
        setLegs(`[
{"id":"A","start":"KTEB","end":"KBOS"},
{"id":"B","start":"KTEB","end":"KPHL"}
]`);
    }

    function loadCoastToCoast() {
        setAircraft(`[{"tail":"N321","position":"KVNY"},{"tail":"N654","position":"KTEB"}]`);
        setLegs(`[
{"id":"W1","start":"KVNY","end":"KLAS"},
{"id":"E1","start":"KTEB","end":"KMIA"},
{"id":"E2","start":"KTEB","end":"KATL"}
]`);
    }

    function loadMultiLegShuttle() {
        setAircraft(`[{"tail":"N777","position":"KSFO"},{"tail":"N888","position":"KLAX"}]`);
        setLegs(`[
{"id":"S1","start":"KSFO","end":"KLAX"},
{"id":"S2","start":"KLAX","end":"KSAN"},
{"id":"S3","start":"KSAN","end":"KLAX"},
{"id":"S4","start":"KLAX","end":"KSFO"}
]`);
    }

    function loadEuropeTour() {
        setAircraft(`[{"tail":"G-EUR1","position":"EGLL"},{"tail":"D-JET1","position":"EDDF"}]`);
        setLegs(`[
{"id":"EU1","start":"EGLL","end":"LFPG"},
{"id":"EU2","start":"LFPG","end":"LEBL"},
{"id":"EU3","start":"LEBL","end":"LIRF"},
{"id":"EU4","start":"LIRF","end":"EDDF"}
]`);
    }

    function loadBusyFleet() {
        setAircraft(`[
{"tail":"N101","position":"KORD"},
{"tail":"N202","position":"KLAX"},
{"tail":"N303","position":"KJFK"},
{"tail":"N404","position":"KMIA"}
]`);
        setLegs(`[
{"id":"B1","start":"KORD","end":"KDEN"},
{"id":"B2","start":"KDEN","end":"KLAX"},
{"id":"B3","start":"KLAX","end":"KSFO"},
{"id":"B4","start":"KSFO","end":"KSEA"},
{"id":"B5","start":"KJFK","end":"KMIA"},
{"id":"B6","start":"KMIA","end":"KATL"}
]`);
    }

    return (
        <main className="max-w-6xl mx-auto p-6 space-y-5 text-white min-h-screen">
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Operations Optimizer</h1>
                    <p className="text-sm text-[#A3A3A3] mt-1">
                        Assigns revenue <em>legs</em> to available <em>aircraft</em> to minimize repositioning distance.
                        This is a first-pass assignment (no chaining/sequencing yet) that demonstrates Python + OR-Tools.
                    </p>
                </div>
            </header>

            <section className="grid md:grid-cols-3 gap-3">
                <div className="md:col-span-2 border border-[#2a2a2a] bg-[#1f1f1f] rounded-xl p-4 space-y-3">
                    <h2 className="font-medium">Inputs</h2>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm mb-1">Aircraft JSON</label>
                            <textarea
                                className="w-full border border-[#2a2a2a] bg-[#171717] rounded-lg p-2 h-48 font-mono text-xs"
                                value={aircraft}
                                onChange={(e) => setAircraft(e.target.value)}
                            />
                            <p className="text-xs text-[#A3A3A3] mt-1">
                                {parsedAircraft ? `${parsedAircraft.length} aircraft loaded` : "Invalid JSON"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Legs JSON</label>
                            <textarea
                                className="w-full border border-[#2a2a2a] bg-[#171717] rounded-lg p-2 h-48 font-mono text-xs"
                                value={legs}
                                onChange={(e) => setLegs(e.target.value)}
                            />
                            <p className="text-xs text-[#A3A3A3] mt-1">
                                {parsedLegs ? `${parsedLegs.length} legs loaded` : "Invalid JSON"}
                            </p>
                        </div>
                    </div>

                    {/* SAMPLE BUTTONS */}
                    <div className="flex flex-wrap gap-2">
                        <button onClick={loadTinySample} className="px-3 py-1 border rounded-lg">
                            Tiny Sample
                        </button>
                        <button onClick={loadCoastToCoast} className="px-3 py-1 border rounded-lg">
                            Coast to Coast
                        </button>
                        <button onClick={loadMultiLegShuttle} className="px-3 py-1 border rounded-lg">
                            Multi-Leg Shuttle
                        </button>
                        <button onClick={loadEuropeTour} className="px-3 py-1 border rounded-lg">
                            Europe Tour
                        </button>
                        <button onClick={loadBusyFleet} className="px-3 py-1 border rounded-lg">
                            Busy Fleet
                        </button>
                    </div>

                    <button
                        onClick={run}
                        disabled={!parsedAircraft || !parsedLegs}
                        className="border rounded-lg px-4 py-2 hover:bg-gray-50 hover:text-[#191919] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Optimize
                    </button>
                </div>

                <aside className="border border-[#2a2a2a] bg-[#1f1f1f] rounded-xl p-4 space-y-2">
                    <h3 className="font-medium">What this page does</h3>
                    <ol className="list-decimal list-inside text-sm text-[#A3A3A3] space-y-1">
                        <li>Paste aircraft (with current ICAO) and legs (start → end).</li>
                        <li>Each leg is assigned to exactly one aircraft.</li>
                        <li>Objective minimizes reposition NM from an aircraft’s current position to its assigned leg’s start.</li>
                    </ol>
                    <details className="text-sm text-[#A3A3A3]">
                        <summary className="cursor-pointer">Assumptions & limits</summary>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>No sequencing yet (doesn’t chain multiple legs per tail).</li>
                            <li>No duty-time or maintenance constraints (demo-friendly).</li>
                            <li>Distance is great-circle (gc_nm).</li>
                        </ul>
                    </details>
                    <details className="text-sm text-[#A3A3A3]">
                        <summary className="cursor-pointer">Input schema</summary>
                        <pre className="text-xs mt-1 bg-[#171717] p-2 rounded-md overflow-auto">
{`aircraft: [{ tail: string, position: ICAO }]
legs:     [{ id: string, start: ICAO, end: ICAO, etd?: ISO8601, eta?: ISO8601 }]`}
            </pre>
                    </details>
                </aside>
            </section>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {result && (
                <section className="border border-[#2a2a2a] bg-[#1f1f1f] rounded-xl p-4 space-y-3">
                    <h2 className="font-medium">Results</h2>
                    <p className="text-sm text-[#A3A3A3]">
                        Objective (total reposition NM): <b>{Number(result.objective_nm ?? 0).toFixed(1)}</b>
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-separate border-spacing-0">
                            <thead>
                            <tr>
                                <th className="bg-[#171717] text-left sticky left-0 border-b p-2">Aircraft</th>
                                <th className="bg-[#171717] text-left border-b p-2">Assigned legs</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(result.assignment ?? {}).map(([tail, legIds]) => (
                                <tr key={tail} className="align-top">
                                    <td className="sticky left-0 bg-[#171717] border-b p-2 font-medium">{tail}</td>
                                    <td className="border-b p-2">
                                        {Array.isArray(legIds) && legIds.length ? (
                                            <ul className="list-disc list-inside">
                                                {legIds.map((id) => {
                                                    const leg = parsedLegs?.find((l) => l.id === id);
                                                    return (
                                                        <li key={id}>
                                                            <code>{id}</code>
                                                            {leg ? (
                                                                <span className="text-[#A3A3A3]"> — {leg.start} → {leg.end}</span>
                                                            ) : null}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <span className="text-[#A3A3A3]">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <details>
                        <summary className="cursor-pointer text-sm text-[#A3A3A3]">Raw JSON</summary>
                        <pre className="text-xs overflow-auto bg-[#171717] p-2 rounded-md">
              {JSON.stringify(result, null, 2)}
            </pre>
                    </details>
                </section>
            )}
        </main>
    );
}
