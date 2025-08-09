// src/components/ui/PdfButton.tsx
"use client";
import { useState } from "react";
import type { PricePayload } from "@/types";

export default function PdfButton({ payload }: { payload: PricePayload }) {
    const [err, setErr] = useState<string>("");

    const onClick = async () => {
        setErr("");
        const r = await fetch("/api/quote.pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const ct = r.headers.get("content-type") || "";
        if (!r.ok || !ct.includes("application/pdf")) {
            const msg = await r.text();
            setErr(msg || "Failed to generate PDF");
            return;
        }

        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        const a = document.createElement("a");
        a.href = url;
        a.download = "quote.pdf";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col gap-1">
            <button onClick={onClick} className="border rounded-lg px-3 py-2 hover:bg-gray-50">
                Download PDF
            </button>
            {err && <span className="text-xs text-red-600">{err}</span>}
        </div>
    );
}
