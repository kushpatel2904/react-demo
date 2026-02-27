import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./OccasionSection.css";

export default function HomeSection() {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const q = query(collection(db, "occasions"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        setOccasions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Firebase Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOccasions();
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


  if (loading) return <div className="loader">Loading Heritage Brands...</div>;

  return (
    <div className={`boutique-wrapper  ${activeId ? "is-focus" : ""}`}>
      <div className="luxury-header">
        <span className="edition-tag">Curated Collections</span>
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
        {occasions.map((item) => (
          <div
            key={item.id}
            className={`boutique-item ${activeId === item.id ? "spotlight" : ""}`}
            onClick={() => setActiveId(activeId === item.id ? null : item.id)}
          >
            <div className="image-wrap">
              <img src={item.image} alt={item.title} />
              <div className="item-meta">
                <span className="cat-label">Premium Choice</span>
                <h3>{item.title}</h3>
              </div>
            </div>

            {/* Passport Modal */}
            {activeId === item.id && (
              <div className="passport-panel" onClick={(e) => e.stopPropagation()}>
                <div className="passport-inner">
                  <div className="passport-header">
                    <p className="origin">Authentic Series</p>
                    <button className="close-btn" onClick={() => setActiveId(null)}>CLOSE</button>
                  </div>

                  <h2 className="passport-title">{item.title}</h2>
                  <p className="passport-desc">{item.description || "Discover the finest threads crafted for perfection."}</p>

                  <div className="luxury-specs">
                    <div className="spec-box">
                      <small>AVAILABILITY</small>
                      <p>In-Store Only</p>
                    </div>
                  </div>

                  <div className="action-row">
                    <Link to={item.link} className="reserve-btn-link" onClick={(e) => e.stopPropagation()}>
                      <button className="reserve-btn">GO TO BRAND PAGE</button>
                    </Link>
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