import { OrderFormI } from "../../types/order";

export const initialOrderForm: OrderFormI = {
    orderDate: "",
    currency: "",
    paymentMethod: "",
    requestinArea: "",
    costCenter: "",
    isAffectedIGV: false,
    tax: 0,
    retention: 0,
    perception: 0,
    detraction: 0,
    total: 0,
    approver: "",
    automaticSignature: false,
    providerRUC: "",
    providerDescription: "",
    providerAddress: "",
    providerAccountNumber: "",
    providerAccountCCI: "",
    providerAccountBank: "",
    observations: "",
    details: [
        {
             product: "",
             quantity: 0,
             subtotal: 0,
             unitPrice: 0,
             measurement: ""
        }
    ]
}