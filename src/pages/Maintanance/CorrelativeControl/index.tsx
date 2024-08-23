import { BsPencilFill } from "react-icons/bs";
import { Button, CustomSelect, Input, Loader, MaintananceLayout, Table, ToggleButton, YearPicker } from "../../../components";
import { useCorrelativeControl } from "../../../hooks/useCorrelativeControl"
import { TableColumn } from "../../../types/common/table";
import { CorrelativeControlRes } from "../../../types/correlative-control";
import { RiCloseFill } from "react-icons/ri";
import { useAuth } from "../../../context/AuthContext";
import { orderTypeOptions } from "../../../utils/constants";


export default function CorrelativeControl() {
    const {
        correlativeControl,
        isLoading,
        toggleActiveButton,
        orderType,
        handleSubmit,
        setOrderType,
        year,
        setYear,
        correlative,
        setCorrelative,
        correlativeControlToUpdate,
        setCorrelativeControlToUpdate,
        handleDelete,
    } = useCorrelativeControl();

    const { companySelected } = useAuth();


    const isSameCorrelative = (control: CorrelativeControlRes | null, row: CorrelativeControlRes): boolean => {
        return control !== null &&
            control.companyId === row.companyId &&
            control.orderTypeId === row.orderTypeId &&
            control.period === row.period;
    };

    const columns: TableColumn<CorrelativeControlRes>[] = [
        { key: "companyId", label: "Id" },
        { key: "ciaDescription", label: "Compañia" },
        { key: "orderTypeId", label: "Tipo" },
        { key: "correlative", label: "Correlativo" },
        { key: "period", label: "Periodo" },
        {
            key: "actions", label: "Activo", actions: (row) => (
                <div>
                    <ToggleButton checked={row.active} name="" onChange={() => toggleActiveButton(row)} />
                </div>
            )
        },
        {
            key: "actions", label: "Acciones", actions: (row) => (
                <div className="flex flex-row gap-2">
                    <Button
                        text=""
                        icon={BsPencilFill}
                        styleType="warning"
                        type="button"
                        onClick={() => setCorrelativeControlToUpdate(isSameCorrelative(correlativeControlToUpdate, row) ? null : row)}
                        isFilled={isSameCorrelative(correlativeControlToUpdate, row)}
                    />
                    <Button
                        text=""
                        icon={RiCloseFill}
                        styleType="danger"
                        type="button"
                        onClick={() => handleDelete(row.companyId, row.orderTypeId, row.period)}
                    />
                </div>
            )
        },
    ];


    if (isLoading) return <Loader />
    return (
        <div>
            <MaintananceLayout title="Correlativos">
                <Table<CorrelativeControlRes> columns={columns} data={correlativeControl.sort((a, b) => parseInt(a.period) - parseInt(b.period))} />
                <form className="flex w-full flex-col" onSubmit={handleSubmit}>

                    <CustomSelect
                        id="correlative_control_company"
                        label="Compañia"
                        onChange={() => { }}
                        options={[]}
                        disabled={true}
                        value={{
                            label: companySelected?.label!,
                            value: companySelected?.value!
                        }}
                        typeForm="maintanance"
                    />

                    <div className="flex flex-row justify-between gap-3">
                        <CustomSelect
                            id="correlative_control_order_type"
                            label="Tipo de Orden"
                            onChange={(value) => setOrderType(value)}
                            options={orderTypeOptions}
                            typeForm="maintanance"
                            value={{ label: orderType.label, value: orderType.value }}
                            className="flex flex-col w-1/2"
                            disabled={correlativeControlToUpdate ? true : false}
                        />

                        <YearPicker
                            onYearChange={(year) => setYear(year)}
                            selectedYear={year}
                            className="flex flex-col w-1/2"
                            disabled={correlativeControlToUpdate ? true : false}
                        />
                    </div>

                    <Input
                        id="correlative_control_correlative"
                        label="Correlativo"
                        typeForm="maintanance"
                        className="flex flex-col w-full"
                        value={correlative}
                        onChange={(e) => setCorrelative(e.target.value)}
                        maxLength={8}
                    />
                    <Button text={correlativeControlToUpdate ? "Actualizar" : "Crear"} type="submit" styleType="form" />
                </form>
            </MaintananceLayout>
        </div>
    )
}
