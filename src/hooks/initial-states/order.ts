import { OrderFormI } from "../../types/order";

export const initialOrderForm: OrderFormI = {
    orderDate: new Date().toISOString().split("T")[0],
    currency: "",
    paymentMethod: "",
    requestingArea: "",
    costCenter: "",
    isAffectedIGV: false,
    tax: 0,
    retention: 0,
    perception: 0,
    detraction: 0,
    total: 0,
    approver: "",
    automaticSignature: false,
    providerRuc: "",
    providerDescription: "",
    providerAddress: "",
    providerAccountNumber: "",
    providerAccountCCI: "",
    providerAccountBank: "",
    observations: "",
    approvingStaffId: "",
    companyId: "",
    correlative: "",
    costCenterId: "",
    orderTypeId: "",
    period: "",
    requestingAreaId: "",
    subtotal: 0,
    systemUser: "",
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