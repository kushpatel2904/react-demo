import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom"; // ✅ Link import karna zaroori hai
import "./collections.css";

export default function ProductDetails() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null); // ✅ Overlay ke liye state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionNames = Array.from({ length: 66 }, (_, i) => (i + 1).toString());
        const promises = collectionNames.map((name) => getDocs(collection(db, name)));
        const snapshots = await Promise.all(promises);

        let allData = [];
        snapshots.forEach((snapshot, index) => {
          const name = collectionNames[index];
          const docs = snapshot.docs.map((doc) => ({
            id: `${name}_${doc.id}`,
            ...doc.data(),
          }));
          allData = [...allData, ...docs];
        });

        setData(allData);
        setLoading(false);
      } catch (err) {
        console.log("Error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ 1. 'brands' ko define kiya
  const brands = [...new Set(data.filter((item) => item.brand).map((item) => item.brand))];

  // ✅ 2. 'handleBrandChange' function add kiya
  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // ✅ 3. 'filteredData' logic add kiya
  const filteredData = selectedBrands.length === 0
    ? data
    : data.filter((item) => selectedBrands.includes(item.brand));

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="collections1-wrapper">
      <div className="collections-layout">

        {/* Sidebar */}
        <div className="sidebar-1">
          <h3>Categories</h3>
          <div className="filter-group">
            {brands.map((brand, idx) => (
              <label key={idx} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="collections-grid">
          {filteredData.map((item) => (
            <div className="collections-card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="overlay">
                <h2>{item.title}</h2>
                <button onClick={() => setActiveProduct(item)}>EXPLORE</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ LUXURY OVERLAY SECTION */}
      {activeProduct && (
        <div className="luxury-overlay">
          <div className="overlay-close" onClick={() => setActiveProduct(null)}>CLOSE ✕</div>

          <div className="overlay-grid">
            <div className="overlay-text-side">
              <span className="gold-text">{activeProduct.brand}</span>
              <h2>{activeProduct.title}</h2>
              <p>Every thread tells a story. We don’t just craft fabric , we weave an emotion.</p>

              <div className="feature-list">
                <div className="f-item"><strong>01.</strong> Premium Quality</div>
                <div className="f-item"><strong>02.</strong> Modern Design</div>
              </div>

              <Link to={`/collection/${activeProduct.brand}`} onClick={() => setActiveProduct(null)}>
                <button className="view-full-btn">VIEW FULL COLLECTION</button>
              </Link>
            </div>

            <div className="overlay-image-side">
              <img src={activeProduct.image} alt={activeProduct.title} />
              <div className="image-caption">{activeProduct.title}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}