import React, { useState,useEffect,useRef } from "react";
import { collection, getDocs , orderBy , query} from "firebase/firestore";
import { db } from "../../firebase";
import HTMLFlipBook from 'react-pageflip';
import "./flipbook.css"

export default function Lookbook() {
    const [lookbookPages, setLookbookPages] = useState([]); // <--- Yahan define hona chahiye
    const book = useRef();
  
    // ... baaki states ...
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // ... fetching logic ...
          
         // Lookbook fetching update
    const lookbookQuery = query(
    collection(db, "raymondLookbook"), 
    orderBy("order", "asc") // 👈 Order hona zaroori hai
  );
  const lookbookSnap = await getDocs(lookbookQuery);
  setLookbookPages(lookbookSnap.docs.map(doc => doc.data().image));
          
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }, []);
 

  return (
    <section className="lookbook-section scroll-hide">
      <div className="lookbook-header">
        <h2>Look Book</h2>
        <p>Experience the finesse of our premium fabric</p>
      </div>

      <div className="flipbook-wrapper">
        {/* Navigation Buttons */}

        
        <HTMLFlipBook
          ref={book}
          width={420}
          height={560}
          size="stretch"
          minWidth={300}
          maxWidth={520}
          showCover={true}
          drawShadow={true}
          flippingTime={800}
          onTouchStart={(e) => e.stopPropagation()} // prevent page scroll on touch
          onTouchMove={(e) => e.stopPropagation()}
          className="flipbook-container"
        >
          {lookbookPages.map((img, index) => (
            <div className="page" key={index}>
              <div className="page-image">
                <img src={img} alt={`img ${index}`} />
                <div className="page-overlay">
                  <div className="overlay-content">
                    <h3>{img.title || "RIVAAJ"}</h3>
                    <p>{img.subtitle || "Premium Series"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </HTMLFlipBook>

      </div>
    </section>
  );
}