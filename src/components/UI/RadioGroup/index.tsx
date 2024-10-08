import { OptionType } from '../../../types/common/inputs';

interface Props {
    readonly options: OptionType[];
    readonly onChange: (option: OptionType) => void;
    readonly selectedValue: string;
}

export default function RadioGroup({ options, onChange, selectedValue }: Props) {
    return (
        <div>
            {/* esta validación es horrible.. pero cuando se trata de dar estilos concatenados a variables.. no funciona, o por lo menos no encuentro una manera 🥲 */}
            <ul className={`grid w-full gap-3 ${options.length === 2 ? "grid-cols-2" : options.length === 3 ? "grid-cols-3" : "grid-cols-1"}`}>
                {options.map((option) => (
                    <li key={"orden_" + option.label} >
                        <input
                            type="radio"
                            id={"orden_" + option.label}
                            name="hosting"
                            value={option.value}
                            className="hidden peer"
                            checked={selectedValue === option.value}
                            onChange={() => onChange(option)}
                            required
                        />
                        <label
                            htmlFor={"orden_" + option.label}
                            className="flex items-center justify-center w-full py-2 px-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <div className="text-center">
                                <div className="text-base font-semibold">{option.label.toString()}</div>
                            </div>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}