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
}

export interface OrderWithDocumentsI extends OrderReportI {
    documents: DocumentI[]
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
}