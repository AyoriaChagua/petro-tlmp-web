import { ReportResponseI, QueryFieldsI } from "../../types/reports"
import { axiosAuthInstance } from "../config"

export const getReport = {
    getDocuments: async (params: QueryFieldsI) => {
        try {
            const response = await axiosAuthInstance.get<ReportResponseI[]>("/order-documents/report", {
                params
            });
            return response.data;
        } catch (error) {
            throw new Error("Error obteniendo los datos para reporte, " + (error as Error).message);
        }
    },

}