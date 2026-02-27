import { Routes, Route } from "react-router-dom";

import MainLayout from "./Layouts/Mainlayout";
import DashboardLayout from "./Layouts/Dashboardlayout";


import Home from "./components/pages/home";
import Siyaram from "./components/pages/siyaram";
import JHamsted from "./components/pages/jhamsted";
import Linen from "./components/pages/linen";
import Arvind from "./components/pages/arvind";
import Raymond from "./components/pages/raymond";
import ReidTaylor from "./components/pages/ReidTaylor";
import Filters from "./components/pages/collections";
import ProductDetails from "./components/pages/productdetails";
import AboutUs from "./components/pages/Aboutus";
import Store from "./components/pages/store";

import Dashboard from "./dashboard/dashboard";

function App() {
  return (
    <Routes>

      {/* WEBSITE ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/brand/siyaram" element={<Siyaram />} />
        <Route path="/brand/jhamsted" element={<JHamsted />} />
        <Route path="/brand/linen" element={<Linen />} />
        <Route path="/brand/arvind" element={<Arvind />} />
        <Route path="/brand/raymond" element={<Raymond />} />
        <Route path="/brand/reidtaylor" element={<ReidTaylor />} />
        <Route path="/collections" element={<Filters />} />
        <Route path="/collection/:brand" element={<ProductDetails />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/store" element={<Store />} />
      </Route>

     
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
      </Route>

    </Routes>
  );
}

export default App;
