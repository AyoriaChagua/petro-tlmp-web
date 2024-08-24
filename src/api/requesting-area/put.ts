import { RequestingAreaI, RequestingAreaRequestI } from "../../types/requesting-area"
import { axiosAuthInstance } from "../config"

export const putRequestingArea = {
    update: async (idArea: number, requestingArea: RequestingAreaRequestI) => {
        try {
            const response = await  axiosAuthInstance.put<RequestingAreaI>(`/requesting-areas/${idArea}`, requestingArea);
            return response.data;
        } catch (error) {
            throw new Error(`Error actualizando el área solicitante: ${(error as Error).message}`);
        }
    }
}