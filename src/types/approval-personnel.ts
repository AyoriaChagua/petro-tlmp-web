export interface ApprovalPersonnel {
  id: number,
  description: string,
  phone: string,
  systemUser: string,
  systemDate: string,
  modificationUser?: string,
  modificationDate?: string,
  companyId?: string,
  isActive: boolean
}

export interface ApprovalPersonnelRequest {
  description: string,
  phone?: string,
  systemUser: string,
}

export interface ApprovalPersonnelUpdateRequest {
  description?: string,
  phone?: string,
  modificationUser?: string,
}