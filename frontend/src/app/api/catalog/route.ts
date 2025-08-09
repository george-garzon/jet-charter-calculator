import { NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_BASE!;

export async function GET() {
    const r = await fetch(`${API}/catalog`, { cache: "no-store" });
    const json = await r.json();
    return NextResponse.json(json, { status: r.status });
}
