import { RequestingAreaI } from "../../types/requesting-area";
import { axiosAuthInstance } from "../config"

export const getRequestingArea = {
    getAll: async () => {
        try {
            const response = await axiosAuthInstance.get<RequestingAreaI[]>('/requesting-areas');
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo las áreas de solicitud`);
        }
    }
}