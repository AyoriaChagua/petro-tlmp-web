import { RequestingAreaI, RequestingAreaRequestI } from "../../types/requesting-area"
import { axiosAuthInstance } from "../config"

export const postRequestingArea = {
    create: async (requestingArea: RequestingAreaRequestI)=>{
        try {
            const response = await axiosAuthInstance.post<RequestingAreaI>('/requesting-areas', requestingArea);
            return response.data;
        } catch (error) {
            throw new Error("Error creando la área solicitada");
        }
    }
}