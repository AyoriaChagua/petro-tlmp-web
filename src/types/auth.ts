export interface LoginCredentials {
    id: string;
    password: string;
}

export interface LoginResponse {
    access_token: string
}

export interface User {
    id: string
    description: string
    userRoles?: UserRole[]
}

export interface UserRole {
    roleId: number
    role: Role
}

export interface Role {
    id: number
    description: string
}

export type role = "ADMINISTRADOR" | "LOGISTICA" | "MESA DE PARTES" | "TESORERIA"