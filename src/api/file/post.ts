import { axiosInstance } from "../config";

export const postFile = {
    createFile: async (formData: FormData) => {
        try {
            const response = await axiosInstance.post<{
                fileName: string,
                id: number
            }>("/file-mp", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response)
            return response.data;
        } catch (error) {
            throw new Error("No se pudo crear el archivo");
        }
    }
};