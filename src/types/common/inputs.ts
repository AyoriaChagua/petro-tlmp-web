import { MultiValue, SingleValue } from "react-select"

export type OptionType = {
    value: string,
    label: string
}

export interface CheckboxOption {
    id: string;
    label: string;
    value: string;
}

export type OptionTypeParam = SingleValue<OptionType> | MultiValue<OptionType>