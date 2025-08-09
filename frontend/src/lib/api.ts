// src/lib/api.ts
export async function getJSON<T>(url: string, init?: RequestInit): Promise<T> {
    const r = await fetch(url, init);
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return (await r.json()) as T;
}

export async function postJSON<T>(url: string, data: unknown): Promise<T> {
    const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    // If backend returns non-JSON errors (e.g., PDF), this helper isn't appropriate.
    if (!r.ok) {
        let msg = `${r.status} ${r.statusText}`;
        try {
            const json = (await r.json()) as { error?: string };
            if (json?.error) msg = json.error;
        } catch {
            // ignore parse error
        }
        throw new Error(msg);
    }
    return (await r.json()) as T;
}
