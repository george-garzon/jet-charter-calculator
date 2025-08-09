import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const r = await fetch(`${API}/price`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });
    const json = await r.json();
    return NextResponse.json(json, { status: r.status });
}
