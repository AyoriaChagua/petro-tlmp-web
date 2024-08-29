
export interface OrderFormI extends OrderRequestI{
    orderDate: string
    currency: string
    paymentMethod: string
    requestingArea: string
    costCenter: string
    isAffectedIGV: boolean
    tax: number
    retention: number
    perception: number
    detraction: number
    total: number
    approver: string
    automaticSignature: boolean
    providerRuc: string
    providerDescription: string
    providerAddress: string
    providerAccountNumber: string
    providerAccountCCI: string
    providerAccountBank: string
    observations: string
    details: OrderDetailsFormI[]
}

export interface OrderRequestI extends OrderID {
    providerRuc?: string
    bankAccountId?: string
    orderDate: string
    costCenterId: string
    paymentMethod: string
    currency: string
    approvingStaffId: string
    isAffectedIGV: boolean
    tax: number
    retention?: number
    perception?: number
    detraction?: number
    total: number
    subtotal: number
    automaticSignature: boolean
    requestingAreaId: string
    systemUser: string
}

export interface OrderDetailRequestI extends OrderDetailsFormI, OrderID{
    user: string
}

export interface OrderDetailsFormI {
    product: string
    measurement?: string
    quantity: number
    unitPrice: number
    subtotal: number
}

export interface OrderID {
    companyId: string
    orderTypeId: string
    period: string
    correlative: string
}