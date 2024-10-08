import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Cia } from '../types/cia';
import { getCia } from '../api/cia/get';
import { OptionType } from '../types/common/inputs';
import { role, User } from '../types/auth';
import Swal from 'sweetalert2';
import { login } from "../api/auth/post";
import { MultiValue, SingleValue } from "react-select";

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    setToken: (token: string | null) => void;
    logout: () => void;
    companies: Cia[];
    companySelected: OptionType | null;
    setCompanySelected: (cia: OptionType | null) => void;
    roles: role[] | null;
    user: User | null;
    userId: string;
    setUserId: (id: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleLogin: (e: React.FormEvent) => Promise<void>;
    handleSelectCompany: (option: SingleValue<OptionType> | MultiValue<OptionType>) => void;
}

interface JwtPayload {
    roles: role[];
    exp: number;
    description: string;
    id: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState<role[] | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [companies, setCompanies] = useState<Cia[]>([]);
    const [companySelected, setCompanySelectedState] = useState<OptionType | null>(null);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userRoles');
            localStorage.removeItem('user');
        }
    };

    const setCompanySelected = (cia: OptionType | null) => {
        setCompanySelectedState(cia);
        if (cia) {
            localStorage.setItem('companySelected', JSON.stringify(cia));
        } else {
            localStorage.removeItem('companySelected');
        }
    };

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        setCompanySelected(null);
        setCompanies([]);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (companySelected) {
            const response = await login({ id: userId, password });
            if ('access_token' in response) {
                setToken(response.access_token);
                setIsAuthenticated(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Credenciales inválidas'
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Espera',
                text: 'Debe seleccionar una compañía'
            });
        }
    };

    const handleSelectCompany = async (option: SingleValue<OptionType> | MultiValue<OptionType>) => {
        setCompanySelected(option as OptionType);
    };

    const fetchAllCompanies = async () => {
        const companiesResponse = await getCia();
        setCompanies(companiesResponse);
    };

    useEffect(() => {
        if (companies.length === 0) {
            fetchAllCompanies();
        }
    }, [companies]);

    useEffect(() => {
        const checkTokenExpiration = () => {
            if (token) {
                try {
                    const decodedToken = jwtDecode<JwtPayload>(token);
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp < currentTime) {
                        logout();
                    } else {
                        setIsAuthenticated(true);
                        localStorage.setItem('userRoles', JSON.stringify(decodedToken.roles));
                        setRoles(decodedToken.roles);
                        const userForSave: User = { description: decodedToken.description, id: decodedToken.id };
                        localStorage.setItem('user', JSON.stringify(userForSave));
                        setUser(userForSave);
                        const companySelectedString = localStorage.getItem('companySelected');
                        if (companySelectedString) {
                            const companySelected: OptionType = JSON.parse(companySelectedString);
                            setCompanySelected(companySelected);
                        }
                    }
                } catch (error) {
                    logout();
                }
            } else {
                setIsAuthenticated(false);
                logout();
            }
        };
        checkTokenExpiration();
        const intervalId = setInterval(checkTokenExpiration, 1800000);
        return () => clearInterval(intervalId);
    }, [token]);

    return (
        <AuthContext.Provider value={{
            token,
            setToken,
            isAuthenticated,
            logout,
            companySelected,
            setCompanySelected,
            companies,
            roles,
            user,
            userId,
            setUserId,
            password,
            setPassword,
            handleLogin,
            handleSelectCompany
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
};