import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./OccasionSection.css";

export default function RaymondSection() {
  const [raymondData, setRaymondData] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const scrollRef = useRef(null); // Slider control ke liye


  useEffect(() => {
    const fetchRaymond = async () => {
      try {
        const raymondCollection = collection(db, "Raymondsection");
        const q = query(raymondCollection, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          img: doc.data().image,
          threadCount: doc.data().threadCount || "Super 120s",
          origin: doc.data().origin || "Indian Heritage / Fine Australian Wool",
          desc: doc.data().description || "The quintessential choice for the modern gentleman. Raymond Fine Fabrics offer unparalleled drape and elegance."
        }));

        setRaymondData(data);
      } catch (error) {
        console.error("Error fetching Raymond:", error);
      }
    };
    fetchRaymond();
  }, []);

  // Background scroll lock logic
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
        <span className="edition-tag">Since 1925</span>
        <h1 className="boutique-title">Raymond Fine Fabrics</h1>
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
        {raymondData.map((item) => (
          <div
            key={item.id}
            className={`boutique-item ${activeId === item.id ? "spotlight" : ""}`}
            onClick={() => setActiveId(activeId === item.id ? null : item.id)}
          >
            <div className="image-wrap">
              <img src={item.img} alt={item.title} />
              <div className="item-meta">
                <span className="cat-label">The Complete Man</span>
                <h3>{item.title}</h3>
              </div>
            </div>

            {/* Premium Detail Passport Modal */}
            {activeId === item.id && (
              <div className="passport-panel" onClick={(e) => e.stopPropagation()}>
                <div className="passport-inner">
                  <div className="passport-header">
                    <p className="origin">{item.origin}</p>
                    <button className="close-btn" onClick={() => setActiveId(null)}>CLOSE</button>
                  </div>

                  <h2 className="passport-title">{item.title}</h2>
                  <p className="passport-desc">{item.desc}</p>

                  <div className="luxury-specs">
                    <div className="spec-box">
                      <small>THREAD COUNT</small>
                      <p>{item.threadCount}</p>
                    </div>
                    <div className="spec-box">
                      <small>FABRIC TYPE</small>
                      <p>Premium Suiting</p>
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