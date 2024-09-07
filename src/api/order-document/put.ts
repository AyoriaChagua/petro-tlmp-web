import { OrderDocumentRequestI, OrderDocumentResponseI } from "../../types/order-document";
import { axiosAuthInstance } from "../config";

export const putOrderDocument = {

    updateDocument: async (orderDocumentNumber: string, companyId: string, updatedDocument: OrderDocumentRequestI) => {
        try {
            const response = await axiosAuthInstance.put<OrderDocumentResponseI>(`/order-documents/${orderDocumentNumber}/${companyId}`, updatedDocument);
            return response.data
        } catch (error) {
            throw new Error('Error actualizando el documento 🥲, ' + (error as Error).message);
        }
    }
}