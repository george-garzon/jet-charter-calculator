"use client";

import { useEffect, useMemo, useState } from "react";
import SelectField from "./fields/SelectField";
import SliderField from "./sliders/SliderField";
import MarginChips from "./ui/MarginChips";
import ResultPanel from "./ResultPanel";
import { getJSON, postJSON } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";

type Catalog = {
    airports: { icao: string; fees: number; rwy: number }[];
    jets: { category: string; model: string }[];
};

export default function Calculator() {
    const [catalog, setCatalog] = useState<Catalog | null>(null);
    const [depart, setDepart] = useState("KTEB");
    const [arrive, setArrive] = useState("KMIA");
    const [category, setCategory] = useState("");
    const [model, setModel] = useState("");

    // sliders/inputs
    const [avgWind, setAvgWind] = useState(0);
    const [margin, setMargin] = useState(20);
    const [taxi, setTaxi] = useState(20);
    const [reposition, setReposition] = useState(0);
    const [oatDep, setOatDep] = useState(15);
    const [oatArr, setOatArr] = useState(15);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState<any>(null);
    const [useML, setUseML] = useState(true);

    useEffect(() => {
        (async () => {
            const c = await getJSON<Catalog>("/api/catalog");
            setCatalog(c);
            if (c.jets.length) {
                setCategory(c.jets[0].category);
                setModel(c.jets[0].model);
            }
        })().catch(err => setError(err.message));
    }, []);

    const categories = useMemo(() => {
        const map = new Map<string, string[]>();
        catalog?.jets.forEach(j => {
            if (!map.has(j.category)) map.set(j.category, []);
            map.get(j.category)!.push(j.model);
        });
        return map;
    }, [catalog]);

    useEffect(() => {
        const models = categories.get(category);
        if (models && !models.includes(model)) setModel(models[0]);
    }, [category, categories, model]);

    async function calculate() {
        setLoading(true); setError(""); setData(null);
        const payload = {
            depart_icao: depart,
            arrive_icao: arrive,
            jet_model: model,
            avg_wind_kts: avgWind,
            margin_pct: margin,
            taxi_min: taxi,
            reposition_nm: reposition,
            oat_c_depart: oatDep,
            oat_c_arrive: oatArr,
        };
        try {
            const endpoint = useML ? "/api/price-ml" : "/api/price";
            const res = await postJSON<any>(endpoint, payload);
            if (res.error) setError(res.error);
            else setData({ res, payload });
        } catch (e:any) {
            setError(e.message || "Network error");
        } finally {
            setLoading(false);
        }
    }

    if (!catalog) return <div>Loading catalog…</div>;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[#A3A3A3]">
                <SelectField label="From (ICAO)" value={depart} onChange={e=>setDepart(e.target.value)}>
                    {catalog.airports.map(a => <option key={a.icao} value={a.icao}>{a.icao}</option>)}
                </SelectField>
                <SelectField label="To (ICAO)" value={arrive} onChange={e=>setArrive(e.target.value)}>
                    {catalog.airports.map(a => <option key={a.icao} value={a.icao}>{a.icao}</option>)}
                </SelectField>
                <SelectField label="Jet Class" value={category} onChange={e=>setCategory(e.target.value)}>
                    {[...categories.keys()].map(c => <option key={c} value={c}>{c}</option>)}
                </SelectField>
                <SelectField label="Jet Model" value={model} onChange={e=>setModel(e.target.value)}>
                    {(categories.get(category) || []).map(m => <option key={m} value={m}>{m}</option>)}
                </SelectField>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
                <SliderField label="Avg Wind (kts)" value={avgWind} min={-50} max={50}
                             onChange={setAvgWind} hint="Headwind positive, tailwind negative" />
                <div className="space-y-3 border rounded-xl p-3">
                    <SliderField label="Margin %" value={margin} min={0} max={60} step={1} onChange={setMargin} />
                    <MarginChips set={setMargin}/>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
                <SliderField
                    label="Taxi (min)"
                    hint="Estimated taxi time from gate to takeoff or after landing."
                    value={taxi}
                    min={0}
                    max={40}
                    step={5}
                    onChange={setTaxi}
                />
                <SliderField
                    label="Reposition (nm)"
                    hint="Distance flown (in nautical miles) to move the aircraft before or after the trip."
                    value={reposition}
                    min={0}
                    max={500}
                    step={10}
                    onChange={setReposition}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
                <SliderField
                    label="OAT Depart (°C)"
                    hint="Outside Air Temperature at departure airport — affects performance."
                    value={oatDep}
                    min={-10}
                    max={45}
                    step={1}
                    onChange={setOatDep}
                />
                <SliderField
                    label="OAT Arrive (°C)"
                    hint="Outside Air Temperature at arrival airport — affects landing performance."
                    value={oatArr}
                    min={-10}
                    max={45}
                    step={1}
                    onChange={setOatArr}
                />
            </div>


            <div className="flex items-center gap-3">
                <button onClick={calculate} disabled={loading} className="border rounded-lg px-4 py-2 hover:bg-gray-50 hover:text-[#191919]">
                {loading ? "Calculating…" : "Calculate Price"}
                </button>
                <label className="text-sm flex items-center gap-2">
                    <Checkbox
                        checked={useML}
                        onCheckedChange={(checked) => setUseML(Boolean(checked))}
                    />
                    Include ML prediction
                </label>
                {error && <span className="text-red-600 text-sm">{error}</span>}
            </div>

            {data?.res && <ResultPanel data={data.res} payload={data.payload} />}
        </div>
    );
}
