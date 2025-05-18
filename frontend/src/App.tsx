import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/layout/AppLayout";

// Import pages
import Dashboard from "./pages/Dashboard.tsx";
import ReceiptDetail from "./pages/ReceiptDetail.tsx";
import UploadReceipt from "./pages/UploadReceipt.tsx";
import Reports from "./pages/Reports.tsx";
import ReceiptsList from "./pages/ReceiptsList.tsx";
import Settings from "./pages/Settings.tsx";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with AppLayout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/receipt/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <ReceiptDetail />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/receipts"
          element={
            <PrivateRoute>
              <AppLayout>
                <ReceiptsList />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <AppLayout>
                <UploadReceipt />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
