import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { NavLink, useNavigate } from "react-router";
import { CircleUserRound, Home, UserPlus, Grid2x2Plus, Syringe, Printer, MessageCircleMore, History, FileText } from "lucide-react";
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
        label: "Confirm Injection",
        icon: <Syringe size={17} />,
        to: "/dashboard/users/pending-injection",
      },
    ],
  },
  {
    label: "Chat Management",
    subMenu: [
      {
        label: "Chat",
        icon: <MessageCircleMore size={17} />,
        to: "/dashboard/chat",
      },
      {
        label: "Chat History",
        icon: <History size={17} />,
        to: "/dashboard/chat/history",
      },
    ],
  },
  {
    label: "Articles",
    subMenu: [
      {
        label: "Create Article",
        icon: <FileText size={17} />,
        to: "/dashboard/articles/create",
      },
      {
        label: "Manage Articles",
        icon: <FileText size={17} />,
        to: "/dashboard/articles",
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
    <Sidebar className="border-[#dde4db] text-[#24302b]">
      <SidebarContent className="bg-[#fbf8f1] p-5">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMenus.map((menu) =>
                menu.subMenu ? (
                  <SidebarMenuItem key={menu.label}>
                    <SidebarMenuSubButton className="!text-[#24302b] hover:bg-transparent">
                      <span>{menu.label}</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSub>
                      {menu.subMenu.map((sub) => (
                        <SidebarMenuSubItem key={sub.label}>
                          <NavLink
                            to={sub.to}
                            end
                            className={({ isActive }) =>
                              `flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-300 ${isActive ? "bg-[#edf4ef] font-semibold text-[#2f7c6d]" : "text-[#5d6f69] hover:bg-white hover:text-[#24302b]"}`
                            }
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
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-300 ${isActive ? "bg-[#edf4ef] font-semibold text-[#2f7c6d]" : "text-[#5d6f69] hover:bg-white hover:text-[#24302b]"}`
                      }
                    >
                      {menu.icon}
                      <span>{menu.label}</span>
                    </NavLink>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#fbf8f1] p-5">
        <Button className={"cursor-pointer rounded-full bg-[#c34a39] text-white hover:bg-[#ab3e30]"} onClick={handleLogout}>
          Logout
          <LogOut size={17} />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
