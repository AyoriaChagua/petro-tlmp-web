import { useState } from "react"
import { initialOrderForm } from "./initial-states/order";
import { OrderFormI } from "../types/order";

export const useOrder = () => {
    const [orderForm, setOrderForm] = useState<OrderFormI>(initialOrderForm);
    
    return {
        orderForm
    }
}