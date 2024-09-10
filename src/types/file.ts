import { FileTypeMP } from "./common/inputs"

export interface FileRequestI {
    systemUser: string
    fileTypeId: string
    orderDocumentNumber: string
    companyId: string
    paymentId: number
    file: File
}


export interface FileResponseI {
    fileName: string,
    id: number,
    fileTypeId: string
}

export interface FileMPI {
    id: number
    name: string
    fileTypeId: FileTypeMP
    extensionFile: ExtensionFileMP
}

export type FolderType = "order" | "document"

export type ExtensionFileMP = "png" | "jpg" | "jpeg" | "pdf" | "doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx" | "odt" | "ods" | "odp" | "txt" | "csv" | "xml" 