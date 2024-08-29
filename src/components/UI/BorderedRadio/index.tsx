import { OptionType } from "../../../types/common/inputs";

interface Props {
    readonly title?: string
    readonly options: OptionType[];
    readonly name: string;
    readonly onChange: (option: OptionType) => void;
    readonly selectedValue: string;
}

export default function BorderedRadio({ title, options, name, onChange, selectedValue }: Props) {
    return (
        <>
            {title && <label className="block mb-2 text-sm font-medium text-gray-600">{title}</label>}
            <div className="flex flex-wrap gap-2">
                {options.map((option, index) => (
                    <div key={index} className="flex items-center ps-4 border border-gray-200 rounded mb-2 w-[calc(50%-0.25rem)]">
                        <input
                            id={`bordered-radio-${index}`}
                            type="radio"
                            value={option.value}
                            name={name}
                            checked={selectedValue === option.value}
                            onChange={() => onChange(option)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`bordered-radio-${index}`} className="w-full py-2 ms-2 text-sm font-medium text-gray-900">
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </>
    );
}