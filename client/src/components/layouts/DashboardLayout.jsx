import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";
import { Outlet } from "react-router";
import DashboardNavbar from "../navbar/DashboardNavbar";
import CustomTrigger from "./sidebar/customTrigger";

export default function Layout() {
  return (
    <>
      <SidebarProvider className="bg-[#232E30]  overflow-x-hidden font-poppins ">
        <AppSidebar />
        <main className="w-full max-w-full overflow-auto">
          <DashboardNavbar />

          <CustomTrigger />

          <div className="p-5  mb-50">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
