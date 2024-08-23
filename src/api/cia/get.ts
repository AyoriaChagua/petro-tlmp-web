import { Cia } from "../../types/cia";
import { axiosInstance } from "../config"

export const getCia = async (): Promise<Cia[]> => {
    try {
        const response = await axiosInstance.get<Cia[]>(`/cia`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(`Error obteniendo las companias`);
    }
}