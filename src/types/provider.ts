export interface ProviderMP {
    ruc: string
    description: string
    address?: string
    contact?: string
    phone?: string
    systemUser?: string
    systemDate?: string
    modifiedUser?: string
    modifiedDate?: string
    createdAt?: string
    updatedAt?: string
    email?: string
    isActive: boolean
    accounts: ProviderAccount[]
}

export interface OnlyProviderRequest {
    ruc: string
    description: string
    address?: string
    phone?: string
    email?: string
    systemUser?: string
    modifiedUser?: string
}

export interface ProviderRequest extends OnlyProviderRequest {
    accounts: ProviderAccountRequest[]
}

export interface ProviderRequestToUpdate {
    description: string;
    address: string;
    phone: string;
    email: string;
    modifiedUser: string;
}

export interface ProviderAccountRequestToUpdate {
    bank: string;
    accountNumber: string;
    type: string;
    cci: string;
}

export interface ProviderAccountRequest {
    id?: number;
    bank: string;
    accountNumber: string;
    supplierRUC: string;
    type?: string;
    systemUser: string
    cci?: string;
}

export interface ProviderAccount extends ProviderAccountRequest {
    id: number
    createdAt?: string
    updatedAt?: string
}
