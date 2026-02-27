import React from "react";

export default function StoreCard({ store }) {

  const handleGetDirection = () => {
    const encodedAddress = encodeURIComponent(store.address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    
    <div className="store-card">
      <h3>{store.name}</h3>

      <p className="address">📍 {store.address}</p>

      <div className="meta">
        <span>⏰ {store.time}</span>
        <span className={`status ${store.status === "Open" ? "open" : "closed"}`}>
          {store.status}
        </span>
        <span>📞 {store.phone}</span>
      </div>

      <div className="actions">
        <button className="primary" onClick={handleGetDirection}>
          Get Direction
        </button>
        <button className="outline">
          View Details
        </button>
      </div>
    </div>
  );
}
