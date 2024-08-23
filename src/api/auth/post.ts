import { LoginCredentials, LoginResponse } from "../../types/auth";
import { ErrorMessage } from "../../types/common/error";
import { axiosInstance } from "../config";


export const login = async (credentials: LoginCredentials): Promise<LoginResponse | ErrorMessage> => {
    try {
        const response = await axiosInstance.post<LoginResponse | ErrorMessage>('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw new Error("No se pudo ingresar al sistema");
    }
}