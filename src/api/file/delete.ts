import { axiosInstance } from "../config";

export const deleteFile = {
    delete: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`/file-mp/${id}`);
            console.log(response)
            return response;
        } catch (error) {
            throw new Error("No se pudo eliminar el archivo");
        }
    }
}