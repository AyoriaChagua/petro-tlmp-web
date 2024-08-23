export interface CorrelativeControlRes {
    orderTypeId: string
    companyId: string
    period: string
    correlative: string
    ciaDescription?: string
    systemUser: string
    active: boolean
}


export interface CorrelativeControlReq {
    orderTypeId: string
    companyId: string
    period: string
    correlative: string
    systemUser: string
    active: boolean
}