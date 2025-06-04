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
    <nav className=" h-[10vh] flex justify-between items-center gap-4 px-5 w-full bg-[#364649] ">
      <div className="flex items-center text-white gap-1 md:gap-3">
        <Link to={"/dashboard"}>
          <img className="w-13 md:w-20  invert-100 contrast-200 " src="/logo.svg" alt="kabee_logo" />
        </Link>
        <p className="text-2xl md:text-3xl font-thin">|</p>
        <p className="text-sm md:text-lg">Dashboard</p>
      </div>

      <div className="flex items-center gap-2 text-white">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-11 h-11 hover:scale-105 transition-all duration-500 cursor-pointer ease-in-out">
              <AvatarImage className={"object-cover"} src={userData?.avatar} />
              <AvatarFallback className={"font-poppins font-bold text-lg text-white bg-[#1b3034]"}>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-700">
            <DropdownMenuLabel className={'text-zinc-200'}>{userData?.username}</DropdownMenuLabel>
            <DropdownMenuSeparator className={"bg-zinc-400"} />
            <DropdownMenuItem onClick={handleLogout} className={"cursor-pointer  text-red-500 font-semibold "}>
              Logout <LogOut className="text-red-500 font-semibold" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <p className="hidden md:block">
          Welcome, {userData?.username} <span className="text-lg">👋</span>
        </p>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
