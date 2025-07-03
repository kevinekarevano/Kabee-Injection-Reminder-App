import { Outlet } from "react-router";
import Navbar from "../navbar/UserNavbar";
import Footer from "../footer";
import Announcement from "../confirmedButton";

const RootLayout = () => {
  return (
    <>
      <Announcement />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
