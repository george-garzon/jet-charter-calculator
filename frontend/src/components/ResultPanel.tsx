"use client";
import MLBadge from "./ui/MLBadge";
import PdfButton from "./ui/PdfButton";

type Result = {
    route?: { depart: string; arrive: string; distance_nm: number };
    aircraft?: { category: string; model: string; speed_kts: number };
    assumptions?: {
        avg_wind_kts: number; taxi_min: number; reposition_nm: number; margin_pct: number;
        oat_c_depart?: number; oat_c_arrive?: number;
        density_altitude_ft?: { depart:number; arrive:number };
        required_runway_ft?: number;
    };
    time?: { air_time_hr: number; taxi_hr: number; block_hr: number };
    costs?: { doc_total: number; airport_fees: number; fuel_surcharge?: number; cost_basis: number };
    sell_price_usd?: number;
    ml_prediction_usd?: number;
    ml_delta_usd?: number;
};

export default function ResultPanel({ data, payload }: { data: Result; payload: any }) {
    return (
        <div className="border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="font-medium">
                    {data.aircraft?.model} • {data.aircraft?.category}
                </h3>
                <MLBadge delta={data.ml_delta_usd}/>
            </div>

            <p>
                <b>{data.route?.depart}</b> → <b>{data.route?.arrive}</b> • {data.route?.distance_nm} nm
            </p>
            <p className="text-sm">
                Block: {data.time?.block_hr} h (Air {data.time?.air_time_hr} + Taxi {data.time?.taxi_hr})
            </p>

            {data.assumptions?.density_altitude_ft && (
                <p className="text-xs text-[#A3A3A3]">
                    DA: dep {data.assumptions.density_altitude_ft.depart} ft, arr {data.assumptions.density_altitude_ft.arrive} ft •
                    Req RWY ~ {data.assumptions.required_runway_ft} ft
                </p>
            )}

            <ul className="grid md:grid-cols-2 gap-2 text-sm">
                <li>DOC Total: ${data.costs?.doc_total}</li>
                <li>Airport Fees: ${data.costs?.airport_fees}</li>
                <li>Cost Basis: ${data.costs?.cost_basis}</li>
                <li>Margin: {data.assumptions?.margin_pct}%</li>
            </ul>

            <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm">Total Price</span>
                <b className="text-lg">${data.sell_price_usd}</b>
            </div>

            <div className="flex gap-2">
                {typeof data.ml_prediction_usd === "number" && (
                    <span className="text-xs text-[#A3A3A3]">
            ML Pred: ${data.ml_prediction_usd}
          </span>
                )}
                <PdfButton payload={payload}/>
            </div>
        </div>
    );
}
