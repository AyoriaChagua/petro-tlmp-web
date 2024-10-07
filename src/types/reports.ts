export type ReportType = "general" | "pettyCash" | "purchasing"


export interface QueryFieldsI {
    companyId: string,
    startDate: Date;
    endDate: Date;
    orderTypeIds?: string[];
    documentTypeId?: string;
    orderNumber?: string;
    supplierRuc?: string;
    minAmount?: number;
    maxAmount?: number;
    isPettyCash?: boolean
}

export interface FieldsPDF {
    companyId: string;
    orderTypeId: string;
    period: string;
    correlative: string;
}

export interface OrderWithDocumentsI extends OrderReportI {
    documents: DocumentI[]
    payments: PaymentI[]
}

export interface OrderReportI {
    correlative: string
    orderTypeId: string
    orderDate: string
    companyId: string
    systemUser: string
    observations: string
    providerRuc: string
    providerDescription: string
    costCenterId: number
    costCenterDescription: string | null
    costcenterAlias: string | null
    currency: string
    total: number
    products: string
    period: string
    tax: number | null,
    detraction: number | null,
    retention: number | null,
    perception: number | null,
    isAffectedIGV: boolean
}

export interface DocumentI {
    orderDocumentNumber: string
    subtotal: number
    total: number
    cia: string
    correlative: string
    period: string
    orderTypeId: string
    systemUser: string
    date: string
    documentStatus: string
    annotation: string
    sunatCode: string
    retentionCalc: number | null
    taxCalc?: number | null
    invoiceFile?: DocumentFile
}

export interface PaymentI {
    companyId: string
    paymentDate: string
    paidAmount: number
    isActive: boolean
    paymentFile: DocumentFile | null
    paymentId: number
    currency: string
}


export interface DocumentFile {
    id: number
    fileTypeId: string
}


export interface ReportResponseI {
    currency: string
    providerRuc: string
    providerDescription: string
    costCenterId: number
    costCenterAlias: any
    correlative: string
    documentProviderRuc: string | null
    documentProviderDescription?: string
    observations: string
    chargeDate: string
    date: string
    total: number
    exchangeRate: number
    documentTypeId: string
    orderDocumentNumber: string
    dueDate: string
    product: string
    biog: number
    typeEmission: string
    annotation: string
    taxCalc?: number | null
    retentionCalc?: number | null
  }
  