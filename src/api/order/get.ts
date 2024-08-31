import { OrderWithDocumentsI, QueryFieldsI } from "../../types/reports"
import { axiosAuthInstance } from "../config"

export const getOrder = {
    filterOrderWithDocuemts:  async  (params: QueryFieldsI) => {
        try {
            const response = axiosAuthInstance.get<OrderWithDocumentsI[]>("order-mp/with-documents", { params });
            return (await response).data
        } catch (error) {
            throw new Error("Error obteniendo los datos, " + (error as Error).message);
        }
    }
}