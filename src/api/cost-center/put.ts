import { CostCenterI, CostCenterUpdateRequestI } from "../../types/cost-center"
import { axiosAuthInstance } from "../config"

export const putCostCenter = {
    update: async (id: number, updateCostCenter: CostCenterUpdateRequestI) => {
        try {
            const response = await axiosAuthInstance.put<CostCenterI>(`/cost-centers/${id}`, updateCostCenter);
            return response.data;
        } catch (error) {
            throw new Error(`Error actualizando el centro de costo`);
        }
    }
}