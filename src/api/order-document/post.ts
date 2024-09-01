import { OrderDocumentRequestI, OrderDocumentResponseI, PaymentDocumentRequestI, PaymentDocumentResponseI } from "../../types/order-document"
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

    createPaymentDocument: async (newPaymentDocument: PaymentDocumentRequestI) => {
        try {
            const response = await axiosAuthInstance.post<PaymentDocumentResponseI>('/payment-documents', newPaymentDocument);
            return response.data;
        } catch (error) {
            throw new Error('Error creando el pago 🥲, ' + (error as Error).message);
        }

    }
}