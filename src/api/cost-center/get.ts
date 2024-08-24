import { CostCenterI } from "../../types/cost-center"
import { axiosAuthInstance } from "../config"

export const getCostCenter = {
    getAll: async () => {
        try {
            const response = await axiosAuthInstance.get<CostCenterI[]>("/cost-centers");
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo los centros de costo`);
        }
    },
    getByCompanyId: async (companyId: string) => {
        try {
            const response = await axiosAuthInstance.get<CostCenterI[]>(`/cost-centers/${companyId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo los centros de costo para la compañía ${companyId}`);
        }
    }
}