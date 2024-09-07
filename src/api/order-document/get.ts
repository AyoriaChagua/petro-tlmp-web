import axios from "axios"
import { axiosAuthInstance } from "../config";
import { OrderDocumentToEditResponseI, PaymentResponseI } from "../../types/order-document";

export const getOrderDocument = {
    getExchangeRateInSoles: async (): Promise<number> => {
        const url = "https://api.exchangerate-api.com/v4/latest/USD"
        const { data } = await axios.get(url)
        return data.rates.PEN;
    },
    findPaymentsByDocument: async (companyId: string, orderDocumentNumber: string) => {
        try {
            const response = await axiosAuthInstance<PaymentResponseI[]>(`/payment-documents/${companyId}/${orderDocumentNumber}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener los pagos del documento ${orderDocumentNumber}`);
        }
    },
    getDocumentById: async ( orderDocumentNumber: string, companyId: string ) => {
        try {
            const response = await axiosAuthInstance<OrderDocumentToEditResponseI>(`/order-documents/${orderDocumentNumber}/${companyId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error al obtener el documento ${orderDocumentNumber}`);
        }
    }
}