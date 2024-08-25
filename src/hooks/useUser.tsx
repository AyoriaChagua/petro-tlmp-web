import { useEffect, useState } from "react"
import { RoleI, UserI } from "../types/user"
import { getUser } from "../api/user/get";
import { showErrorMessage } from "../utils/functions";
import { useAuth } from "../context/AuthContext";

export const useUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<UserI[]>([]);
    const [roles, setRoles] = useState<RoleI[]>([]);
    const { user } = useAuth();

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const userData = await getUser.getAll();
            const filteredUsers = userData.filter(u => u.id!== user?.id);
            setUsers(filteredUsers);

            const roleData = await getUser.getRoles();
            setRoles(roleData);
        } catch (error) {
            showErrorMessage((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [])

    return {
        isLoading,
        users,
        roles
    }

}