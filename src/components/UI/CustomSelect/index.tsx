import Select, { MultiValue, SingleValue, StylesConfig } from 'react-select';
import { OptionType } from '../../../types/common/inputs';
import { IoAlertCircleOutline } from 'react-icons/io5';

interface Props {
    readonly options: OptionType[],
    readonly value?: OptionType;
    readonly onChange: (option: SingleValue<OptionType> | MultiValue<OptionType>) => void,
    readonly isMulti?: boolean;
    readonly isClearable?: boolean;
    readonly id: string;
    readonly label: string;
    readonly placeholder?: string;
    readonly className?: string;
    readonly typeForm?: "maintanance" | "create";
    readonly disabled?: boolean;
    readonly isRequired?: boolean
}

export default function CustomSelect({
    onChange,
    options,
    value,
    isMulti = false,
    isClearable = false,
    id,
    label,
    placeholder,
    className,
    typeForm,
    disabled = false,
    isRequired = false
}: Props) {
    let labelStyles: string;

    switch (typeForm) {
        case "maintanance":
            labelStyles = "block mb-2 text-sm font-medium text-white";
            break;
        case "create":
            labelStyles = "block mb-2 text-sm font-medium text-gray-600";
            break;
        default:
            labelStyles = "block mb-2 text-sm font-medium text-gray-700";
            break;
    }

    const customStyles: StylesConfig<OptionType, boolean> = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: typeForm === "create" ? '#fff' : (state.isFocused ? '#1E66B6' : '#1E66B6'),
            borderColor: typeForm === "create" ? '#ccc' : (state.isFocused ? '#ccc' : '#1E66B6'),
            boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(30, 102, 182, 0.25)' : 'none',
            color: typeForm === "create" ? '#000' : (state.isFocused ? '#000' : '#fff'),
            fontSize: '14px',
            borderRadius: '4px',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#1E66B6' : state.isFocused ? '#f5f5f5' : '#fff',
            color: state.isSelected ? '#fff' : state.isFocused ? '#1E66B6' : '#333',
            padding: '8px 12px',
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: typeForm === "create" ? '#000' : (state.isDisabled ? '#ccc' : '#fff'),
        }),
    };

    return (
        <div className={`mb-3 ${className}`}>
            <div className="flex flex-row items-center gap-2">
                <label htmlFor={id} className={`${labelStyles} align-middle`}>{label}</label>
                {isRequired && <span className={`${labelStyles} align-middle`}><IoAlertCircleOutline /></span>}
            </div>
            <Select
                id={id}
                options={options}
                value={value}
                onChange={onChange}
                isMulti={isMulti}
                isClearable={isClearable}
                placeholder={placeholder}
                styles={customStyles}
                isDisabled={disabled}
                required={isRequired}
            />
        </div>
    );
}