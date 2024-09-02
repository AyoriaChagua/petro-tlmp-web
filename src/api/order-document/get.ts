import axios from "axios"

export const getOrderDocument = {
    getExchangeRateInSoles: async (): Promise<number> => {
        const url = "https://api.exchangerate-api.com/v4/latest/USD"
        const { data } = await axios.get(url)
        return data.rates.PEN;
    }
}