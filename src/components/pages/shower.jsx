import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs , query , orderBy} from "firebase/firestore";
import "./shower.css";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [active, setActive] = useState(null);

 // 🔹 Fetch data from Firebase (Ordered)
useEffect(() => {
  const fetchCollections = async () => {
    try {
      const q = query(
        collection(db, "collections"),
        orderBy("order", "asc")   // 👈 yaha se order control hoga
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCollections(data);

      if (data.length > 0) {
        setActive(data[0]);
      }

    } catch (err) {
      console.error("Firebase Error:", err);
    }
  };

  fetchCollections();
}, []);

  // 🔹 Scroll animation
  useEffect(() => {
    const onScroll = () => {
      document.querySelectorAll(".scroll-hide").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
          el.classList.add("scroll-show");
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!active) return <p>Loading...</p>;

  return (
    <div className="collections-wrapper scroll-hide">

      {/* LEFT – THUMBNAILS */}
      <div className="collections-left scroll-hide">
        <h2>COLLECTION</h2>

        {collections.map(item => (
          <div
            key={item.id}
            className={`collection-item ${active.id === item.id ? "active" : ""
              }`}
            onClick={() => setActive(item)}
          >
            <img src={item.thumb || item.image} alt={item.name} />
            <span>{item.title}</span>
          </div>
        ))}
      </div>

      {/* RIGHT – MAIN IMAGE + TITLE */}
      <div className="collections-right scroll-hide">
        <h3 className="collection-title">{active.name}</h3>

        <img
          src={active.image}
          alt={active.name}
        />
      </div>
    </div>
  );
}
