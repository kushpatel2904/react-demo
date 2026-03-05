import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import "./collections.css";

export default function Filters() {
  // ✅ Multiple selected brands store karne ke liye array
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {

        // 🔥 Only ONE collection
        const snapshot = await getDocs(collection(db, "products"));

        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(docs);
        setLoading(false);

      } catch (err) {
        console.log("Firebase error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  // ✅ Unique brands
  const brands = [
    ...new Set(
      data
        .filter((item) => item.brand)
        .map((item) => item.brand)
    ),
  ];

  // ✅ Checkbox toggle function
  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      // Remove brand
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      // Add brand
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

    /* Clear Filters */
    const clearFilters = () => {
      setSelectedBrands([]);
    };

  // ✅ Filter logic (multi select)
  const filteredData =
    selectedBrands.length === 0
      ? data
      : data.filter((item) =>
        selectedBrands.includes(item.brand)
      );

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="fabric-loader"></div>
        <p>Loading....</p>
      </div>
    );
  }
  
  return (
    <div className="collections1-wrapper">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="collections-layout">

          {/* Sidebar Filters */}
          <div className="sidebar-1">
            <h3>Categories</h3>

            {selectedBrands.length > 0 && (
              <button
                className="clear-filter-btn"
                onClick={clearFilters}
              >
              </button>
            )}

            <div className="filter-group">
              {brands.map((brand, idx) => (
                <label key={idx} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  {brand}
                </label>
               
              ))}
            </div>

            {/* Optional Clear Button */}
            {selectedBrands.length > 0 && (
              <button
                className="clear-btn"
                onClick={() => setSelectedBrands([])}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="collections-grid">
            {filteredData.map((item) => (
              <div className="collections-card" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="overlay">
                  <h2>{item.title}</h2>
                  <Link to={`/collection/${item.brand}`}>
                    <button>EXPLORE</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}