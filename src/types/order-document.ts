export interface PaymentDocumentRequestI {
    orderDocumentNumber: string
    companyId: string
    paidAmount: number
    paymentDate: string
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
    total: number
    systemUser: string
    documentStatus: string
    date: Date
    dueDate: Date
    chargeDate: Date
    documentTypeId: string
    code: string
    biog: number
    typeEmission: string
    fise: number | null
    otherPayments: number | null
    exchangeRate: number
    annotation: string
    noOrderFlag: boolean
    retentionPerc: number | null
    taxPerc: number | null
    perceptionPerc: number | null
    detractionPerc: number | null
    retentionCalc: number | null
    taxCalc: number | null
    perceptionCalc: number | null
    detractionCalc: number | null
    isPettyCash: boolean
}



export interface OrderDocumentResponseI extends OrderDocumentRequestI {
    systemDate: Date
}




export interface OrderLSI {
    orderTypeId: string,
    period: string,
    companyId: string,
    correlative: string,
    currency: string,
    total: number,
    tax: number | null,
    perception: number | null,
    detraction: number | null,
    retention: number | null,
}

export interface DocumentLSI {
    companyId: string
    orderDocumentNumber: string
}

export interface DocumentFormI {
    documentTypeLabel: string
    documentTypeValue: string
    issueTypeLabel: string
    issueTypeValue: string
    receiptDate: Date
    issueDate: Date
    dueDate: Date
    exchangeRate: number
    annotation: string
    code: string
    perceptionPercLabel: string
    detractionPercLabel: string
    perceptionPercValue: string
    detractionPercValue: string
    biorgeya: string
    orderDocumentNumber: string
    subtotal: string
    perceptionCalcValue: string
    detractionCalcValue: string
    fise: string
    otherPayments: string
    isPettyCash: boolean
    isAffectedTaxRetention: boolean
    total: string,
    taxRetentionValue: string,
    taxLabel: string,
    retentionValue: string,
    taxValue: string,
    retentionLabel: string,
    perceptionDetractionValue: string
}

export interface PaymentResponseI {
    paymentId: number
    orderDocumentNumber: string
    companyId: string
    paymentDate: Date
    paidAmount: number
    systemUser: string
    systemDate: string
    isActive: boolean
  }