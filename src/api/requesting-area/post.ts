import { RequestingAreaI, RequestingAreaRequestI } from "../../types/requesting-area"
import { axiosAuthInstance } from "../config"

export const postRequestingArea = {
    create: async (requestinArea: RequestingAreaRequestI)=>{
        try {
            const response = await axiosAuthInstance.post<RequestingAreaI>('/requesting-areas', requestinArea);
            return response.data;
        } catch (error) {
            throw new Error("Error creando la área solicitada");
        }
    }
}