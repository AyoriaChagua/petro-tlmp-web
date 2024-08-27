import { role } from "./auth"

export interface ProfileI  {
    id: string
    description: string
    roles: role[]
}

export interface  NewFormPasswordI {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

export interface ChangePasswordByUserRequestI {
    newPassword: string
    oldPassword: string
}