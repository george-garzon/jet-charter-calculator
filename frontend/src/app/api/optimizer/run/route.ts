import { NextRequest, NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_BASE!;
export async function POST(req: NextRequest) {
    const body = await req.json();
    const r = await fetch(`${API}/optimizer/run`, {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify(body),
    });
    return NextResponse.json(await r.json(), { status: r.status });
}
