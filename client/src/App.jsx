import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import useAppStore from "./stores/useAppStore";
import { useEffect } from "react";

const App = () => {
  const getAuthState = useAppStore((state) => state.getAuthState);

  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
