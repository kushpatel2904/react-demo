import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./OccasionSection.css";

export default function SiyaramSection() {
  const [siyaram, setsiyaram] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const scrollRef = useRef(null); // Slider control ke liye

  useEffect(() => {
    const fetchSiyaram = async () => {
      try {
        const q = query(collection(db, "siyaram"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        setsiyaram(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSiyaram();
  }, []);

  // Scroll Functions
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left"
        ? scrollLeft - clientWidth / 1.5
        : scrollLeft + clientWidth / 1.5;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };





  return (
    <div className={`boutique-wrapper ${activeId ? "is-focus" : ""}`}>
      <div className="luxury-header">
        <span className="edition-tag">2026 Edition</span>
        <h1 className="boutique-title">Siyaram’s Heritage</h1>
      </div>

      <div className="slider-controls">
  {/* Left Arrow */}
  <button className="nav-btn left" onClick={() => scroll("left")}>
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
    </svg>
  </button>

  {/* Right Arrow */}
  <button className="nav-btn right" onClick={() => scroll("right")}>
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
    </svg>
  </button>
</div>

      {/* Horizontal Scroll Container */}
      <div className="boutique-scroll-container" ref={scrollRef}>
        {siyaram.map((item) => (
          <div
            key={item.id}
            className={`boutique-item ${activeId === item.id ? "spotlight" : ""}`}
            onClick={() => setActiveId(activeId === item.id ? null : item.id)}
          >
            <div className="image-wrap">
              <img src={item.image} alt={item.title} />
              <div className="item-meta">
                <span className="cat-label">Fine Fabric</span>
                <h3>{item.title}</h3>
              </div>
            </div>

            {activeId === item.id && (
              <div className="passport-panel" onClick={(e) => e.stopPropagation()}>
                <div className="passport-inner">
                  <div className="passport-header">
                    <p className="origin">Crafted in India</p>
                    <button className="close-btn" onClick={() => setActiveId(null)}>CLOSE</button>
                  </div>
                  <h2 className="passport-title">{item.title}</h2>
                  <p className="passport-desc">{item.description || "An exquisite blend of tradition and modernity."}</p>
                  <div className="luxury-specs">
                    <div className="spec-box">
                      <small>SENSORIAL</small>
                      <p>{item.fabricType || "Soft-Touch Finish"}</p>
                    </div>
                    <div className="spec-box">
                      <small>STRUCTURE</small>
                      <p>{item.pattern || "Refined Weave"}</p>
                    </div>
                  </div>
                  <div className="action-row">
                    </div>
                  </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>

  );
}