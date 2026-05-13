import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";
import { Outlet } from "react-router";
import Footer from "../footer";
import DashboardNavbar from "../navbar/DashboardNavbar";
import CustomTrigger from "./sidebar/customTrigger";

export default function Layout() {
  return (
    <>
      <SidebarProvider className="min-h-screen overflow-x-hidden bg-[#f7f4ec] font-poppins text-[#24302b]">
        <AppSidebar />
        <main className="w-full max-w-full overflow-auto bg-[#f7f4ec]">
          <DashboardNavbar />

          <CustomTrigger />

          <div className="mx-auto w-full max-w-7xl px-5 pb-12 pt-2 md:px-8">
            <Outlet />
          </div>

          <Footer />
        </main>
      </SidebarProvider>
    </>
  );
}
