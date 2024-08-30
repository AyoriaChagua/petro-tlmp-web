
export interface OrderFormI extends OrderID {
    subtotal: number;
    providerRuc?: string;
    bankAccountId?: string;
    orderDate: string; 
    costCenterId: string;
    paymentMethod: string;
    currency: string;
    approvingStaffId: string;
    isAffectedIGV: boolean;  
    tax: number;
    retention?: number;
    perception?: number;
    detraction?: number;
    total: number; 
    automaticSignature: boolean; 
    requestingAreaId: string;
    systemUser: string;
    currencyValue: string;
    currencyLabel: string;
    paymentMethodValue: string;
    paymentMethodLabel: string;
    requestingAreaLabel: string;
    requestingAreaValue: string;
    costCenterValue: string;
    costCenterLabel: string;
    isAffectedIGVLabel: string;
    taxLabel: string;
    retentionLabel: string;
    perceptionLabel: string;
    detractionLabel: string;
    taxValue: string;
    retentionValue: string;
    perceptionValue: string;
    detractionValue: string;
    totalLabel: string;
    approverValue: string;
    approverLabel: string;
    providerDescription: string;
    providerAddress: string;
    providerAccountNumber: string;
    providerAccountCCI: string;
    providerAccountBank: string;
    observations: string;
    taxRetentionLabel: string;
    perceptionDetractionLabel: string;
    details: OrderDetailsFormI[];
}


export interface OrderRequestI extends OrderID {
    providerRuc: string | null;
    bankAccountId: number | null;
    orderDate: Date;
    approvingStaffId: number;
    costCenterId: number;
    paymentMethod: string;
    currency: string;
    observations: string;
    isAffectedIGV: boolean;
    retention: number | null;
    tax: number | null;
    perception: number | null;
    detraction: number | null;
    retentionCalc: number | null;
    taxCalc: number | null;
    perceptionCalc: number | null;
    detractionCalc: number | null;
    total: number;
    automaticSignature: boolean;
    subtotal: number;
    requestingAreaId: number;
    systemUser: string;
}

export interface OrderResponseI extends OrderRequestI {
    relevance: string | null
	documentStatus: string
	issueDate: Date
}

export interface OrderDetailRequestI extends OrderID, OrderDetailsFormI {
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