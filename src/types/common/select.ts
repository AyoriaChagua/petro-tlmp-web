import { MultiValue, SingleValue } from "react-select"

export type OptionType = {
    value: string,
    label: string
}

export type OptionTypeParam = SingleValue<OptionType> | MultiValue<OptionType>