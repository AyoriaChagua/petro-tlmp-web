import { axiosAuthInstance } from "../config"

export const deleteCorrelativeControl = {
    deleteById: async (companyId: string, orderTypeId: string, period: string) => {
        try {
            await axiosAuthInstance.delete(`/correlative-control/${companyId}/${orderTypeId.replace("/", "%2F")}/${period}`);
        } catch (error) {
            throw new Error(`Error eliminando el control de correlativo para la empresa ${companyId}`);
        }
    }
}