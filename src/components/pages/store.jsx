import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./StoreLocator.css";

export default function StoreLocator() {
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "storesection", "HgTJ0ZlGDbGltrRzsP66"); // document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroImage(data.image);
        } else {
          console.log("No such document in Firestore!");
        }
      } catch (err) {
        console.error("Error fetching Firestore document:", err);
      }
    };

    fetchHeroData();
  }, []);

  /* ================= SCROLL ANIMATION ================= */
  useEffect(() => {
    const onScroll = () => {
      document.querySelectorAll(".scroll-hide").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
          el.classList.add("scroll-show"); // scroll ma visible thay te
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // initial check

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Open your specific map link
  const openMap = () => {
    const url = "https://www.google.com/maps/place/Rivaaj+The+Fabric+Shop/data=!4m2!3m1!1s0x0:0x20b4e90f9d38f9d0?sa=X&ved=1t:2428&ictx=111";
    window.open(url, "_blank");
  };

  return (
    <div className="store-locator">
      <header
        className="hero-section-store scroll-hide"
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-content-store">
          <h1>Find Your Rivaaj Store</h1>
          <p>
            Explore premium menswear, tailoring & wedding collections across India.
          </p>

          <button className="hero-btn-store" onClick={openMap}>
            Find Store
          </button>
        </div>
      </header>
    </div>
  );
}
