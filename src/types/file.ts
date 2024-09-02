export interface FileRequestI {
    systemUser: string
    fileTypeId: string
    orderDocumentNumber: string
    companyId: string
    paymentId: number
    file: File
}

export interface FileResponsetI {
    id: number
    fileName: string
    systemUser: string
    fileTypeId: string
    orderDocumentNumber: string
    companyId: string
    paymentId: number
    file: File
}