import { ErrorMessage } from "../../types/common/error";
import { OnlyProviderRequest, ProviderAccountRequest, ProviderMP } from "../../types/provider";
import { axiosAuthInstance } from "../config";

export const postProviderMP = {
    createProvider: async (newProvider: OnlyProviderRequest) => {
        try {
            const response = await axiosAuthInstance.post<ProviderMP | ErrorMessage>('/providers', newProvider);
            return response.data;
        } catch (error) {
            throw new Error('Error creando proveedor MP ' + (error as Error).message);
        }
    },
    createProviderAccounts: async (newProviderAccount: ProviderAccountRequest[]) => {
        try {
            const response = await axiosAuthInstance.post<{ message: string } | ErrorMessage>('/provider-accounts/', newProviderAccount);
            return response.data;
        } catch (error) {
            throw new Error('Error creando cuenta para proveedor MP');
        }
    }
}