
import Swal, { SweetAlertIcon } from "sweetalert2";
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

export const showErrorMessage = (msg: string, icon: SweetAlertIcon = 'error') => {
    Swal.fire({
        icon: icon,
        title: 'Error',
        text: msg
    })
}


export const showSuccessMessage = (msg: string) => {
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: msg
    })
}

export const showConfirmAlert = async (
    title: string,
    text: string,
    confirmButtonText: string = 'Confirmar',
    cancelButtonText: string = 'Cancelar'
): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true
    });

    return result.isConfirmed;
};

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

export const getFirstDayOfCurrentMonth = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}


export const formatCurrency = (amount: number): string => {
    const roundedAmount = Math.round(amount * 100) / 100;
    const [integerPart, decimalPart = ''] = roundedAmount.toString().split('.');
    const formatIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formattedDecimalPart = decimalPart.padEnd(2, '0');
    return `${formatIntegerPart}.${formattedDecimalPart}`;
}

export const splitVoucher = (input: string): [string, string] => {
    const match = input.match(/[A-Z]*([0-9]{3})-([0-9]+)/);
    if (match) {
        return [match[1], match[2]];
    }
    throw new Error('El formato del string es incorrecto');
}


export const formatDate1 = (input: string): string => {
    const [year, month, day] = input.split('-');
    return `${day}-${month}-${year}`;
}