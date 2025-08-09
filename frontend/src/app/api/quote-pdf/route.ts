import { NextRequest } from "next/server";
const API = process.env.NEXT_PUBLIC_API_BASE!;
export async function POST(req: NextRequest) {
    const body = await req.json();
    const r = await fetch(`${API}/quote.pdf`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(body),
    });
    const blob = await r.arrayBuffer();
    return new Response(blob, {
        status: r.status,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="quote.pdf"',
        },
    });
}
