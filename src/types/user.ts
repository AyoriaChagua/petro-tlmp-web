export interface UserI {
    id: string
    description: string
    isActive: boolean
    userRoles: RoleI[]
}

export interface UserResponseI {
    id: string
    description: string
    isActive: boolean
}

export interface RoleI {
    id: number
    description: string
}

export interface UserFormRequestI extends UserRequestI {
    repeatPassword: string;
}

export interface UserRequestI {
    id: string
    description: string
    password: string
}

export interface UserRequestUpdateI {
    description: string
}

export interface UserRoleRequestI {
    roleId: number
    userId: string
}

export interface UserRoleResponseI extends UserRoleRequestI {}


export interface ChangePassowrdByAdminRequestI {
    userId: string,
    newPassword: string,
    roleId: number
}