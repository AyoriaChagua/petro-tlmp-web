import { useEffect, useState } from "react"
import { NewFormPasswordI, ProfileI } from "../types/profile"
import { useAuth } from "../context/AuthContext";
import { showErrorMessage, showSuccessMessage } from "../utils/functions";
import { putUser } from "../api/user/put";

export const useProfile = () => {
    const [profile, setProfile] = useState<ProfileI | null>(null);
    const [isChangePass, setIsChangePass] = useState(false);
    const [newPassFormRequest, setNewPassFormRequest] = useState<NewFormPasswordI>({
        confirmPassword: "",
        newPassword: "",
        oldPassword: ""
    });

    const { user, roles, logout } = useAuth();

    const handleInputPasswordChange = (value: string, field : keyof NewFormPasswordI) => {
        setNewPassFormRequest({
            ...newPassFormRequest,
            [field]: value
        });
    }

    const changePassword = async () => {
        try {
            if(newPassFormRequest.oldPassword === "" || newPassFormRequest.newPassword === "" ||newPassFormRequest.confirmPassword === "") {
                throw new Error("Todos los campos son obligatorios");
            } else if(newPassFormRequest.newPassword !== newPassFormRequest.confirmPassword) {
                throw new Error("Las contraseñas no coinciden");
            } else {
                await putUser.updatePasswordByUser(user?.id!, {newPassword: newPassFormRequest.newPassword, oldPassword: newPassFormRequest.oldPassword});
                setIsChangePass(false);
                showSuccessMessage("Contraseña cambiada con exito, vuelva a iniciar sesión");
                logout();
            }
        } catch (error) {
            showErrorMessage((error as Error).message, "warning");
        }
    }

    useEffect(() => {
        setNewPassFormRequest({
            confirmPassword: "",
            newPassword: "",
            oldPassword: ""
        })
        setIsChangePass(false);
        if (user && roles) {
            setProfile({
                id: user.id,
                description: user.description,
                roles: roles
            })
        }
    }, []);

    return {
        profile,
        isChangePass,
        setIsChangePass,
        handleInputPasswordChange,
        newPassFormRequest,
        changePassword
    }
}