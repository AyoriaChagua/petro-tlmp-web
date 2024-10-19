import { axiosAuthInstance } from "../config";

export const deleteOrder = {
    payment: async (paymentId: number) => {
        try {
            const response = await axiosAuthInstance.delete<void>(`/order-payment/${paymentId}`);
            return response.data;
        } catch (error) {
            throw new Error('Error eliminando el pago, ' + (error as Error).message);
        }
    }
}