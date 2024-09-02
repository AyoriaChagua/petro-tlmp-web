import { FormEvent, useEffect, useState } from "react"
import { OnlyProviderRequest, ProviderAccountRequest, ProviderAccountRequestToUpdate, ProviderMP, ProviderRequest, ProviderRequestToUpdate } from "../types/provider"
import { getProviderMP } from "../api/provider-mp/get";
import { showConfirmAlert, showErrorMessage, showSuccessMessage } from "../utils/alerts";
import { useDebounce } from "./useDebounce";
import { initialPaginationOptions } from "./initial-states/general";
import { postProviderMP } from "../api/provider-mp/post";
import { initialProvider, initialProviderAccount } from "./initial-states/provider";
import { useAuth } from "../context/AuthContext";
import { deleteProvider } from "../api/provider-mp/delete";
import { putProviderMP } from "../api/provider-mp/put";

export const useProvider = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [providers, setProviders] = useState<ProviderMP[]>([]);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [numberProviders, setNumberProviders] = useState({ quantity: 0 });
    const [querySearch, setQuerySearch] = useState("");
    const [paginationOptions, setPaginationOptions] = useState(initialPaginationOptions);
    const { user } = useAuth();
    const [formProvider, setFormProvider] = useState<ProviderRequest>(initialProvider);
    const [updateProvider, setUpdateProvider] = useState<{ ruc: string } | boolean>(false);


    // TO CREATE 😪
    const handleInputChangeNewProvider = (e: string, field: keyof ProviderRequest | keyof ProviderAccountRequest, index?: number) => {
        const value = e;
        if (field === "accountNumber" || field === "supplierRUC" || field === "bank" || field === "cci" || field === "type") {
            const updatedAccounts = [...formProvider.accounts];
            if (index !== undefined) {
                updatedAccounts[index][field] = value;
            }
            setFormProvider({ ...formProvider, accounts: updatedAccounts });
        } else {
            setFormProvider({ ...formProvider, [field]: value });
        }
    };

    const addAccount = () => {
        setFormProvider({
            ...formProvider,
            accounts: [...formProvider.accounts, {
                supplierRUC: "",
                accountNumber: "",
                bank: "",
                cci: "",
                type: "",
                systemUser: ""
            }],
        });
    };

    const removeAccount = (index: number) => {
        const updatedAccounts = formProvider.accounts.filter((_, i) => i !== index);
        setFormProvider({ ...formProvider, accounts: updatedAccounts });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let onlyProvider: OnlyProviderRequest | ProviderRequestToUpdate;
            if (updateProvider) {
                const confirm = await showConfirmAlert('Actualizando', '¿Está segur@ de actualizar los datos del proveedor?');
                if (confirm) {
                    onlyProvider = {
                        description: formProvider.description.toUpperCase(),
                        address: formProvider.address?.toUpperCase(),
                        email: formProvider.email,
                        phone: formProvider.phone,
                        modifiedUser: user?.id!
                    } as ProviderRequestToUpdate;
                    const responseProviderUpdated = await putProviderMP.updateProvider(onlyProvider, formProvider.ruc);
                    formProvider.accounts.forEach(async account => {
                        const accountToUpdate = {
                            bank: account.bank,
                            accountNumber: account.accountNumber,
                            type: account.type,
                            cci: account.cci,
                        } as ProviderAccountRequestToUpdate
                        if (account.id) {
                            await putProviderMP.updateProvideAccount(accountToUpdate, account.id);
                        }
                        else {
                            await postProviderMP.createProviderAccounts([{ ...account, supplierRUC: formProvider.ruc }]);
                        }
                    });
                    responseProviderUpdated && showSuccessMessage("Proveedor actualizado satisfactoriamente");
                }
                setUpdateProvider(false);
                setFormProvider(initialProvider);
                fetchProviders();
            } else {
                onlyProvider = {
                    ruc: formProvider.ruc,
                    description: formProvider.description.toUpperCase(),
                    address: formProvider.address?.toUpperCase(),
                    email: formProvider.email,
                    phone: formProvider.phone,
                    systemUser: user?.id!
                } as OnlyProviderRequest;
                const responseNewProvider = await postProviderMP.createProvider(onlyProvider);
                if (responseNewProvider && 'ruc' in responseNewProvider) {
                    const onlyAccounts: ProviderAccountRequest[] = formProvider.accounts.map(account => ({
                        ...account,
                        supplierRUC: responseNewProvider.ruc,
                        systemUser: user?.id!
                    }));
                    const responseNewAccounts = await postProviderMP.createProviderAccounts(onlyAccounts);
                    responseNewAccounts && fetchProviders();
                }
                showSuccessMessage("Proveedor creado satisfactoriamente")
            }
        } catch (error) {
            showErrorMessage((error as Error).message.includes("409") ? "El proveedor con ese RUC/DNI ya existe" : "Error enviando los datos");
        }
    }

    const handleDeleteProvider = async (ruc: string) => {
        try {
            const confirmDelete = await showConfirmAlert("Espera", "¿Estás seguro de eliminar este proveedor?");
            if (confirmDelete) {
                await deleteProvider.deleteProvider(ruc);
                fetchProviders();
                showSuccessMessage("Proveedor eliminado satisfactoriamente")
            }
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    }

    const handleDeleteProviderAccount = async (accountId: number, index: number) => {
        try {
            const confirmDelete = await showConfirmAlert("Espera", "¿Estás seguro de eliminar la cuenta de este proveedor?");
            if (confirmDelete) {
                await deleteProvider.deleteProviderAccount(accountId);
                fetchProviders();
                showSuccessMessage("Cuenta eliminada satisfactoriamente");
                removeAccount(index);
            }
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    }

    const toggleDropdown = (id: string) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    // TO UPDATE 😭
    const selectProviderToUpdate = (provider: ProviderMP | null) => {
        setFormProvider(initialProvider);
        if (provider) {
            setUpdateProvider({ ruc: provider.ruc })
            const accountsSelected = [
                ...provider.accounts.map((account) => ({
                    id: account.id,
                    bank: account.bank,
                    accountNumber: account.accountNumber,
                    supplierRUC: account.supplierRUC,
                    type: account.type,
                    systemUser: account.systemUser,
                    cci: account.cci,
                }))
            ];
            const providerSelected: ProviderRequest = {
                ruc: provider.ruc,
                description: provider.description,
                address: provider.address,
                email: provider.email,
                phone: provider.phone,
                modifiedUser: user?.id,
                accounts: accountsSelected.length > 0 ? accountsSelected : [initialProviderAccount]
            }
            setFormProvider(providerSelected);
        } else {
            setUpdateProvider(false)
        }
    }

    // TO SEARCH 😥

    const fetchProviders = async (numberPage: number = 1, numberPerPage: number = 10) => {
        try {
            const [response, numberResponse] = await Promise.all([
                getProviderMP.getProviderWithAccounts(numberPage, numberPerPage),
                getProviderMP.getNumberProviders("all")
            ]);
            setNumberProviders(numberResponse);
            setProviders(response);
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    };



    const searchProviders = async (
        querySearch: string,
        numberPage: number = 1,
        numberPerPage: number = 10
    ): Promise<ProviderMP[]> => {
        try {
            const [response, numberResponse] = await Promise.all([
                getProviderMP.searchProviderWithAccounts(querySearch, numberPage, numberPerPage),
                getProviderMP.getNumberProviders(querySearch)
            ]);
            setNumberProviders(numberResponse);
            setProviders(response);
            return response;
        } catch (error) {
            showErrorMessage((error as Error).message);
            return [];
        }
    };

    const debouncedSearchProviders = useDebounce(searchProviders, 400);

    useEffect(() => {
        const loadProviders = async () => {
            setIsLoading(true);
            await fetchProviders();
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        };

        loadProviders();
    }, []);

    useEffect(() => {
        const totalPages = Math.ceil(numberProviders.quantity / paginationOptions.itemsPerPage);

        if (totalPages !== paginationOptions.totalPages) {
            setPaginationOptions(prevState => ({
                ...prevState,
                totalPages
            }));
        }

        if (querySearch.length > 0) {
            debouncedSearchProviders(querySearch, paginationOptions.currentPage, paginationOptions.itemsPerPage);
        } else {
            fetchProviders(paginationOptions.currentPage, paginationOptions.itemsPerPage);
        }
    }, [querySearch, numberProviders.quantity, paginationOptions.itemsPerPage, paginationOptions.currentPage]);

    const goToNextPage = () => {
        if (paginationOptions.currentPage < paginationOptions.totalPages) {
            setPaginationOptions(prevState => ({
                ...prevState,
                currentPage: prevState.currentPage + 1
            }));
        }
    };

    const goToPreviousPage = () => {
        if (paginationOptions.currentPage > 1) {
            setPaginationOptions(prevState => ({
                ...prevState,
                currentPage: prevState.currentPage - 1
            }));
        }
    };

    const goToLastPage = () => {
        setPaginationOptions(prevState => ({
            ...prevState,
            currentPage: prevState.totalPages
        }));
    };

    const goToFirstPage = () => {
        setPaginationOptions(prevState => ({
            ...prevState,
            currentPage: 1
        }));
    };

    const changeItemsPerPage = (newItemsPerPage: number) => {
        if (newItemsPerPage !== paginationOptions.itemsPerPage) {
            setPaginationOptions(prevState => ({
                ...prevState,
                itemsPerPage: newItemsPerPage,
                currentPage: 1
            }));
        }
    };

    return {
        providers,
        fetchProviders,
        isLoading,
        toggleDropdown,
        openDropdownId,
        numberProviders,
        paginationOptions,
        goToNextPage,
        goToPreviousPage,
        goToLastPage,
        goToFirstPage,
        changeItemsPerPage,
        querySearch,
        setQuerySearch,
        formProvider,
        handleInputChangeNewProvider,
        handleSubmit,
        addAccount,
        removeAccount,
        handleDeleteProvider,
        selectProviderToUpdate,
        updateProvider,
        handleDeleteProviderAccount,
        debouncedSearchProviders
    };
};
