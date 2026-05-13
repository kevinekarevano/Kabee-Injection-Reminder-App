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
import DataEntryPage from "@/pages/Dashboard/DataEntryPage";
import PendingInjectionPage from "@/pages/Dashboard/InjectionPage";
import DataReportPage from "@/pages/Dashboard/DataReportPage";
import ChatListPage from "@/pages/Dashboard/ChatListPage";
import ChatHistoryPage from "@/pages/Dashboard/ChatHistoryPage";
import CreateArticlePage from "@/pages/Dashboard/CreateArticlePage";
import ArticlesPage from "@/pages/Dashboard/ArticlesPage";
import EditArticlePage from "@/pages/Dashboard/EditArticlePage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import PublicArticlesPage from "@/pages/PublicArticlesPage";
import LandingPage from "@/pages/LandingPage";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/articles" element={<PublicArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetailPage />} />

        {/* User Route */}
        <Route
          path="/user"
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
          <Route path="chat" element={<ChatListPage />} />
          <Route path="chat/history" element={<ChatHistoryPage />} />
          <Route path="users/data-entry" element={<DataEntryPage />} />
          <Route path="users/pending-injection" element={<PendingInjectionPage />} />
          <Route path="users/data-report" element={<DataReportPage />} />
          <Route path="articles/create" element={<CreateArticlePage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/edit/:id" element={<EditArticlePage />} />
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
