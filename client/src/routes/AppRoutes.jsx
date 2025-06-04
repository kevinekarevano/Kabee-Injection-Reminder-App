import UserHome from "@/pages/User/HomePage";
import { Routes, Route } from "react-router";
import LoginPage from "@/pages/Auth/LoginPage";
import RootLayout from "@/components/layouts/RootLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminHome from "@/pages/Dashboard/HomePage";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import UsersPage from "@/pages/Dashboard/UsersPage";
import CreateUserPage from "@/pages/Dashboard/CreateUserPage";
import EditUserPage from "@/pages/Dashboard/EditUserPage";
import UserHistoryPage from "@/pages/Dashboard/UserHistoryPage";
import ChatPage from "@/pages/Dashboard/ChatPage";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import RoleBasedRoute from "@/components/routes/RoleBasedRoute";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* User Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["user"]}>
                <RootLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<UserHome />} />
        </Route>

        {/* Admin Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="create-user" element={<CreateUserPage />} />
          <Route path="user/:id" element={<EditUserPage />} />
          <Route path="user/history/:id/:username" element={<UserHistoryPage />} />
          <Route path="user/chat/:id" element={<ChatPage />} />
        </Route>

        {/* Auth */}
        <Route path="/auth/login" element={<LoginPage />} />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
