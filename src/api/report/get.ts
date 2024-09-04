import { PettyCashReportResponseI, QueryFieldsI } from "../../types/reports"
import { axiosAuthInstance } from "../config"

export const getReport = {
    getPettyCash: async (params: QueryFieldsI) => {
        try {
            console.log(params)
            const response = await axiosAuthInstance.get<PettyCashReportResponseI[]>("/order-documents/report", {
                params
            });
            return response.data;
        } catch (error) {
            throw new Error("Error obteniendo los datos para reporte, " + (error as Error).message);
        }
    }
}