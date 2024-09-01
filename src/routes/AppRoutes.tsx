import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthLayout, MainLayout } from "../components";
import {
    ApprovingPersonnel,
    CorrelativeControl,
    CostCenter,
    CreateDocument,
    CreateOrder,
    Home,
    Login,
    NotFound,
    OrderDocumentReport,
    PettyCashReport,
    Profile,
    Provider,
    PurchasingReport,
    RequestingArea,
    SunatDocuments,
    UpdateDocument,
    UpdateOrder,
    Users
} from "../pages";

export default function AppRoutes() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="/" element={<MainLayout />}>
                        <Route path="dashboard" index element={<Home />} />

                        <Route path="maintanance/providers" element={<Provider />} />
                        <Route path="maintanance/cost-center" element={<CostCenter />} />
                        <Route path="maintanance/approving-personnel" element={<ApprovingPersonnel />} />
                        <Route path="maintanance/requesting-area" element={<RequestingArea />} />
                        <Route path="maintanance/sunat-documents" element={<SunatDocuments />} />
                        <Route path="maintanance/users" element={<Users />} />
                        <Route path="maintanance/correlative-control" element={<CorrelativeControl />} />


                        <Route path="order-mp/create" element={<CreateOrder />} />
                        <Route path="order-mp/udpate" element={<UpdateOrder />} />

                        <Route path="document-mp-voucher/create/:orderCompanyId/:orderTypeId/:orderPeriod/:orderCorrelative"  element={<CreateDocument />} />
                        <Route path="document-mp-voucher/udpate" element={<UpdateDocument />} />

                        <Route path="reports/order-document" element={<OrderDocumentReport />} />
                        <Route path="reports/petty-cash" element={<PettyCashReport />} />
                        <Route path="reports/purchasing" element={<PurchasingReport />} />

                        <Route path="profile" element={<Profile />} />

                    </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                </Route>
            </Routes>
        </Router>
    )
}