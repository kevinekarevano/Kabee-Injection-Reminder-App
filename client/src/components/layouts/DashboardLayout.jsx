import { Outlet, NavLink } from "react-router";
import Navbar from "../navbar/DashboardNavbar";
import { Home, CircleUserRound, UserPlus, PanelRightClose } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "users",
    icon: CircleUserRound,
  },
  {
    title: "Create User",
    url: "create-user",
    icon: UserPlus,
  },
];

const DashboardLayout = () => {
  return (
    <div className=" font-poppins">
      <Navbar />
      <div className=" h-[90vh] w-full flex">
        <aside className="bg-[#2E3B3D] hidden lg:block  p-5 text-zinc-300  w-1/6">
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.url}
              end
              className={({ isActive }) => `flex mt-3  text-sm items-center gap-4 px-2 py-2  rounded-md transition-all duration-500 ${isActive ? "bg-[#1F2728] text-white font-semibold" : "hover:bg-[#3a4b4d]"}`}
            >
              <item.icon size={20} />
              <p>{item.title} </p>
            </NavLink>
          ))}
        </aside>

        <Sheet>
          <SheetTrigger className={"fixed bottom-1/2 shadow-md lg:hidden cursor-pointer border-2 border-zinc-800 -left-1 bg-teal-900 py-3 rounded-r-md px-1"}>
            <PanelRightClose className="text-zinc-200" />
          </SheetTrigger>
          <SheetContent className={"bg-[#2E3B3D] border-zinc-700"} side="left">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center text-white gap-1 ">
                  <img className="w-13 invert-100 contrast-200 " src="/logo.svg" alt="kabee_logo" />

                  <p className="text-lg  font-thin">|</p>
                  <p className="text-base font-medium ">Dashboard</p>
                </div>
              </SheetTitle>
              <SheetDescription className={"text-zinc-300 "}> Kabee - Injection Reminder App </SheetDescription>
            </SheetHeader>
            <aside className=" p-6 text-zinc-300 ">
              {items.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.url}
                  end
                  className={({ isActive }) => `flex mt-3  text-sm items-center gap-4 px-2 py-2  rounded-md transition-all duration-500 ${isActive ? "bg-[#1F2728] text-white font-semibold" : "hover:bg-[#3a4b4d]"}`}
                >
                  <item.icon size={20} />
                  <p>{item.title} </p>
                </NavLink>
              ))}
            </aside>
          </SheetContent>
        </Sheet>

        <main className="bg-[#232E30] overflow-y-scroll h-full w-full p-5 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
