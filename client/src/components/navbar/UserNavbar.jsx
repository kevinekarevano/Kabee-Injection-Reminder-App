import { LogOut } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAppStore from "@/stores/useAppStore";

const Navbar = () => {
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);
  const setUserData = useAppStore((state) => state.setUserData);
  const navigate = useNavigate();

  const handleLogout = async () => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/auth/login");
        toast.success("👋 You have logged out successfully", {
          icon: false,
        });
      } else {
        toast.warning(`🥲 ${data.message}`, {
          icon: false,
        });
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-[#dde4db] bg-[#fbf8f1]/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 md:px-8 md:py-4">
        <Link to={"/user"} className="inline-flex items-center gap-3 transition hover:opacity-90">
          <img className="w-24 md:w-28" src="/logo.svg" alt="kabee_logo" />
          
        </Link>

        <div
          onClick={handleLogout}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#f1d9d9] bg-white px-4 py-2 text-[#7D1315] shadow-[0_10px_20px_rgba(34,53,48,0.04)] transition hover:border-[#e7c1c1] hover:bg-[#fff7f7]"
        >
          <p className="font-poppins text-sm font-semibold tracking-wide">Logout</p>
          <LogOut className="duration-500 group-hover:translate-x-0.5" size={18} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
