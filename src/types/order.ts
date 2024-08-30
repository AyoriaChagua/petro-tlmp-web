
export interface OrderFormI extends OrderRequestI{
    orderDate: string
    currencyValue: string
    currencyLabel: string
    paymentMethodValue: string
    paymentMethodLabel: string
    requestingAreaLabel: string
    requestingAreaValue: string
    costCenterValue: string
    costCenterLabel: string
    isAffectedIGV: boolean
    isAffectedIGVLabel: string
    taxLabel: string
    retentionLabel: string
    perceptionLabel: string
    detractionLabel: string
    taxValue: string
    retentionValue: string
    perceptionValue: string
    detractionValue: string
    totalLabel: string
    approverValue: string
    approverLabel: string
    automaticSignature: boolean
    providerRuc: string
    providerDescription: string
    providerAddress: string
    providerAccountNumber: string
    providerAccountCCI: string
    providerAccountBank: string
    observations: string
    taxRetentionLabel: string
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