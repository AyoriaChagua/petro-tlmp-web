import axios from "axios"
import { axiosAuthInstance } from "../config";
import { OrderDocumentToEditResponseI } from "../../types/order-document";

export const getOrderDocument = {
    getExchangeRateInSoles: async (): Promise<number> => {
        const url = "https://api.exchangerate-api.com/v4/latest/USD"
        const { data } = await axios.get(url)
        return data.rates.PEN;
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