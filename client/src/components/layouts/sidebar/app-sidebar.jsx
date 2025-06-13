import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { NavLink, useNavigate } from "react-router";
import { CircleUserRound, Home, UserPlus, Grid2x2Plus, Syringe, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import useAppStore from "@/stores/useAppStore";
import axios from "axios";
import { toast } from "react-toastify";

// Definisikan struktur menu sidebar
const sidebarMenus = [
  {
    label: "Home",
    icon: <Home size={20} />,
    to: "/dashboard",
  },
  {
    label: "User Management",
    subMenu: [
      {
        label: "Data Users",
        icon: <CircleUserRound size={17} />,
        to: "/dashboard/users",
      },
      {
        label: "Create User",
        icon: <UserPlus size={17} />,
        to: "/dashboard/create-user",
      },
      {
        label: "Data Entry",
        icon: <Grid2x2Plus size={17} />,
        to: "/dashboard/users/data-entry",
      },
      {
        label: "Pending Injection",
        icon: <Syringe size={17} />,
        to: "/dashboard/users/pending-injection",
      },
    ],
  },
  {
    label: "Report Management",
    subMenu: [
      {
        label: "Data Report",
        icon: <Printer size={17} />,
        to: "/dashboard/users/data-report",
      },
    ],
  },
];

export function AppSidebar() {
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
    <Sidebar className="text-zinc-300 border-zinc-800 ">
      <SidebarContent className="bg-[#2E3B3D] p-5">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMenus.map((menu) =>
                menu.subMenu ? (
                  <SidebarMenuItem key={menu.label}>
                    <SidebarMenuSubButton className="!text-zinc-300 hover:bg-transparent">
                      <span>{menu.label}</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSub>
                      {menu.subMenu.map((sub) => (
                        <SidebarMenuSubItem key={sub.label}>
                          <NavLink
                            to={sub.to}
                            end
                            className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 text-sm ${isActive ? "bg-[#1F2728] text-white font-semibold" : "hover:bg-[#3a4b4d] !text-zinc-200"}`}
                          >
                            {sub.icon}
                            <span>{sub.label}</span>
                          </NavLink>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={menu.label}>
                    <NavLink
                      to={menu.to}
                      end
                      className={({ isActive }) => `flex items-center gap-2 px-2 py-2 rounded-md transition-all duration-300 text-sm ${isActive ? "bg-[#1F2728] text-white font-semibold" : "hover:bg-[#3a4b4d] !text-zinc-200"}`}
                    >
                      {menu.icon}
                      <span>{menu.label}</span>
                    </NavLink>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#2E3B3D] p-5">
        <Button className={"cursor-pointer bg-red-800 hover:bg-red-700"} onClick={handleLogout}>
          Logout
          <LogOut size={17} />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
