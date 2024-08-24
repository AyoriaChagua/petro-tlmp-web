import { Button, IconButton, Input, Loader, MaintananceLayout, Table } from "../../../components";
import { useRequestingArea } from "../../../hooks/useRequestingArea"
import { TableColumn } from "../../../types/common/table";
import { RequestingAreaI } from "../../../types/requesting-area";


export default function RequestingArea() {
    const {
        handleDeleteArea,
        requestingAreas,
        handleInputRequestingArea,
        handleSelectAreaToUpdate,
        idAreaToUpdate,
        isLoading,
        onSubmit,
        requestingAreaRequest
    } = useRequestingArea();
    const columns: TableColumn<RequestingAreaI>[] = [
        { key: "id", label: "ID" },
        { key: "description", label: "Descripción" },
        {
            key: "actions", label: "Acciones", actions: (row) => (
                <div className="flex flex-row gap-3">
                    <IconButton icon="edit" isSelected={idAreaToUpdate === row.id} onClick={() => handleSelectAreaToUpdate(row)} />
                    <IconButton icon="delete" isSelected onClick={() => handleDeleteArea(row.id)} />
                </div>
            )
        },


    ]
    if (isLoading) return <Loader />
    return (
        <MaintananceLayout title="Área solicitante">
            <Table<RequestingAreaI> columns={columns} data={requestingAreas} />
            <form className="flex w-full flex-col"  onSubmit={onSubmit}>
                <Input
                    id="areaRequestingDescrition"
                    typeForm="maintanance"
                    label="Descripción:"
                    onChange={(e) => handleInputRequestingArea(e.target.value, "description")}
                    className="flex flex-col w-full"
                    value={requestingAreaRequest.description}
                />
                <Button text={idAreaToUpdate ? "Actualizar" : "Crear"} type="submit" styleType="form" />
            </form>
        </MaintananceLayout>
    )
}
