
import { CheckboxOption, OptionType } from "../types/common/inputs";
interface ConvertOptionsParams<T> {
    data: T[];
    valueKey: keyof T;
    labelKey: keyof T;
}

export const convertToOptions = <T>({
    data,
    valueKey,
    labelKey
}: ConvertOptionsParams<T>): OptionType[] => {
    const options = data.map((item: T) => ({
        value: String(item[valueKey]),
        label: String(item[labelKey]),
    } as OptionType))
    return options;
}


interface ConvertToCheckboxOptions<T> {
    data: T[];
    valueKey: keyof T;
    labelKey: keyof T;
}

export const convertToCheckboxOptions = <T>({
    data,
    valueKey,
    labelKey,
}: ConvertToCheckboxOptions<T>): CheckboxOption[] => {
    const options = data.map((item: T, index) => ({
        id: String(index),
        label: String(item[labelKey]),
        value: String(item[valueKey]),
    } as CheckboxOption))
    return options;
}


export const splitArrayIntoChunks = <T>(array: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

export const arraysIsEqual = <T>(arr1: T[], arr2: T[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

export const getCurrencySymbol = (currency: string) => {
    switch (currency) {
        case "PEN":
            return "S/"
        case "USD":
            return "$"
        case "EUR":
            return "€"
        default:
            return ""
    }
}

export const encryptString = (str: string) => {
    return btoa(encodeURIComponent(str))
}

export const decryptString = (str: string) => {
    console.log(str)
    return decodeURIComponent(atob(str))
}


export const findLargestList = (lists: any[][]): any[] => {
    return lists.reduce((largest, current) => {
        return current.length > largest.length ? current : largest;
    }, []);
}