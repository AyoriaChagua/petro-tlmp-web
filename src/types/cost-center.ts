export interface CostCenterI {
    id: number;
    companyId: string;
    description: string;
    systemDate: string;
    systemUser: string;
    isActive: boolean;
    aliasReport?: string;
}


export interface CostCenterRequestI {
    companyId: string;
    description: string;
    aliasReport?: string;
    systemUser: string;
}

export interface CostCenterUpdateRequestI {
    companyId: string;
    description: string;
    aliasReport?: string;
}