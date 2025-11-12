export default function FormInput({
    label,
    id,
    placeholder,
    type = "text",
    required = false,
    onChange,
    value,
}: {
    label: string;
    id: string;
    placeholder: string;
    type?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id}>
                {label} {required &&
                    <span className="text-sm text-red-400">(required)</span>
                }
            </label>
            <input
                type={type} 
                id={id}
                placeholder={placeholder} 
                className="p-2 rounded-md border border-zinc-800 text-white w-full focus:border-pink-500 outline-none duration-200" 
                onChange={onChange}
                required={required}
                value={value}
            />
        </div>
    )
}