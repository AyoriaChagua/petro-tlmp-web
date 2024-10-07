import { OrderDocumentRequestI, OrderDocumentResponseI } from "../../types/order-document"
import { axiosAuthInstance } from "../config"

export const postOrderDocument = {
    createDocumentVoucher: async (newDocument: OrderDocumentRequestI) => {
        try {
            const response = await axiosAuthInstance.post<OrderDocumentResponseI>('/order-documents', newDocument);
            return response.data
        } catch (error) {
            throw new Error('Error creando el documento 🥲, ' + (error as Error).message);
        }
    },
}