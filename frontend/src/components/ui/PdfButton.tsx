"use client";
type Props = { payload: any };
export default function PdfButton({ payload }: Props) {
    const onClick = async () => {
        const r = await fetch("/api/quote-pdf", {
            method: "POST", headers: {"Content-Type":"application/json"},
            body: JSON.stringify(payload),
        });
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "quote.pdf"; a.click();
        URL.revokeObjectURL(url);
    };
    return (
        <button onClick={onClick} className="border rounded-lg px-3 py-2 hover:bg-gray-50 hover:text-[#191919]">
            Download PDF
        </button>
    );
}
