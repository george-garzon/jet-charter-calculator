"use client";

import MLBadge from "./ui/MLBadge";
import PdfButton from "./ui/PdfButton";
import type { PricePayload, PriceResult } from "@/types";

function fmt(n?: number) {
    if (typeof n !== "number" || Number.isNaN(n)) return "—";
    return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
function fmt2(n?: number) {
    if (typeof n !== "number" || Number.isNaN(n)) return "—";
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function ResultPanel({
                                        data,
                                        payload,
                                    }: {
    data: PriceResult;
    payload: PricePayload;
}) {
    return (
        <div className="border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="font-medium">
                    {data.aircraft?.model} • {data.aircraft?.category}
                </h3>
                <MLBadge delta={data.ml_delta_usd} />
            </div>

            <p>
                <b>{data.route?.depart}</b> → <b>{data.route?.arrive}</b> • {fmt(data.route?.distance_nm)} nm
            </p>
            <p className="text-sm">
                Block: {fmt2(data.time?.block_hr)} h (Air {fmt2(data.time?.air_time_hr)} + Taxi {fmt2(data.time?.taxi_hr)})
            </p>

            {data.assumptions?.density_altitude_ft && (
                <p className="text-xs text-[#A3A3A3]">
                    DA: dep {fmt(data.assumptions.density_altitude_ft.depart)} ft, arr{" "}
                    {fmt(data.assumptions.density_altitude_ft.arrive)} ft • Req RWY ~{" "}
                    {fmt(data.assumptions.required_runway_ft)} ft
                </p>
            )}

            <ul className="grid md:grid-cols-2 gap-2 text-sm">
                <li>DOC Total: ${fmt2(data.costs?.doc_total)}</li>
                <li>Airport Fees: ${fmt2(data.costs?.airport_fees)}</li>
                <li>Cost Basis: ${fmt2(data.costs?.cost_basis)}</li>
                <li>Margin: {data.assumptions?.margin_pct ?? "—"}%</li>
            </ul>

            <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm">Total Price</span>
                <b className="text-lg">${fmt2(data.sell_price_usd)}</b>
            </div>

            <div className="flex gap-2">
                {typeof data.ml_prediction_usd === "number" && (
                    <span className="text-xs text-[#A3A3A3]">ML Pred: ${fmt2(data.ml_prediction_usd)}</span>
                )}
                <PdfButton payload={payload} />
            </div>
        </div>
    );
}
