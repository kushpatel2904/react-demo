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
  const [showVideo, setShowVideo] = useState(false); // Video Modal State

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


  /* 🔥 FIREBASE DATA FETCH */
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [whySnap, workSnap, heroSnap] = await Promise.all([
          getDocs(collection(db, "why")),
          getDocs(collection(db, "workImages")),
          getDocs(collection(db, "hero")),
        ]);

        /* WHY IMAGES */
        const whyData = whySnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        /* WORK IMAGES */
        const workData = workSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));


        /* HERO IMAGE */
        const heroData = heroSnap.docs
          .map(doc => doc.data())
          .find(item => item.section === "hero");

        setHero(heroData?.image || "");
        setWhyImages(whyData);
        setWorkImages(workData);
      }
      catch (error) {
        console.error("Firebase fetch error:", error);
      }
      finally {
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
      <div className="loader-wrapper">
        <div className="fabric-loader"></div>
        <p>Loading....</p>
      </div>
    );
  }

  // Handle closing modal
  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  return (
    <>
      {/* VIDEO MODAL */}
      <div className={`video-modal ${showVideo ? "show" : ""}`} onClick={handleCloseVideo}>
        <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-video-btn" onClick={handleCloseVideo} aria-label="Close video">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>

          {/* Only render iframe when modal is open to save data/loading */}
          {showVideo && (
            <iframe
              src="https://www.youtube.com/embed/xQSCD5kvNfk?autoplay=1"
              title="Brand Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>

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

          <div className="hero-actions">
            <a href="/Collections" className="hero-btn">
              Shop Collection
            </a>

            <button className="video-btn" onClick={() => setShowVideo(true)}>
              <span className="play-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch Brand Video
            </button>
          </div>
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

            {[...workImages, ...workImages, ...workImages].map((item, index) => (
              <div className="slide" key={index}>
                <div className="slide-inner">
                  <img
                    src={item.image}
                    alt={`Work ${index}`}
                    className="work-img-slider"
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