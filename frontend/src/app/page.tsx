import Calculator from "@/components/Calculator";

export default function Page() {
    return (
        <main className="bg-[#191919] max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Private Jet Price Calculator</h1>
            <p className="text-sm text-[#A3A3A3]">Weather-adjusted pricing, runway checks, and ML prediction.</p>
            <Calculator />
        </main>
    );
}
