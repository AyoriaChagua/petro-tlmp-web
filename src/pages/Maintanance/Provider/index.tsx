import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { Button, CustomSelect, IconButton, Input, Loader, MaintananceLayout, Table } from "../../../components";
import { useProvider } from "../../../hooks/useProvider";
import { TableColumn } from "../../../types/common/table";
import { ProviderAccount, ProviderMP } from "../../../types/provider";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import { OptionType } from "../../../types/common/select";
import { bankOptions, typeAccountOptions } from "../../../utils/constants";


export default function Provider() {
    const {
        providers,
        paginationOptions,
        isLoading,
        openDropdownId,
        toggleDropdown,
        changeItemsPerPage,
        goToFirstPage,
        goToLastPage,
        goToNextPage,
        goToPreviousPage,
        querySearch,
        setQuerySearch,
        handleInputChangeNewProvider,
        formProvider,
        handleSubmit,
        addAccount,
        removeAccount,
        handleDeleteProvider,
        selectProviderToUpdate,
        updateProvider,
        handleDeleteProviderAccount
    } = useProvider();
    const renderDropdownAccounts = (accounts: ProviderAccount[], rowId: string) => {
        if (openDropdownId !== rowId) return null;
        return (
            <div className="absolute right-0 mt-2 w-60 bg-[#eaeafe] rounded-md shadow-xl z-10">
                <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 font-semibold">Cuentas</span>
                    <hr />
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                    {accounts.map((account, index) => (
                        <li key={index} className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-200">
                            <div className="flex flex-col">
                                <p className="text-xs"><span className="font-semibold">Banco:</span> {account.bank}</p>
                                <p className="text-xs"><span className="font-semibold">Cuenta:</span> {account.type}</p>
                                <p className="text-xs"><span className="font-semibold">N° cuenta:</span> {account.accountNumber}</p>
                                <p className="text-xs"><span className="font-semibold">CCI:</span> {account.cci}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const columns: TableColumn<ProviderMP>[] = [
        { key: "ruc", label: "RUC" },
        { key: "description", label: "Descripción" },
        { key: "address", label: "Dirección" },
        { key: "phone", label: "Teléfono" },
        {
            key: "actions", label: "Cuentas", actions: (row) => (
                <div className="relative">
                    <IconButton icon="card" onClick={() => toggleDropdown(row.ruc)} />
                    {renderDropdownAccounts(row.accounts, row.ruc)}
                </div>
            )
        },
        {
            key: "actions", label: "Acciones", actions: (row) => (
                <div className="flex flex-row gap-2">
                    <IconButton icon="edit" isSelected={(updateProvider as { ruc: string }).ruc === row.ruc} onClick={() => selectProviderToUpdate((updateProvider as { ruc: string }).ruc === row.ruc ? null : row)} />
                    <IconButton icon="delete" isSelected onClick={() => handleDeleteProvider(row.ruc)} />
                </div>
            )
        },

    ]
    if (isLoading) return <Loader />
    return (
        <div >
            <MaintananceLayout title="Proveedores">
                <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-center">
                        <label htmlFor="provider_description" className="text-lg font-semibold text-gray-500 ">Buscar proveedor:</label>
                        <Input
                            id="provider_description"
                            typeForm="search"
                            className="flex flex-col w-1/3"
                            value={querySearch}
                            required={true}
                            onChange={(e) => { setQuerySearch(e.target.value) }}
                        />
                    </div>
                    <Table<ProviderMP> columns={columns} data={providers} />
                    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                        <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                            Página <span className="font-semibold text-gray-900">{paginationOptions.currentPage}</span> de <span className="font-semibold text-gray-900">{paginationOptions.totalPages}</span>
                        </span>
                        <div className="flex items-center">
                            <select
                                className="mr-4 p-2 border rounded"
                                value={paginationOptions.itemsPerPage}
                                onChange={(e) => changeItemsPerPage(Number(e.target.value))}
                            >
                                {[10, 15, 20, 25, 30].map(value => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li className="flex flex-row">
                                    <button
                                        type="button"
                                        onClick={goToFirstPage}
                                        disabled={paginationOptions.currentPage === 1}
                                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <TbPlayerTrackPrev />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goToPreviousPage}
                                        disabled={paginationOptions.currentPage === 1}
                                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <GrCaretPrevious />
                                    </button>
                                </li>
                                <li className="flex flex-row">
                                    <button
                                        type="button"
                                        onClick={goToNextPage}
                                        disabled={paginationOptions.currentPage === paginationOptions.totalPages}
                                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <GrCaretNext />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goToLastPage}
                                        disabled={paginationOptions.currentPage === paginationOptions.totalPages}
                                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <TbPlayerTrackNext />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <form className="flex w-full flex-col" onSubmit={handleSubmit}>
                    <Input
                        id="provider_ruc"
                        label="RUC/DNI:"
                        typeForm="maintanance"
                        className="flex flex-col w-full"
                        value={formProvider.ruc}
                        onChange={(e) => handleInputChangeNewProvider(e.target.value, "ruc")}
                        type={(updateProvider as { ruc: string }) ? "text" : "number"}
                        required={true}
                        maxLength={11}
                    />
                    <Input
                        id="provider_description"
                        label="Descripción:"
                        typeForm="maintanance"
                        className="flex flex-col w-full"
                        value={formProvider.description}
                        required={true}
                        onChange={(e) => handleInputChangeNewProvider(e.target.value, "description")}
                    />
                    <Input
                        id="provider_address"
                        label="Dirección:"
                        typeForm="maintanance"
                        className="flex flex-col w-full"
                        value={formProvider.address}
                        onChange={(e) => handleInputChangeNewProvider(e.target.value, "address")}
                    />
                    <Input
                        id="provider_phone"
                        label="Teléfono:"
                        typeForm="maintanance"
                        className="flex flex-col w-full"
                        value={formProvider.phone}
                        type="number"
                        onChange={(e) => handleInputChangeNewProvider(e.target.value, "phone")}
                    />
                    <Input
                        id="provider_email"
                        label="Correo electrónico:"
                        typeForm="maintanance"
                        className="flex flex-col w-full"
                        value={formProvider.email}
                        type="email"
                        onChange={(e) => handleInputChangeNewProvider(e.target.value, "email")}
                    />
                    <div className="flex flex-row justify-between items-center">
                        <label className="text-lg font-semibold text-gray-400 mb-4">Cuentas bancarias:</label>
                        <IconButton icon="plus" isSelected={false} onClick={addAccount} />
                    </div>
                    <div className="overflow-x-auto whitespace-nowrap">
                        {formProvider.accounts.map((account, index) => (
                            <div key={index} className="inline-block mr-5">
                                <div className="flex flex-row border border-sky-300 pl-3 pt-2 mb-2 rounded-lg">
                                    <div className="flex flex-col w-96 pr-2">
                                        <div className="flex flex-row justify-between gap-2">
                                            <Input
                                                id={`account_number_${index}`}
                                                label="Número de cuenta:"
                                                typeForm="maintanance"
                                                className="flex flex-col w-1/2"
                                                value={account.accountNumber}
                                                onChange={(e) => handleInputChangeNewProvider(e.target.value, "accountNumber", index)}
                                                required={true}
                                            />
                                            <CustomSelect
                                                id={`bank_name_${index}`}
                                                label="Banco:"
                                                onChange={(value) => handleInputChangeNewProvider((value as OptionType).value, "bank", index)}
                                                options={bankOptions}
                                                typeForm="maintanance"
                                                value={{
                                                    label: bankOptions.find(banK => banK.value === formProvider.accounts[index].bank)?.label || "",
                                                    value: formProvider.accounts[index].bank || ""
                                                }}
                                                className="flex flex-col w-1/2"
                                            />
                                        </div>
                                        <div className="flex flex-row justify-between gap-2">
                                            <Input
                                                id={`cci_${index}`}
                                                label="CCI:"
                                                typeForm="maintanance"
                                                className="flex flex-col w-1/2"
                                                value={account.cci}
                                                onChange={(e) => handleInputChangeNewProvider(e.target.value, "cci", index)}
                                            />
                                            <CustomSelect
                                                id={`bank_type_${index}`}
                                                label="Tipo de cuenta:"
                                                onChange={(value) => handleInputChangeNewProvider((value as OptionType).value, "type", index)}
                                                options={typeAccountOptions}
                                                typeForm="maintanance"
                                                value={{
                                                    label: typeAccountOptions.find(banK => banK.value === formProvider.accounts[index].type)?.label || "",
                                                    value: formProvider.accounts[index].type || ""
                                                }}
                                                className="flex flex-col w-1/2"
                                            />
                                        </div>
                                    </div>
                                    {index !== 0 && <div className="  w-1/12">
                                        <IconButton icon="minus" isSelected={false} onClick={() => { account.id ? handleDeleteProviderAccount(account.id, index) : removeAccount(index) }} />
                                    </div>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button text={updateProvider ? "Actualizar" : "Crear"} type="submit" styleType="form" />
                </form>
            </MaintananceLayout>
        </div>
    )
}
