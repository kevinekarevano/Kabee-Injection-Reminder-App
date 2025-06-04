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
    <nav className="p-5 bg-[#B8E3E9]">
      <div className="flex justify-between items-center">
        <Link to={"/"}>
          <img className="w-28" src="/logo.svg" alt="kabee_logo" />
        </Link>

        <div onClick={handleLogout} className="bg-red-900 group cursor-pointer transition-all duration-300 hover:text hover:bg-red-800 md:hover:px-6 hover:px-4 rounded-full px-3 md:px-5 py-1 flex  gap-2 items-center justify-center    border-2 border-zinc-800 ">
          <p className="font-poppins text-lg  duration-500 tracking-wide text-zinc-300 group-hover:text-zinc-100 ">Logout</p>
          <LogOut fontWeight={20} className="text-zinc-300  duration-500  group-hover:text-zinc-100" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
