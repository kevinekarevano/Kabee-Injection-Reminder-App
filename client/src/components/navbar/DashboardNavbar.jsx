import { Link, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAppStore from "@/stores/useAppStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const DashboardNavbar = () => {
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);
  const userData = useAppStore((state) => state.userData);
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
    <nav className="sticky top-0 z-30 flex h-[10vh] w-full items-center justify-between gap-4 border-b border-[#dde4db]/80 bg-[#fbf8f1]/90 px-5 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-1 text-[#24302b] md:gap-3">
        <Link to={"/dashboard"}>
          <img className="w-13 md:w-20" src="/logo.svg" alt="kabee_logo" />
        </Link>
        <p className="text-2xl font-thin text-[#72827a] md:text-3xl">|</p>
        <p className="text-sm font-medium md:text-lg">Dashboard</p>
      </div>

      <div className="flex items-center gap-2 text-[#24302b]">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-11 h-11 hover:scale-105 transition-all duration-500 cursor-pointer ease-in-out">
              <AvatarImage className={"object-cover"} src={userData?.avatar} />
              <AvatarFallback className={"font-poppins font-bold text-lg text-white bg-[#2f7c6d]"}>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border border-[#dde4db] bg-white shadow-[0_18px_40px_rgba(34,53,48,0.08)]">
            <DropdownMenuLabel className={"text-[#24302b]"}>{userData?.username}</DropdownMenuLabel>
            <DropdownMenuSeparator className={"bg-[#dde4db]"} />
            <DropdownMenuItem onClick={handleLogout} className={"cursor-pointer font-semibold text-[#c34a39]"}>
              Logout <LogOut className="font-semibold text-[#c34a39]" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <p className="hidden text-[#5d6f69] md:block">
          Welcome, {userData?.username} <span className="text-lg">👋</span>
        </p>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
