import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./OccasionSection.css";

export default function JHamstedSection() {
  const [jHampstead, setJHampstead] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const scrollRef = useRef(null); // Horizontal scroll control


  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "JHamstedSection"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);

        setJHampstead(querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          material: doc.data().material || "Superfine Wool Rich",
          origin: doc.data().origin || "Italian Heritage Design",
          description: doc.data().description || "Tailored for the modern leader. Experience the finesse of world-class suiting."
        })));
      } catch (error) {
        console.error("Error fetching J.Hampstead:", error);
      }
    };
    fetchData();
  }, []);

  // Modal open hone par background scroll lock
  useEffect(() => {
    document.body.style.overflow = activeId ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [activeId]);

 
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
        <span className="edition-tag">Elite Executive Wear</span>
        <h1 className="boutique-title">J.Hampstead World</h1>
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
        {jHampstead.map((item) => (
          <div
            key={item.id}
            className={`boutique-item ${activeId === item.id ? "spotlight" : ""}`}
            onClick={() => setActiveId(activeId === item.id ? null : item.id)}
          >
            <div className="image-wrap">
              <img src={item.img || item.image} alt={item.title} />
              <div className="item-meta">
                <span className="cat-label">International Suiting</span>
                <h3>{item.title}</h3>
              </div>
            </div>

            {/* Premium Spotlight Detail Panel */}
            {activeId === item.id && (
              <div className="passport-panel" onClick={(e) => e.stopPropagation()}>
                <div className="passport-inner">
                  <div className="passport-header">
                    <p className="origin">{item.origin}</p>
                    <button className="close-btn" onClick={() => setActiveId(null)}>CLOSE</button>
                  </div>

                  <h2 className="passport-title">{item.title}</h2>
                  <p className="passport-desc">{item.description}</p>

                  <div className="luxury-specs">
                    <div className="spec-box">
                      <small>FABRIC COMPOSITION</small>
                      <p>{item.material}</p>
                    </div>
                    <div className="spec-box">
                      <small>STYLE</small>
                      <p>Corporate / Formal</p>
                    </div>
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