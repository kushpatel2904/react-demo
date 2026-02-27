import React, { useEffect, useState } from 'react';

const Data = [
  { id: 1, name:"iPhon17 pro", Storage: "256 GB, 512 GB, and 1 TB", Processor:"A19 Pro chip with 6-core CPU and 6-core GPU" },
  { id: 2, name:"Samsung S24", Storage:"128GB, 256GB (UFS 4.0 for 256GB+, UFS 3.1 for 128GB)", Processor:"Octa-core (Exynos 2400 or Snapdragon 8 Gen 3 for Galaxy)" },
  { id: 3, name:"Samsung S25 Ultra", Battery:"5000mAh, RAM 12GB, Storage 256GB/512GB/1TB", color:"Titanium Silver, Gray, Black, Whitesilver" },
  { id: 4, name:"iPhone 16", color:"Design and Durability: Aluminum design with Ceramic Shield front", Connectivity:"5G and Wi-Fi 7, USB-C, MagSafe wireless charging" },
  { id: 5, name:"OnePlus 12", Battery: "5400mAh, RAM: 12/16GB, Storage: 256/512GB", Processor:"Octa-core (Exynos 2400 or Snapdragon 8 Gen 3 for Galaxy)" },
  { id: 6, name:"Samsung S23 Ultra", Battery:"5000mAh, RAM 12GB, Storage 256GB/512GB/1TB", color:"Titanium Silver, Gray, Black, Whitesilver" },
  { id: 7, name:"iQOO", Storage: "8GB/256GB, 12GB/256GB, 16GB/512GB", Connectivity:"5G and Wi-Fi 7, USB-C, MagSafe wireless charging" },
  { id: 8, name:"laptop", Battery: "5400mAh, RAM: 12/16GB, Storage: 256/512GB", Processor:"Octa-core (Exynos 2400 or Snapdragon 8 Gen 3 for Galaxy)" },
  { id: 9, name:"computer", Battery:"5000mAh, RAM 12GB, Storage 256GB/512GB/1TB", color:"Titanium Silver, Gray, Black, Whitesilver" },
];

function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(Data); 
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading products...</h2>;
  }

  const listStyle = { listStyle: "none", padding: 0 };

  const getProductStyle = () => {
    return {
      margin: "10px",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    };
  };

  
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Products List</h2>
      <ul style={listStyle}>
        {products.map((product) => (
          <li key={product.id} style={getProductStyle()}>
            <strong>{product.name}</strong><br />
            Storage: {product.Storage } <br />
            Battery: {product.Battery } <br />
            Processor: {product.Processor } <br />
            Connectivity: {product.Connectivity} <br />
            Color: {product.color }
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Products;
