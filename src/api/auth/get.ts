import { User } from "../../types/auth"
import { axiosInstance } from "../config"

export const getUser = async (userId: number): Promise<User> => {
    try {
        const response = await axiosInstance.get<User>(`/users/${userId}/roles`)
        return response.data;
    } catch (error) {
        throw new Error(`Error obteniendo la información del usuario ${userId}`);
    }
}