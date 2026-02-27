import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/pages/footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
