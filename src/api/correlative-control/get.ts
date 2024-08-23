import { CorrelativeControlRes } from "../../types/correlative-control"
import { axiosAuthInstance } from "../config"

export const getCorrelativeControl = {
    getByCompanyId: async (companyId: string) => {
        try {
            const response = await axiosAuthInstance.get<CorrelativeControlRes[]>(`/correlative-control/${companyId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo los controladores de correlación para la compañía ${companyId}`);
        }
    }
}