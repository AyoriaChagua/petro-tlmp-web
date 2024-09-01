import { FormEvent, useCallback, useEffect, useState } from "react"
import { RoleI, UserFormRequestI, UserI, UserRequestI, UserRequestUpdateI, UserRoleRequestI } from "../types/user"
import { getUser } from "../api/user/get";
import { arraysIsEqual,  splitArrayIntoChunks } from "../utils/functions";
import { useAuth } from "../context/AuthContext";
import { userInititalFormRequest } from "./initial-states/user";
import { postUser } from "../api/user/post";
import { putUser } from "../api/user/put";
import { showErrorMessage, showSuccessMessage } from "../utils/alerts";

export const useUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<UserI[]>([]);
    const [userChunks, setUserChunks] = useState<UserI[][]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [roles, setRoles] = useState<RoleI[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [userFormRequest, setUserFormRequest] = useState<UserFormRequestI>(userInititalFormRequest);
    const [userToUpdate, setUserToUpdate] = useState<UserI | null>(null);
    const [changePassword, setChangePassword] = useState(false);
    const { user, roles: userRoles } = useAuth();

    const fetchUsers = async () => {
        try {
            const userData = await getUser.getAll();
            const filteredUsers = userData.filter(u => u.id !== user?.id);
            const dataChunks = splitArrayIntoChunks(filteredUsers, 10);
            setUserChunks(dataChunks);
            setUsers(dataChunks[0]);
            const roleData = await getUser.getRoles();
            setRoles(roleData);
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    };

    const register = async () => {
        try {
            if (userFormRequest.password !== userFormRequest.repeatPassword) {
                throw new Error("Las contraseñas no coinciden");
            } else if (selectedRoles.length === 0) {
                throw new Error("Debes seleccionar por lo menos un rol para el usuario");
            }
            const userRequest: UserRequestI = {
                description: userFormRequest.description,
                id: userFormRequest.id,
                password: userFormRequest.password
            }
            const userData = await postUser.userRegister(userRequest);
            if (userData) {
                const userRoles: UserRoleRequestI[] = selectedRoles.map(id => ({
                    roleId: id,
                    userId: userData.id
                }));
                const userRolesData = await postUser.rolesRegistration(userRoles);
                if (userRolesData) {
                    showSuccessMessage(`Usuario ${userData.description} creado satisfactoriamente`);
                    setUserFormRequest(userInititalFormRequest);
                    setSelectedRoles([]);
                    fetchUsers();
                }
            }
        } catch (error) {
            showErrorMessage((error as Error).message, "warning")
        }
    };

    const update = async () => {
        try {
            if (selectedRoles.length === 0) {
                throw new Error("Debes seleccionar por lo menos un rol para el usuario");
            }
            const dataToSend: UserRequestUpdateI = {
                description: userFormRequest.description
            }
            const changedRoles = arraysIsEqual(
                userToUpdate?.userRoles.map(role => role.id)!,
                selectedRoles
            );
            if (!changedRoles) {
                const userRoles: UserRoleRequestI[] = selectedRoles.map(id => ({
                    roleId: id,
                    userId: userToUpdate?.id!
                }));
                await putUser.updateUserRoles(userToUpdate?.id!, userRoles);
            }
            const userData = await putUser.updateUserData(userToUpdate?.id ?? "", dataToSend);
            if (userData) {
                showSuccessMessage(`Usuario ${userData.description} actualizado satisfactoriamente`);
                fetchUsers();
            }
        } catch (error) {
            showErrorMessage((error as Error).message, "warning")
        }
    };

    const updatePassword = async () => {
        try {
            if (userFormRequest.password !== userFormRequest.repeatPassword) {
                throw new Error("Las contraseñas no coinciden");
            } else if (roles && userRoles) {
                const adminRoleDescription = userRoles.find(role => role === "ADMINISTRADOR");
                const adminRole = roles.find(rol => rol.description === adminRoleDescription);
                if (adminRoleDescription && adminRole) {
                    await putUser.updatePasswordByAdmin({
                        newPassword: userFormRequest.password,
                        roleId: adminRole?.id,
                        userId: userFormRequest?.id
                    });
                    showSuccessMessage("Contrasena actualizada satisfactoriamente");
                } else {
                    throw new Error("No cuenta con el rol de administrador.");
                }
            } else {
                throw new Error("Error al obtener los roles.");
            }
        } catch (error) {
            showErrorMessage((error as Error).message, "warning")
        }
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userToUpdate) {
            if (changePassword) {
                updatePassword();
            } else {
                update();
            }
        } else {
            register();
        }
    }

    const handleInputUserForm = (value: string, field: keyof UserFormRequestI) => {
        setUserFormRequest(prevState => ({
            ...prevState,
            [field]: value
        }))
    }

    const handleSelectionRole = useCallback((selectedValues: string[]) => {
        setSelectedRoles(selectedValues.map(value => parseInt(value)));
    }, []);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setUsers(userChunks[pageNumber - 1]);
    };

    const toggleUserStatus = async (id: string) => {
        try {
            const data = await putUser.toggleUserStatus(id);
            if (!data) throw new Error("Error al cambiar el estado del usuario");
            setUsers(prevState => prevState.map(user => user.id === id ? data : user));
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    }

    const handleUserSelection = useCallback((user: UserI | null) => {
        if (user) {
            setUserToUpdate(user);
            setUserFormRequest(prev => ({
                ...prev,
                description: user.description ?? "",
                id: user.id ?? ""
            }));
        } else {
            setChangePassword(false)
            setUserToUpdate(null);
            setUserFormRequest(userInititalFormRequest);
        }
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        setUsers(userChunks[0]);
        setChangePassword(false);
        setUserToUpdate(null);
        setUserFormRequest(userInititalFormRequest);
        setIsLoading(true);
        fetchUsers().then(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (userToUpdate) {
            setSelectedRoles(userToUpdate.userRoles.map(role => role.id));
        } else {
            setSelectedRoles([]);
        }
    }, [userToUpdate]);


    return {
        isLoading,
        users,
        roles,
        handlePageChange,
        onSubmit,
        handleSelectionRole,
        handleInputUserForm,
        userFormRequest,
        toggleUserStatus,
        handleUserSelection,
        userToUpdate,
        selectedRoles,
        changePassword,
        setChangePassword,
        currentPage,
        userChunks
    }

}