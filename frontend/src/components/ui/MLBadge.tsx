"use client";
export default function MLBadge({ delta }: { delta: number | undefined }) {
    if (delta === undefined) return null;
    const pos = (delta ?? 0) >= 0;
    return (
        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-md ${pos ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
      ML Δ {pos ? "+" : ""}{delta?.toFixed(0)}
    </span>
    );
}
