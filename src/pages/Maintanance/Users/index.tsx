import { Button, IconButton, Input, Loader, MaintananceLayout, Table, Tag, ToggleButton } from "../../../components";
import CheckboxList from "../../../components/UI/CheckboxList";
import { useUser } from "../../../hooks/useUser";
import { TableColumn } from "../../../types/common/table";
import { UserI } from "../../../types/user";
import { convertToCheckboxOptions } from "../../../utils/functions";


export default function Users() {
    const {
        isLoading,
        roles,
        users
    } = useUser();

    const columns: TableColumn<UserI>[] = [
        { key: "id", label: "ID Usuario" },
        { key: "description", label: "Descripción" },
        {
            key: "actions", label: "Roles", actions: (row) => (
                row.userRoles.map(role => <Tag key={row.id} text={role.description} />)
            )
        },
        {
            key: "actions", label: "Activo", actions: (row) => (
                <ToggleButton checked={row.isActive} name="" onChange={() => { }} />
            )
        },
        {
            key: "actions", label: "Acciones", actions: (row) => (
                <IconButton icon="edit" isSelected={false} onClick={() => { }} />
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
            <div className="flex flex-col">
                <Table<UserI> columns={columns} data={users} />
            </div>
            <form className="flex flex-col w-full">
                <Input
                    id={`userId`}
                    label="ID de usuario:"
                    typeForm="maintanance"
                    className="flex flex-col w-full"
                    onChange={(e) => {}}
                    required={true}
                />
                <Input
                    id={`userDescription`}
                    label="Descripción:"
                    typeForm="maintanance"
                    className="flex flex-col w-full"
                    onChange={(e) => {}}
                    required={true}
                />
                <Input
                    id={`password`}
                    label="Contraseña:"
                    typeForm="maintanance"
                    className="flex flex-col w-full"
                    onChange={(e) => {}}
                    required={true}
                    type="password"
                />
                <Input
                    id={`repeatPassword`}
                    label="Repetir contraseña:"
                    typeForm="maintanance"
                    className="flex flex-col w-full"
                    onChange={(e) => {}}
                    required={true}
                    type="password"
                />
                <CheckboxList options={roleOptions} title="Roles:" onSelectionChange={()=>{}} />
                <br />
                <Button text={"Crear"} type="submit" styleType="form" />
            </form>
        </MaintananceLayout>
    )
}
