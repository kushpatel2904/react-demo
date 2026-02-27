import React from "react";
import Collection from "./collection";
import { Link } from "react-router-dom";

export default function Products() {
  return (
    <div
      className="collections-container"
      id="collections"
      style={{ marginTop: "20px" }}
    >
      {Collection.map((col, id) => (
        <div className="collection-card" key={id}>
          <img src={col.image} alt={col.title} />

          <div className="overlay">
            <h2>{col.title}</h2>

            <Link className="hero-btn">
              Shop Now
            </Link>
          </div>
        </div>
      ))}
    </div>

  );
}
