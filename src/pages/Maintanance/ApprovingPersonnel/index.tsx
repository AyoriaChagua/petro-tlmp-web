import { Button, IconButton, Input, Loader, MaintananceLayout, Table } from "../../../components";
import { useApprovalPersonnel } from "../../../hooks/useApprovalPersonnel"
import { ApprovalPersonnel } from "../../../types/approval-personnel";
import { TableColumn } from "../../../types/common/table";

export default function ApprovingPersonnel() {
    const {
        approvalPersonnel,
        isLoading,
        approvalPersonnelRequest,
        handleInputApprovalPersonnelRequest,
        onSubmit,
        handleDeletePersonnel,
        handleSelectPersonnelToUpdate,
        personnelToUpdate
    } = useApprovalPersonnel();

    const columns: TableColumn<ApprovalPersonnel>[] = [
        { key: "id", label: "ID" },
        { key: "description", label: "Nombre completo" },
        { key: "phone", label: "Telefono" },
        {
            key: "actions", label: "Acciones", actions: (row) => (
                <div className="flex flex-row gap-3">
                    <IconButton icon="edit" isSelected={personnelToUpdate === row.id} onClick={() => handleSelectPersonnelToUpdate(row)} />
                    <IconButton icon="delete" isSelected onClick={() => handleDeletePersonnel(row.id)} />
                </div>
            )
        }
    ]

    if (isLoading) return <Loader />
    return (
        <MaintananceLayout title="Aprobadores">
            <div>
                <Table<ApprovalPersonnel> columns={columns} data={approvalPersonnel} />
            </div>
            <form className="flex w-full flex-col" onSubmit={onSubmit}>
                <Input
                    id="approvalPersonnelDescripcion"
                    typeForm="maintanance"
                    label="Nombre y Apellidos"
                    value={approvalPersonnelRequest.description}
                    onChange={(e) => handleInputApprovalPersonnelRequest(e.target.value.toUpperCase(), "description")}
                    className="flex flex-col w-full"
                    required={true}
                />
                <Input
                    id="approvalPersonnelPhone"
                    typeForm="maintanance"
                    label="Teléfono:"
                    value={approvalPersonnelRequest.phone || ""}
                    onChange={(e) => handleInputApprovalPersonnelRequest(e.target.value, "phone")}
                    className="flex flex-col w-full"
                    type="number"
                />
                <Button text={personnelToUpdate ? "Actualizar" : "Crear"} type="submit" styleType="form" />
            </form>
        </MaintananceLayout>
    )
}
