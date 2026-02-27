import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/home";
import Siyaram from "./components/pages/siyaram";
import JHamsted from "./components/pages/jhamsted";
import Linen from "./components/pages/linen";
import Arvind from "./components/pages/arvind";
import Raymond from "./components/pages/raymond";
import ReidTaylor from "./components/pages/ReidTaylor";
import Filters from "./components/pages/collections"; // tumhara existing component
import ProductDetails from "./components/pages/productdetails";
import AboutUs from "./components/pages/Aboutus";
import Store from "./components/pages/store"
import Navbar from "./components/navbar"; 
import Footer from "./components/pages/footer";




function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Brand/siyaram" element={<Siyaram />} />
        <Route path="/Brand/JHamsted" element={<JHamsted />} />
        <Route path="/Brand/Linen" element={<Linen />} />
        <Route path="/Brand/Arvind" element={<Arvind />} />
        <Route path="/Brand/Raymond" element={<Raymond />} />
        <Route path="/Brand/ReidTaylor" element={<ReidTaylor />} />
        <Route path="/collections" element={<Filters />} />
        <Route path="/collection/:brand" element={<ProductDetails />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/Store" element={<Store />} />
        <Route path="/Footer" element={<Footer />} />
      </Routes>
    </>
  );
}

export default App;
