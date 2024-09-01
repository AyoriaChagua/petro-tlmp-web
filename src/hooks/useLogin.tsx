import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth/post";
import { MultiValue, SingleValue } from "react-select";
import { OptionType } from "../types/common/inputs";
import Swal from 'sweetalert2';

export const useLogin = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const { setToken, isAuthenticated, setCompanySelected, companySelected } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (companySelected) {
            const response = await login({ id: userId, password });
            if ('access_token' in response) {
                setToken(response.access_token);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Credenciales inválidas'
                })
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Espera',
                text: 'Debe seleccionar una compañía'
            })
        }

    }

    const handleSelectCompany = async (option: SingleValue<OptionType> | MultiValue<OptionType>) => {
        setCompanySelected(option as OptionType);
    }

    return {
        userId,
        setUserId,
        password,
        setPassword,
        handleLogin,
        isAuthenticated,
        handleSelectCompany
    }

}