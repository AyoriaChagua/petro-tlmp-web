import { IoAlertCircleOutline } from "react-icons/io5";

interface Props {
    readonly id: string;
    readonly label?: string;
    readonly type?: 'text' | 'number' | 'email' | 'password' | 'checkbox' | 'radio';
    readonly required?: boolean;
    readonly value?: string;
    readonly placeholder?: string
    readonly onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readonly disabled?: boolean;
    readonly className?: string;
    readonly typeForm?: "maintanance" | "create" | "search";
    readonly maxLength?: number;
}

export default function Input({ id, label, required, type, value, placeholder, onChange, disabled = false, className, typeForm, maxLength }: Props) {
    let inputStyles: string
    let labelStyles: string

    switch (typeForm) {
        case "maintanance":
            inputStyles = `bg-[#1E66B6]  text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 `;
            labelStyles = "block mb-2 text-sm font-medium  text-white"
            break;
        case "search":
            inputStyles = `bg-white  text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 border border-[#1E66B6] block w-full p-1 `;
            labelStyles = "block mb-2 text-sm font-medium  text-white"
            break;
        case "create":
            inputStyles = `bg-red-500 `;
            labelStyles = "block mb-2 text-sm font-medium  text-red-600"
            break;
        default:
            inputStyles = `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 `;
            labelStyles = "block mb-2 text-sm font-medium  text-gray-600"
            break;

    }
    return (
        <div className={`mb-3 ${className}`}>
            {label && <div className="flex flex-row items-center h-full gap-2">
                <label htmlFor={id} className={`${labelStyles} align-middle`}>{label}</label>
                {required && (
                    <span className={`${labelStyles} align-middle`}>
                        <IoAlertCircleOutline />
                    </span>
                )}
            </div>
            }
            <input
                id={id}
                disabled={disabled}
                type={type}
                className={inputStyles}
                placeholder={placeholder}
                required={required}
                value={value ?? ""}
                onChange={onChange}
                maxLength={maxLength}
            />
        </div>
    )
}
