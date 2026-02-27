import React, { useEffect, useState } from "react";
import HomeSection from "./homesection";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./home.css";

export default function Home() {
  const [hero, setHero] = useState(""); 
  const [whyImages, setWhyImages] = useState([]); 
  const [workImages, setWorkImages] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [showTopBtn, setShowTopBtn] = useState(false);

  /* 🚀 2. SCROLL EFFECTS (Intersection Observer & Back to Top) */
  useEffect(() => {
    // Intersection Observer for scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-show");
          }
        });
      },
      { threshold: 0.1 } //screen par element 10% dekhase aetle trigger dekhava lagse 
    );

    // Initial observer target check
    const elements = document.querySelectorAll(".scroll-hide");
    elements.forEach((el) => observer.observe(el));

    // Handle Scroll for "Back to Top" button
    const handleScroll = () => {
      if (window.scrollY > 400) setShowTopBtn(true);
      else setShowTopBtn(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]); // Elements load thay pachi observer trigger thase

  /* 🔥 3. FETCH IMAGES FROM FIREBASE */
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [homeSnap, heroSnap] = await Promise.all([
          getDocs(collection(db, "homeImages")), 
          getDocs(collection(db, "hero")), 
        ]);

        const homeData = homeSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const heroData = heroSnap.docs
          .map(doc => doc.data())
          .find(item => item.type === "hero");

        setHero(heroData?.image || ""); 
        setWhyImages(homeData.filter(item => item.type === "why" && item.image)); 
        setWorkImages(homeData.filter(item => item.type === "works" && item.image)); 
      } catch (error) {
        console.error("Firebase fetch error:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchImages();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading Rivaaj Experience...</p>
      </div>
    );
  }

  return (
    <>
      {/* BACK TO TOP BUTTON */}
      <button 
        className={`back-to-top ${showTopBtn ? "show" : ""}`} 
        onClick={scrollToTop}
        title="Go to top"
      >
        ↑
      </button>

      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="hero-overlay"></div>

        <div className="hero-content scroll-hide">
          <span className="hero-tagline">Premium Fabric & Formal Wear</span>

          <h1 className="hero-title">
            Rivaaj <br />
            <span>The Fabric Shop</span>
          </h1>

          <p className="hero-desc">
            Explore timeless fabrics, crafted for elegance & comfort.
          </p>

          <a href="/Collections" className="hero-btn">
            Shop Collection
          </a>
        </div>
      </section>

      <HomeSection />

      {/* WHY CHOOSE US */}
      <section className="why-wrapper scroll-hide">
        <div className="why-container scroll-hide">
          <span className="badge">Why Choose Us</span>
          <h2>Why Choose Us</h2>

          <p className="subtitle scroll-hide">
            Formal fabrics are the silent architects of confidence, shaping every
            moment with elegance and precision.
          </p>

          <div className="card-grid">
            {whyImages.map(item => (
              <div className="why-card scroll-hide" key={item.id}>
                <img
                  src={item.image}
                  alt={`Reason ${item.id}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKS SECTION - PREMIUM AUTO SLIDER */}
      <section className="works-section scroll-hide">
        <div className="works-header">
          <span className="gold-dash"></span>
          <h1 className="works-title">Our Masterpieces</h1>
          <span className="gold-dash"></span>
        </div>

        <div className="slider-container">
          <div className="slider-track">
            {[...workImages, ...workImages].map((item, index) => (
              <div className="slide" key={index}>
                <div className="slide-inner">
                  <img
                    src={item.image}
                    alt={`Work ${index}`}
                    className="work-img-slider"
                    loading="lazy"
                  />
                  <div className="slide-overlay">
                    <span>RIVAAJ EXCLUSIVE</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}