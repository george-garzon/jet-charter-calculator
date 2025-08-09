"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider"; // shadcn/ui slider

type Props = {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (v: number) => void;
    hint?: string;
};

export default function SliderField({
                                        label,
                                        value,
                                        min = 0,
                                        max = 100,
                                        step = 1,
                                        onChange,
                                        hint,
                                    }: Props) {
    return (
        <div className="border rounded-xl p-3">
            <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className="font-medium">{value}</span>
            </div>

            <Slider
                value={[value]}
                min={min}
                max={max}
                step={step}
                onValueChange={(vals) => onChange(vals[0])}
                className="[&_.relative]:bg-gray-200 [&_.bg-primary]:bg-[#D9363B]" // custom color for range
            />

            {hint && (
                <p className="text-xs text-[#A3A3A3] mt-1">
                    {hint}
                </p>
            )}
        </div>
    );
}
