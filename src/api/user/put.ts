import { ChangePasswordByUserRequestI } from "../../types/profile";
import { ChangePassowrdByAdminRequestI, UserI, UserRequestUpdateI, UserRoleRequestI } from "../../types/user";
import { axiosAuthInstance } from "../config";

export const putUser = {
    toggleUserStatus: async (id: string) => {
        try {
            const response = await axiosAuthInstance.patch<UserI>(`/users/${id}/status`);
            return response.data;
        } catch (error) {
            throw new Error("Error al cambiar el estado del usuario");
        }
    },
    updateUserRoles: async (id: string, userRoles: UserRoleRequestI[]) => {
        try {
            const response = await axiosAuthInstance.put<UserI>(`/user-roles/${id}`, userRoles);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error("Error al cambiar los roles del usuario");
        }
    },
    updateUserData: async (id: string, userData: UserRequestUpdateI) => {
        try {
            const response = await axiosAuthInstance.patch<UserI>(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw new Error("Error al cambiar los datos del usuario");
        }
    },
    updatePasswordByAdmin: async (changePasswordByAdmin: ChangePassowrdByAdminRequestI) => {
        try {
            const response = await axiosAuthInstance.patch<void>(`/users/change-password-by-admin`, changePasswordByAdmin);
            console.log(response)
            if(response.status !== 200) throw new Error("No se pudo cambiar la contraseña"); 
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },
    updatePasswordByUser: async (userId: string, changePasswordRequest: ChangePasswordByUserRequestI) => {
        try {
            await axiosAuthInstance.patch<void>(`/users/change-password-by-user/${userId}`, changePasswordRequest);
        } catch (error) {
            throw new Error("No se pudo cambiar la contraseña, posiblemente la contraseña antigua no es correcta");
        }
    }
}