import { CorrelativeControlRes } from "../../types/correlative-control";
import { axiosAuthInstance } from "../config";

export const putCorrelativeControl = {
    toggleState: async (companyId: string, orderTypeId: string, period: string) => {
        try {
            const response = await axiosAuthInstance.patch<CorrelativeControlRes>(`/correlative-control/toggle/${companyId}/${orderTypeId}/${period}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo los controladores de correlación para la compañía ${companyId}`);
        }
    },
    updateCorrelative: async (companyId: string, orderTypeId: string, period: string, correlative: string) => {
        try {
            const response = await axiosAuthInstance.patch<CorrelativeControlRes>(`/correlative-control/${companyId}/${orderTypeId}/${period}`, { correlative });
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo los controladores de correlación para la compañía ${companyId}`);
        }
    }
}