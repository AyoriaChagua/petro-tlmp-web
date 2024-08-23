import { ProviderMP } from "../../types/provider";
import { axiosAuthInstance } from "../config"

export const getProviderMP = {
    getProviderWithAccounts: async (numberPage: number = 1, numberPerPage: number = 10) => {
        try {
            const response = await axiosAuthInstance.get<ProviderMP[]>(`/providers/all?numberPage=${numberPage}&numberPerPage=${numberPerPage}`)
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo los proveedores con cuentas`);
        }
    },
    searchProviderWithAccounts: async (querySearch: string, numberPage: number = 1, numberPerPage: number = 10) => {
        try {
            const response = await axiosAuthInstance.get<ProviderMP[]>(`/providers/search?querySearch=${querySearch}&numberPage=${numberPage}&numberPerPage=${numberPerPage}`)
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo los proveedores con cuentas`);
        }
    },
    getNumberProviders: async (querySearch: string) => {
        try {
            const response = await axiosAuthInstance.get<{ quantity: number }>(`/providers/count?querySearch=${querySearch}`)
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo la cantidad de proveedores`);
        }
    }
}