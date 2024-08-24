import { CostCenterI, CostCenterRequestI } from "../../types/cost-center"
import { axiosAuthInstance } from "../config"

export const postCostCenter = {
    create: async (newCostCenter: CostCenterRequestI) => {
        try {
            const response = await axiosAuthInstance.post<CostCenterI>("/cost-centers", newCostCenter);
            return response.data;
        } catch (error) {
            throw new Error(`Error creando el centro de costo`);
        }
    }
}