import { useEffect, useState } from "react"
import { CorrelativeControlReq, CorrelativeControlRes } from "../types/correlative-control"
import { getCorrelativeControl } from "../api/correlative-control/get";
import { useAuth } from "../context/AuthContext";
import { OptionType, OptionTypeParam } from "../types/common/inputs";
import { SingleValue } from "react-select";
import { postCorrelativeControl } from "../api/correlative-control/post";
import { orderTypeOptions } from "../utils/constants";
import { putCorrelativeControl } from "../api/correlative-control/put";
import { deleteCorrelativeControl } from "../api/correlative-control/delete";
import { showErrorMessage } from "../utils/functions";

export const useCorrelativeControl = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [correlativeControl, setCorrelativeControl] = useState<CorrelativeControlRes[]>([]);
    const { companySelected, user } = useAuth();

    const [company, setCompany] = useState(companySelected);
    const [orderType, setOrderTypeState] = useState({ label: "Orden de compra", value: "O/C" });
    const [year, setYear] = useState(new Date().getFullYear());
    const [correlative, setCorrelative] = useState("00000001");

    const [correlativeControlToUpdate, setCorrelativeControlToUpdateState] = useState<CorrelativeControlRes | null>(null);

    const setOrderType = (option: OptionTypeParam) => {
        const singleOption = option as SingleValue<OptionType>
        setOrderTypeState({ label: singleOption?.label!, value: singleOption?.value! });
    }

    const setCorrelativeControlToUpdate = (correlativeC: CorrelativeControlRes | null) => {
        setCorrelativeControlToUpdateState(correlativeC);
        if (correlativeC) {
            setOrderTypeState(orderTypeOptions.find(cc => cc.value == correlativeC.orderTypeId)!);
            setYear(parseInt(correlativeC.period));
            setCorrelative(correlativeC.correlative);
        } else {
            setCompany(companySelected);
            setOrderTypeState({ label: "Orden de compra", value: "O/C" });
            setYear(new Date().getFullYear());
            setCorrelative("00000001");
        }
    };

    const fetchCorrelativeControl = async () => {
        try {
            const data = await getCorrelativeControl.getByCompanyId(companySelected?.value!);
            setCorrelativeControl(data);
        } catch (error) {
            showErrorMessage("No se pudo obtener los correlativos");
        }
    }

    const handleDelete = async (companyId: string, orderTypeId: string, period: string) => {
        try {
            await deleteCorrelativeControl.deleteById(companyId, orderTypeId, period);
            setCorrelativeControl(prevState => (
                prevState.filter(cc => (
                    cc.companyId !== companyId ||
                    cc.orderTypeId !== orderTypeId ||
                    cc.period !== period
                ))
            ))
        } catch (error) {
            showErrorMessage("No se pudo eliminar el correlativo");
        } finally {
        }
    }

    const toggleActiveButton = async (ccr: CorrelativeControlRes) => {
        const companyWithIdActive = correlativeControl
            .filter(cc => cc.companyId === ccr.companyId && cc.orderTypeId === ccr.orderTypeId)
            .find(c => c.active);
        if (!ccr.active && companyWithIdActive) {
            showErrorMessage("Solo puede haber un control activo por compañía y tipo de orden");
            return;
        }
        const resToggle = await putCorrelativeControl.toggleState(ccr.companyId, ccr.orderTypeId.replace('/', '%2F'), ccr.period);
        if (resToggle) {
            const updatedCorrelativeControl = correlativeControl.map(cc => (
                cc.companyId === ccr.companyId && cc.orderTypeId === ccr.orderTypeId && cc.period === ccr.period
                    ? { ...cc, active: !cc.active }
                    : cc
            ));
            setCorrelativeControl(updatedCorrelativeControl);
        }
        else showErrorMessage("Error al actualizar el estado del control correlativo");
        return;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!parseInt(correlative, 10)) {
                throw new Error("Correlativo inválido, evite ingresar caracteres no numéricos");
            }
            const newCorrelative: CorrelativeControlReq = {
                companyId: companySelected?.value!,
                orderTypeId: orderType.value,
                active: false,
                correlative,
                period: year.toString(),
                systemUser: user?.id!
            };

            if (correlativeControlToUpdate) {
                const updatedCorrelative = await putCorrelativeControl.updateCorrelative(
                    newCorrelative.companyId,
                    newCorrelative.orderTypeId,
                    newCorrelative.period,
                    newCorrelative.correlative
                );

                if (!updatedCorrelative) {
                    throw new Error("No se pudo actualizar el correlativo");
                }

                setCorrelativeControl((prevState) =>
                    prevState.map((item) =>
                        item.companyId === correlativeControlToUpdate.companyId &&
                            item.orderTypeId === correlativeControlToUpdate.orderTypeId &&
                            item.period === correlativeControlToUpdate.period
                            ? { ...item, ...updatedCorrelative }
                            : item
                    )
                );
            } else {
                const createdCorrelative = await postCorrelativeControl.create(newCorrelative);

                if (!createdCorrelative) {
                    throw new Error("No se pudo crear el correlativo");
                }

                setCorrelativeControl((prevState) => [...prevState, createdCorrelative]);
            }
            setOrderTypeState({ label: "Orden de compra", value: "O/C" });
            setYear(new Date().getFullYear());
            setCorrelative("00000001");
            setCorrelativeControlToUpdateState(null);
        } catch (error) {
            showErrorMessage(
                (error as Error).message.includes("409")
                    ? "El correlativo ya existe"
                    : (error as Error).message
            );
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchCorrelativeControl().then(() => setIsLoading(false));
    }, [companySelected]);

    return {
        correlativeControl,
        fetchCorrelativeControl,
        isLoading,
        showErrorMessage,
        company,
        setCompany,
        orderType,
        setOrderType,
        year,
        setYear,
        correlative,
        setCorrelative,
        handleSubmit,
        correlativeControlToUpdate,
        setCorrelativeControlToUpdate,
        handleDelete,
        toggleActiveButton
    }
}