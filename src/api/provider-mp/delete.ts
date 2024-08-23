import { axiosAuthInstance } from "../config"

export const deleteProvider = {
    deleteProvider: async (ruc: string) => {
        try {
            const response = await axiosAuthInstance.delete<{ message: string }>(`/providers/${ruc}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error eliminando el proveedor con RUC ${ruc}`);
        }
    },
    deleteProviderAccount: async (accountId: number) => {
        try {
            const response = await axiosAuthInstance.delete<{ message: string, error?: string }>(`/provider-accounts/${accountId}`)
            return response.data;
        } catch (error) {
            throw new Error(`Error eliminando la cuenta del proveedor ${accountId}`);
        }
    }
}