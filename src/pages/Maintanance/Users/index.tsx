import { Button, IconButton, Input, Loader, MaintananceLayout, Pagination, Table, Tag, ToggleButton } from "../../../components";
import CheckboxList from "../../../components/UI/CheckboxList";
import { useUser } from "../../../hooks/useUser";
import { TableColumn } from "../../../types/common/table";
import { UserI } from "../../../types/user";
import { convertToCheckboxOptions } from "../../../utils/functions";


export default function Users() {
    const {
        isLoading,
        roles,
        users,
        handleInputUserForm,
        handleSelectionRole,
        userFormRequest,
        toggleUserStatus,
        handleUserSelection,
        userToUpdate,
        onSubmit,
        selectedRoles,
        changePassword,
        setChangePassword,
        handlePageChange,
        currentPage,
        userChunks
    } = useUser();

    const columns: TableColumn<UserI>[] = [
        { key: "id", label: "ID Usuario" },
        { key: "description", label: "Descripción" },
        {
            key: "actions", label: "Roles", actions: (row) => (
                row.userRoles.map(role => <Tag key={role.id} text={role.description} />)
            )
        },
        {
            key: "actions", label: "Activo", actions: (row) => (
                <ToggleButton checked={row.isActive} onChange={() => toggleUserStatus(row.id)} />
            )
        },
        {
            key: "actions", label: "Acciones", actions: (row) => (
                <IconButton icon="edit" isSelected={userToUpdate === row} onClick={() => handleUserSelection(userToUpdate === row ? null : row)} />
            )
        }
    ];

    const roleOptions = convertToCheckboxOptions({
        data: roles,
        labelKey: "description",
        valueKey: "id"
    });

    if (isLoading) return <Loader />
    return (
        <MaintananceLayout title="Usuarios">
            <div className="flex flex-col justify-between h-full">
                <Table<UserI> columns={columns} data={users} />
                <br />
                <Pagination
                    currentPage={currentPage}
                    totalPages={userChunks.length}
                    onPageChange={handlePageChange}
                />
            </div>
            <form className="flex flex-col w-full" onSubmit={onSubmit}>
                {
                    !changePassword &&
                    <>
                        <Input
                            id={`userId`}
                            label="ID de usuario:"
                            typeForm="maintanance"
                            className="flex flex-col w-full"
                            onChange={(e) => handleInputUserForm(e.target.value.toUpperCase(), "id")}
                            required={true}
                            value={userFormRequest.id}
                            disabled={!!userToUpdate}
                        />
                        <Input
                            id={`userDescription`}
                            label="Descripción:"
                            typeForm="maintanance"
                            className="flex flex-col w-full"
                            onChange={(e) => handleInputUserForm(e.target.value.toUpperCase(), "description")}
                            required={true}
                            value={userFormRequest.description}
                            disabled={changePassword}
                        />
                    </>
                }
                {
                    userToUpdate &&
                    <Button
                        styleType="danger"
                        text={!changePassword ? "Cambiar contraseña" : "Cancelar"}
                        type="button"
                        isFilled
                        onClick={() => setChangePassword(!changePassword)}
                    />
                }
                {
                    (!userToUpdate || changePassword) &&
                    <>
                        <Input
                            id={`password`}
                            label="Contraseña:"
                            typeForm="maintanance"
                            className="flex flex-col w-full"
                            onChange={(e) => handleInputUserForm(e.target.value, "password")}
                            required={true}
                            type="password"
                            value={userFormRequest.password}
                        />
                        <Input
                            id={`repeatPassword`}
                            label="Repetir contraseña:"
                            typeForm="maintanance"
                            className="flex flex-col w-full"
                            onChange={(e) => handleInputUserForm(e.target.value, "repeatPassword")}
                            required={true}
                            type="password"
                            value={userFormRequest.repeatPassword}
                        />
                    </>
                }
                {
                    !changePassword &&
                    <CheckboxList
                        options={roleOptions}
                        title="Roles:"
                        onSelectionChange={handleSelectionRole}
                        selectedOptions={selectedRoles.map(role => String(role))}
                    />
                }
                <br />
                <Button text={userToUpdate ? "Actualizar" : "Crear"} type="submit" styleType="form" />
            </form>
        </MaintananceLayout>
    )
}
