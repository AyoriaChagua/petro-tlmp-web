
import Swal from "sweetalert2";
import { OptionType } from "../types/common/select";
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
    const optiones = data.map((item: T) => ({
        value: String(item[valueKey]),
        label: String(item[labelKey]),
    } as OptionType))
    return optiones;
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