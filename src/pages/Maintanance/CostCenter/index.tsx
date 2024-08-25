import { Button, IconButton, Input, Loader, MaintananceLayout, Table } from "../../../components";
import { useCostCenter } from "../../../hooks/useCostCenter";
import { TableColumn } from "../../../types/common/table";
import { CostCenterI } from "../../../types/cost-center";


export default function CostCenter() {

    const {
        costCenters,
        isLoading,
        costCenterRequest,
        costCenterToUpdate,
        handleDeletePersonnel,
        handleInputCostCenterRequest,
        handleSelectCostCenterToUpdate,
        onSubmit
    } = useCostCenter();

    const columns: TableColumn<CostCenterI>[] = [
        { key: "id", label: "ID" },
        { key: "description", label: "Descripción" },
        { key: "aliasReport", label: "ID para reporte" },
        {
            key: "actions", label: "Acciones", actions: (row) => (
                <div className="flex flex-row gap-3">
                    <IconButton icon="edit" isSelected={costCenterToUpdate === row.id} onClick={() => handleSelectCostCenterToUpdate(costCenterToUpdate !== row.id ? row : null)} />
                    <IconButton icon="delete" isSelected onClick={() => handleDeletePersonnel(row.id)} />
                </div>
            )
        }

    ];

    if (isLoading) return <Loader />;
    return (
        <MaintananceLayout title="Destinos">
            <Table<CostCenterI> columns={columns} data={costCenters} />
            <form className="flex w-full flex-col" onSubmit={onSubmit}>
                <Input
                    id="costCenterDescription"
                    typeForm="maintanance"
                    label="Descripción:"
                    onChange={(e) => handleInputCostCenterRequest(e.target.value, "description")}
                    className="flex flex-col w-full"
                    required={true}
                    value={costCenterRequest.description}
                />
                <Input
                    id="aliasForReport"
                    typeForm="maintanance"
                    label="ID para reporte:"
                    onChange={(e) => handleInputCostCenterRequest(e.target.value, "aliasReport")}
                    className="flex flex-col w-full"
                    value={costCenterRequest.aliasReport}
                />
                <Button text={costCenterToUpdate ? "Actualizar" : "Crear"} type="submit" styleType="form" />
            </form>
        </MaintananceLayout>
    )
}
