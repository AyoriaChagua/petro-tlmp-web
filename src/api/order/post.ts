import { OrderDetailRequestI, OrderRequestI, OrderResponseI } from "../../types/order";
import { axiosAuthInstance } from "../config";

export  const postOrder = {
    createOrder: async (order: OrderRequestI) => {
        try {
            console.log(JSON.stringify(order, null, 2))
            const response = await axiosAuthInstance.post<OrderResponseI>("/order-mp", order);
            console.log(response)
            return response.data
        } catch (error) {
            console.log(error)
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
    }
}