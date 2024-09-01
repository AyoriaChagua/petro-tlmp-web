export interface PaymentDocumentRequestI {
    orderDocumentNumber: string
    companyId: string
    paidAmount: number
    paymentDate: Date
    systemUser: string
}


export interface PaymentDocumentResponseI extends PaymentDocumentRequestI {
    systemDate: Date
    isActive: true
    paymentId: number
}

export interface OrderDocumentRequestI {
    companyId: string
    orderTypeId: string
    period: string
    correlative: string
    orderDocumentNumber: string
    subtotal: number
    igv: number
    total: number
    systemUser: string
    documentStatus: string
    date: string
    dueDate: string
    chargeDate: string
    documentTypeId: string
    code: string
    biog: number | null
    typeEmission: "ELECTRONICO" | "FISICO"
    fise: number | null
    otherPayments: number | null
    exchangeRate: number
    annotation: string
    noOrderFlag: boolean
    taxPerc: number | null
    retentionPerc: number | null
    perceptionPerc: number | null
    detractionPerc: number | null
    taxCalc: number | null
    retentionCalc: number | null
    perceptionCalc: number | null
    detractionCalc: number | null
    isPettyCash: boolean
}


export interface OrderDocumentResponseI extends OrderDocumentRequestI {
    systemDate: Date
}