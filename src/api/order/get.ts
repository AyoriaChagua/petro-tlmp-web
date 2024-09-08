import { OrderWithDocumentsI, QueryFieldsI } from "../../types/reports"
import { axiosAuthInstance } from "../config"

export const getOrder = {
    filterOrderWithDocuments: async (params: QueryFieldsI) => {
        try {
            const response = await axiosAuthInstance.get<OrderWithDocumentsI[]>("/order-mp/with-documents", { params });
            return (response).data
        } catch (error) {
            throw new Error("Error obteniendo los datos, " + (error as Error).message);
        }
    }
}