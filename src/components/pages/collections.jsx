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
        const collectionNames = Array.from(
          { length: 66 },
          (_, i) => (i + 1).toString()
        );

        const promises = collectionNames.map((name) =>
          getDocs(collection(db, name))
        );

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
        console.log("Error aavyo:", err);
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

  // ✅ Filter logic (multi select)
  const filteredData =
    selectedBrands.length === 0
      ? data
      : data.filter((item) =>
        selectedBrands.includes(item.brand)
      );

  return (
    <div className="collections1-wrapper">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="collections-layout">

          {/* Sidebar Filters */}
          <div className="sidebar-1">
            <h3>Categories</h3>

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