import { Navigate } from "react-router";
import useAppStore from "@/stores/useAppStore";
import Loader from "../ui/loader";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { userData, isLoggedIn, isAuthChecked } = useAppStore();

  if (!isAuthChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#232E30" }}>
        <Loader className={"w-100"} />
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/auth/login" replace />;

  // Auto redirect based on user role
  if (userData?.role) {
    // If admin tries to access user routes, redirect to dashboard
    if (userData.role === "admin" && allowedRoles.includes("user") && !allowedRoles.includes("admin")) {
      return <Navigate to="/dashboard" replace />;
    }

    // If user tries to access admin routes, redirect to home
    if (userData.role === "user" && allowedRoles.includes("admin") && !allowedRoles.includes("user")) {
      return <Navigate to="/" replace />;
    }
  }

  // Check if user role is allowed for this route
  if (!allowedRoles.includes(userData?.role)) {
    // Default redirect based on role
    const redirectPath = userData?.role === "admin" ? "/dashboard" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleBasedRoute;
