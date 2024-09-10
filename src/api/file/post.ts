import { FileResponseI } from "../../types/file";
import { axiosInstance } from "../config";

export const postFile = {
    createFile: async (formData: FormData) => {
        try {
            const response = await axiosInstance.post<FileResponseI>("/file-mp", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error("No se pudo crear el archivo");
        }
    }
};