import Swal, { SweetAlertIcon } from "sweetalert2";


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
