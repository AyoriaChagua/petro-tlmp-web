import { ExchangeRateResponseI } from "../../types/exchange-rate";
import { axiosAuthInstance } from "../config";

export const getExchangeRate = {
    all: async (page: number = 1, limit: number = 10) => {
        try {
            console.log(page, limit)
            const response = await axiosAuthInstance.get<ExchangeRateResponseI[]>(`/exchange-rate?page=${page}&limit=${limit}`)
            console.log(response.data.length)
            return response.data;
        } catch (error) {
            throw new Error("Error obteniendo los tipos de cambio");
        }
    },
    totalNumber: async () => {
        try {
            const response = await axiosAuthInstance.get<number>(`/exchange-rate/total-number`)
            return response.data;
        } catch (error) {
            throw new Error("Error obteniendo el total de tipo de cambio");
        }
    }
}