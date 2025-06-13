import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";
import { Outlet } from "react-router";
import DashboardNavbar from "../navbar/DashboardNavbar";
import CustomTrigger from "./sidebar/customTrigger";

export default function Layout() {
  return (
    <>
      <SidebarProvider className="bg-[#232E30] font-poppins ">
        <AppSidebar />
        <main className="w-full">
          <DashboardNavbar />

          <CustomTrigger />

          <div className="p-5">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
