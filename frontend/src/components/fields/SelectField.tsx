"use client";
type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { label: string };
export default function SelectField({ label, children, ...rest }: Props) {
    return (
        <label className="block text-sm">
                <span className="mb-1 block text-[#A3A3A3">{label}</span>
            <select {...rest} className="w-full border rounded-lg p-2">{children}</select>
        </label>
    );
}
