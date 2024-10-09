export interface PaymentDocumentRequestI {
    companyId: string,
    correlative: string,
    period: string,
    orderTypeId: string,
    paidAmount: number
    paymentDate: string
    systemUser: string
    currency: string
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
    subtotal: number
    total: number
    systemUser: string
    documentStatus: string
    date: Date
    dueDate: Date
    chargeDate: Date
    documentTypeId: string
    providerRuc: string | null
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
}

export interface OrderDocumentRequestCreateI extends OrderDocumentRequestI {
    orderDocumentNumber: string
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
    costCenter: string | null
}

export interface DocumentLSI {
    companyId: string
    orderTypeId: string,
    period: string,
    correlative: string,
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
    providerRuc: string
    providerDescription: string
    perceptionPercLabel: string
    detractionPercLabel: string
    perceptionPercValue: string
    detractionPercValue: string
    biorgeya: string
    orderDocumentNumber: string
    subtotal: string
    fise: string
    otherPayments: string
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
    companyId: string
    orderTypeId: string
    period: string
    correlative: string
    paymentDate: string
    paidAmount: number
    currency: string
    systemUser: string
    isActive: boolean
}

export interface PaymentDocumentFormI {
    amountPaid: string;
    issueDate: string;
    currencyLabel: string;  
    currencyValue: string;
    file: File
}

export interface OrderDocumentToEditResponseI {
    annotation: string
    biorgeya: number
    providerRuc: string | null
    providerDescription: string | null
    detractionPerc: number | null
    detractionCalc: number | null
    documentType: string 
    documentTypeDescription?: string | null
    dueDate: Date
    exchangeRate: number
    fise: number | null
    issueDate: Date
    issueType: string
    orderDocumentNumber: string
    otherPayments: number | null
    perceptionPerc: number | null
    perceptionCalc: number | null
    receiptDate: Date
    subtotal: number
    taxPerc: number | null
    taxCalc: number | null
    retentionPerc: number | null
    retentionCalc: number | null
    total: number

}