export interface UserI {
    id: string
    description: string
    isActive: boolean
    userRoles: RoleI[]
}

export interface RoleI {
    id: number
    description: string
}