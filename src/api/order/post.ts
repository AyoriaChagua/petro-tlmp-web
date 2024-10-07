import { OrderDetailRequestI, OrderRequestI, OrderResponseI } from "../../types/order";
import { PaymentDocumentRequestI, PaymentResponseI } from "../../types/order-document";
import { axiosAuthInstance } from "../config";

export  const postOrder = {
    createOrder: async (order: OrderRequestI) => {
        try {
            const response = await axiosAuthInstance.post<OrderResponseI>("/order-mp", order);
            return response.data
        } catch (error) {
            throw new Error('Error creando la orden 🥲, ' + (error as Error).message);
        }
    },
    createDetails: async (details: OrderDetailRequestI[]) => {
        try {
            const response = await axiosAuthInstance.post("/order-detail", details);
            return response;
        } catch (error) {
            throw new Error('Error creando los detalles de la orden 🥲, ' + (error as Error).message);
        }
    },
    createPayment: async (newPaymentDocument: PaymentDocumentRequestI) => {
        try {
            const response = await axiosAuthInstance.post<PaymentResponseI>('/payment-documents', newPaymentDocument);
            return response.data;
        } catch (error) {
            throw new Error('Error creando el pago 🥲, ' + (error as Error).message);
        }

    } 
}