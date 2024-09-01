import { OrderWithDocumentsI, QueryFieldsI } from "../../types/reports"
import { axiosAuthInstance } from "../config"

export const getOrder = {
    filterOrderWithDocuemts: async (params: QueryFieldsI) => {
        try {
            const response = await axiosAuthInstance.get<OrderWithDocumentsI[]>("/order-mp/with-documents?companyId=06&startDate=2024-08-20&endDate=2024-08-26");
            console.log(response)
            return (response).data
        } catch (error) {
            throw new Error("Error obteniendo los datos, " + (error as Error).message);
        }
    }
}