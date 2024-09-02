import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthLayout, MainLayout } from "../components";
import {
    ApprovingPersonnel,
    CorrelativeControl,
    CostCenter,
    CreateDocument,
    CreateOrder,
    CreatePaymentDocument,
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
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return children;
};

const AuthenticatedRedirect = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || "/dashboard";
        return <Navigate to={from} replace />;
    }

    return null;
};

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Home />} />
                    <Route path="maintanance/providers" element={<Provider />} />
                    <Route path="maintanance/cost-center" element={<CostCenter />} />
                    <Route path="maintanance/approving-personnel" element={<ApprovingPersonnel />} />
                    <Route path="maintanance/requesting-area" element={<RequestingArea />} />
                    <Route path="maintanance/sunat-documents" element={<SunatDocuments />} />
                    <Route path="maintanance/users" element={<Users />} />
                    <Route path="maintanance/correlative-control" element={<CorrelativeControl />} />
                    <Route path="order-mp/create" element={<CreateOrder />} />
                    <Route path="order-mp/udpate" element={<UpdateOrder />} />
                    <Route path="document-mp-voucher/create/:orderCompanyId/:orderTypeId/:orderPeriod/:orderCorrelative" element={<CreateDocument />} />
                    <Route path="document-mp-voucher-payment/create/:companyId/:orderDocumentNumber" element={<CreatePaymentDocument />} />
                    <Route path="document-mp-voucher/udpate" element={<UpdateDocument />} />
                    <Route path="reports/order-document" element={<OrderDocumentReport />} />
                    <Route path="reports/petty-cash" element={<PettyCashReport />} />
                    <Route path="reports/purchasing" element={<PurchasingReport />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<><Login /><AuthenticatedRedirect /></>} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}