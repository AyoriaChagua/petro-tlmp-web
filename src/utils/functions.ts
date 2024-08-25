
import Swal from "sweetalert2";
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


interface ConvertToCheckboxOptions<T>{
    data: T[];
    valueKey: keyof T;
    labelKey: keyof T;
}

export const convertToCheckboxOptions = <T>({
    data,
    valueKey,
    labelKey,
} : ConvertToCheckboxOptions<T>): CheckboxOption[] => {
    const options = data.map((item: T, index) => ({
        id: String(index),
        label: String(item[labelKey]),
        value: String(item[valueKey]),
    } as CheckboxOption))
    return options;
}

export const showErrorMessage = (msg: string) => {
    Swal.fire({
        icon: 'error',
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

export const splitArrayIntoChunks = <T>(array: T[], chunkSize: number):T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}