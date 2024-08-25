import { RoleI, UserI } from "../../types/user"
import { axiosAuthInstance } from "../config"

export const getUser = {
    getAll: async () => {
        try {
            const response = await axiosAuthInstance.get<UserI[]>("/users")
            return response.data;
        } catch (error) {
            throw new Error("No se pudo obtener a los usuarios")
        }
    },
    getRoles: async () => {
        try {
            const response = await axiosAuthInstance.get<RoleI[]>("/roles")
            return response.data;
        } catch (error) {
            throw new Error("No se pudo obtener los roles")
        }
    },
}