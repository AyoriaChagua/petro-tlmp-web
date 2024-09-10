import { FileResponseI } from "../../types/file";
import { axiosInstance } from "../config";

export const getFiles = {
    byOrder: async (correlative: string, orderTypeId: string, period: string, companyId: string) => {
        try {
            const response = await axiosInstance.get<FileResponseI[]>(`/file-mp/by-order/${correlative}/${orderTypeId}/${period}/${companyId}`);
            return response.data;
        } catch (error) {
            throw new Error("No se pudieron obtener los archivos");
        }
    },
    byDocument: async (documentNumber: string, companyId: string) => {
        try {
            console.log(`/file-mp/by-document/${documentNumber}/${companyId}`)
            const response = await axiosInstance.get<FileResponseI[]>(`/file-mp/by-document/${documentNumber}/${companyId}`);
            return response.data;
        } catch (error) {
            throw new Error("No se pudieron obtener los archivos");
        }
    },
    byPayment: async (documentNumber: string, companyId: string) => {
        try {
            const response = await axiosInstance.get<FileResponseI[]>(`/file-mp/by-payment/${documentNumber}/${companyId}`);
            return response.data;
        } catch (error) {
            throw new Error("No se pudieron obtener los archivos");
        }
    }
}