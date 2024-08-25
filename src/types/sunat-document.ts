export interface SunatDocumentI {
    documentTypeId: string
    isActive: boolean
    sunatCode: string
    systemDate: any
    systemUser: any
    modifiedDate: string
    modifiedUser: any
    description: string
    frequency: number
}

export interface SunatDocumentRequestI {
    documentTypeId: string;
    sunatCode: string;
    systemUser: string;
    description: string;
}

export interface SunatDocumentRequestToUpdateI {
    sunatCode: string;
    modifiedUser: string;
    description: string;
}