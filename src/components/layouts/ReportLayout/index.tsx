import { BiCheck, BiTrash } from "react-icons/bi"
import { Button, CheckBoxSelector, CustomSelect, IconButton, Input } from "../.."
import { useMainFilter } from "../../../hooks/useMainFilter"
import CustomDateRange from "../../UI/CustomDateRange"
import RangeAmounts from "../../UI/RangeAmounts"
import { shortOrderTypeOptions } from "../../../utils/constants"
import "./styles.css";
import { RiFileExcel2Line } from "react-icons/ri"
import { FaSearch } from "react-icons/fa"
import { OrderWithDocumentsI, ReportType } from "../../../types/reports"




interface Props {
  readonly children: React.ReactNode
  readonly reportType: ReportType
  readonly onSubmit: (data: OrderWithDocumentsI[]) => void
  readonly onExport?: () => void
  readonly documentsToExport?: []
}

/**
 * ReportLayout component
 * Filter
 *  by company
 *  by order type
 *  by date range
 *  by document type (voucher)
 *  by order number
 *  by supplier
 *  by total range
 * Functions
 *  export to excel 
 * @returns JSX.Element
 */

export default function ReportLayout({
  children,
  documentsToExport,
  onExport,
  onSubmit,
  reportType
}: Props) {
  const {
    handleDateRange,
    showFilter,
    setShowFilter,
    searchOrderDocuments
  } = useMainFilter(reportType);

  const handleSearch = async () => {
    const data = await searchOrderDocuments();
    if (data) onSubmit(data!);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <IconButton
          icon={showFilter ? "show" : "hide"}
          onClick={() => setShowFilter(!showFilter)}
        />
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <Button
            styleType="danger"
            text="Limpiar"
            type="button"
            icon={BiTrash}
          />
          <Button
            styleType="success"
            text="Exportar"
            type="button"
            icon={RiFileExcel2Line}
          />
          <Button
            styleType="primary"
            text="Buscar"
            type="button"
            icon={FaSearch}
            onClick={handleSearch}
          />
        </div>
      </div>
      <div className={`filter-container ${showFilter ? 'show' : ''}`}>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2 border border-gray-200 rounded-lg p-5">
          <div className="col-span-1">
            <CustomDateRange
              onChange={handleDateRange}
            />
          </div>
          {
            reportType === "general" &&
            <>
              <div className="col-span-1 sm:col-span-2">
                <Input
                  id="orderNumber"
                  typeForm="create"
                  placeholder="0000000000"
                  label="N° de orden"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <CustomSelect
                  id="supplierFilter"
                  label="Proveedor"
                  options={[]}
                  onChange={() => { }}
                  typeForm="create"
                />
              </div>

            </>
          }
          <div className="sm:col-span-2">
            <RangeAmounts
              initialFrom={0}
              initialTo={100000}
              max={200000}
              min={0}
              label="Total"
            />
          </div>
          {
            reportType === "general" &&
            <div className="col-span-1 sm:col-span-2 md:pl-5">
              <CheckBoxSelector
                onChange={() => { }}
                options={shortOrderTypeOptions.map((option) => {
                  return { ...option, icon: BiCheck }
                })}
                title="Tipo de orden"
              />
            </div>
          }

          {reportType !== "general" &&
            <div className="col-span-1 md:col-span-2">
              <CustomSelect
                id="documentType"
                label="Tipo de comprobante"
                options={[]}
                onChange={() => { }}
                typeForm="create"
              />
            </div>
          }

        </div>
      </div>
      {children}
    </div>
  )
}