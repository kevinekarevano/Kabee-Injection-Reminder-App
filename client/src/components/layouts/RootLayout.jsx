import { Outlet } from "react-router";
import Navbar from "../navbar/UserNavbar";
import Footer from "../footer";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
