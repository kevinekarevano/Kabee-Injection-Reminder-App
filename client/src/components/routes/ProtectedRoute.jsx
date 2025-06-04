import { Navigate } from "react-router";
import useAppStore from "@/stores/useAppStore";
import Loader from "../ui/loader";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isAuthChecked } = useAppStore();

  if (!isAuthChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#232E30" }}>
        <Loader className={"w-100"} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
