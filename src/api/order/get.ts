import { OrderWithDocumentsI, QueryFieldsI } from "../../types/reports"
import { axiosAuthInstance } from "../config"

export const getOrder = {
    filterOrderWithDocuemts: async (params: QueryFieldsI) => {
        try {
            console.log(params)
            const response = await axiosAuthInstance.get<OrderWithDocumentsI[]>("/order-mp/with-documents", { params });
            console.log(response.request.responseURL);
            return (response).data
        } catch (error) {
            throw new Error("Error obteniendo los datos, " + (error as Error).message);
        }
    }
}