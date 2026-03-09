import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./flipbook.css";

export default function Lookbook() {

  const [lookbookPages, setLookbookPages] = useState([]);
  const book = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {

    const fetchLookbook = async () => {

      const q = query(
        collection(db, "arvindLookbook"),
        orderBy("order", "asc")
      );

      const snapshot = await getDocs(q);

      const pages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setLookbookPages(pages);

    };

    fetchLookbook();

  }, []);

  return (

    <div className="lookbook-wrapper">

      <h2 className="lookbook-title">Look Book</h2>

      <div className="lookbook-container">

        <button
          className="lookbook-nav-btn left"
          onClick={() => book.current.pageFlip().flipPrev()}
        >
          ❮
        </button>

        <HTMLFlipBook
          width={isMobile ? 320 : 550}
          height={isMobile ? 450 : 700}
          size={isMobile ? "stretch" : "fixed"}
          minWidth={300}
          maxWidth={900}
          minHeight={400}
          maxHeight={1100}
          showCover={true}
          mobileScrollSupport={true}
          ref={book}
          className="flipbook"
        >

     
{lookbookPages.map((page) => (

<div key={page.id} className="page">

  <img src={page.image} alt="" />

  {page.title && (
    <div className="page-text">
      {/* "LINEN" */}
      <h2>{page.title}</h2>

      {/* The "by" with lines */}
      <div className="subtitle-container">
        <span className="by-text">by</span>
      </div>

      {/* "ARVIND" */}
      <div className="brand-name">{page.subtitle}</div>
    </div>
  )}
</div>



))}

        </HTMLFlipBook>

        <button
          className="lookbook-nav-btn right"
          onClick={() => book.current.pageFlip().flipNext()}
        >
          ❯
        </button>

      </div>

    </div>
  );
}