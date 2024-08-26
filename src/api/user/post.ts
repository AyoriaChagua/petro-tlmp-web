import { UserRequestI, UserResponseI, UserRoleRequestI, UserRoleResponseI } from "../../types/user";
import { axiosAuthInstance } from "../config";

export const postUser = {
    userRegister: async (newUser: UserRequestI) => {
        try {
            const response = await axiosAuthInstance.post<UserResponseI>("/users/register", newUser);
            return response.data;
        } catch (error) {
            throw new Error("Error al registrar al usuario");            
        }
    },
    rolesRegistration: async (userRoles: UserRoleRequestI[]) => {
        try {
            const response = await axiosAuthInstance.post<UserRoleResponseI[]>("/user-roles/", userRoles)
            return response.data;
        } catch (error) {
            throw new Error("Error al crear los roles para el usuario " + userRoles[0].userId);
        }
    }
}