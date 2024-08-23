import { ProviderAccountRequestToUpdate, ProviderMP, ProviderRequestToUpdate } from "../../types/provider"
import { axiosAuthInstance } from "../config"

export const putProviderMP = {
    updateProvider: async (providerData: ProviderRequestToUpdate, rucProvider: string): Promise<ProviderMP> => {
        try {
            const response = await axiosAuthInstance.put<ProviderMP>(`/providers/${rucProvider}`, providerData);
            return response.data;
        } catch (error) {
            throw new Error('Error actualizando el proveedor ' + (error as Error).message);
        }
    },
    updateProvideAccount: async (providerAccountData: ProviderAccountRequestToUpdate, idProviderAccount: number): Promise<{ message: string }> => {
        try {
            const response = await axiosAuthInstance.put<{ message: string }>(`/provider-accounts/${idProviderAccount}`, providerAccountData);
            return response.data;
        } catch (error) {
            throw new Error('Error actualizando la cuenta del proveedor ' + (error as Error).message);
        }
    }
}