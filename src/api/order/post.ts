import { OrderDetailRequestI, OrderRequestI, OrderResponseI } from "../../types/order";
import { PaymentDocumentRequestI, PaymentDocumentRequestUpdateI, PaymentResponseI } from "../../types/order-document";
import { axiosAuthInstance } from "../config";

export const postOrder = {
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
        console.log(newPaymentDocument)
        try {
            const response = await axiosAuthInstance.post<PaymentResponseI>('/order-payment', newPaymentDocument);
            console.log(response.data)
            return response.data;
        } catch (error) {
            throw new Error('Error creando el pago 🥲, ' + (error as Error).message);
        }

    },

    updatePayment: async (paymentId: number, newPaymentDocument: Partial<PaymentDocumentRequestUpdateI>) => {
        try {
            const response = await axiosAuthInstance.put<PaymentResponseI>(`/order-payment/${paymentId}`, newPaymentDocument);
            return response.data;
        } catch (error) {
            throw new Error('Error creando el pago 🥲, ' + (error as Error).message);
        }

    }
}