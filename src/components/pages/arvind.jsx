import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import ArvindSection from "./arvindsection";
import Arvindbook from "./arvindbook"
import "./arvind.css";

export default function Arvind() {
  const [current, setCurrent] = useState(0); // slider current index
  const [arvindhero, setarvindhero] = useState(""); // hero image
  const [sliderImages, setSliderImages] = useState([]); // slider images list
  const [suitingImg, setSuitingImg] = useState(""); // suiting image
  const [shirtingImg, setShirtingImg] = useState(""); // shirting image
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
      { threshold: 0.1 }
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

  /* ================= FETCH ALL DATA USING PROMISE.ALL ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const sliderQuery = query(
          collection(db, "ArvindSlider"),
          orderBy("order", "asc")
        );

        // Promise.all thi hero, slider, sections simultaneously fetch thay
        const [heroSnap, sliderSnap, sectionsSnap] = await Promise.all([
          getDocs(collection(db, "arvindhero")),
          getDocs(sliderQuery),
          getDocs(collection(db, "ArvindSections")),
        ]);

        // Hero image
        const heroData = heroSnap.docs
          .map(doc => doc.data())
          .find(item => item.type === "hero");
        setarvindhero(heroData?.image || "");

        // Slider images
        const imgs = sliderSnap.docs.map(doc => doc.data().image);
        setSliderImages(imgs);

        // Sections images
        sectionsSnap.forEach(doc => {
          const data = doc.data();
          if (data.type === "suiting") setSuitingImg(data.image);
          if (data.type === "shirting") setShirtingImg(data.image);
        });

        console.log("Arvind data fetched:", { hero: heroData?.image, slider: imgs });
      } catch (err) {
        console.error("Arvind fetch error:", err);
      }finally {
        setLoading(false); 
      }
    };

    fetchAll();
  }, []);

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (sliderImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

    
  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="fabric-loader"></div>
        <p>Loading....</p>
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


      {/* Hero Section */}
      <section
        className="hero-section-arvind scroll-hide"
        style={{
          backgroundImage: `url(${arvindhero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay scroll-hide"></div>
        <h1 className="hero-title-arvind scroll-hide">
          ARVIND, A LEGACY OF PREMIUM FABRICS SHAPING TOMORROW meaning in hindi
        </h1>
      </section>

      <div className="paragraph-contect scroll-hide">
        <p className="content scroll-hide">“ARVIND, DESIGNED FOR CONFIDENCE”</p>
      </div>

      {/* Shirting Section */}
      <div className="image-text-container scroll-hide">
        <div className="arvind-image">
          {shirtingImg && <img src={shirtingImg} alt="Siyaram Shirting" loading="lazy" />} {/* lazy load */}
        </div>
        <div>
          <h1 className="h1">ARVIND, FABRICS FOR THE MODERN WORLD</h1>
          <div className="arvind-text scroll-hide">
            <h5 className="h5">
              Arvind Limited is one of India’s largest textile manufacturers, producing millions of meters of woven fabric every year. They supply high‑quality materials used for formal shirts, trousers, suits, and more across global markets
            </h5>
            <h5 className="h5">
              soft, breathable, classic look, ideal for formal shirts. Poly‑Cotton or Polyester‑Viscose Blends – more crease resistance, shape retention, low‑maintenance and good for everyday office shirts
            </h5>
            <h6 className="h6">
              Arvind Limited, a pioneer in the Indian textile industry, has been shaping premium fabrics since 1931. Known for its expertise in weaving and finishing, Arvind produces a wide range of high-quality fabrics suitable for formal wear, including 100% cotton, cotton-polyester blends, and premium high-count yarns.
            </h6>
          </div>
        </div>
      </div>

      {/* Suiting Section */}
      <div className="arvindsuiting-section scroll-hide">
        <div className="arvindsuiting-text scroll-hide">
          <h1>ARVIND, STYLE THAT SPEAKS SUCCESS</h1>
          <div className="paragraph-contect scroll-hide">
            <h5 className="h5">
              Natural, breathable, and soft — ideal for all‑day formal shirts. Often available in plain, stripe, or fine check patterns. Excellent moisture absorption and comfort
            </h5>
            <h6 className="h6">
              Combines cotton with synthetic fibers for low wrinkles, easy care, and durability. Great for professionals who need crisp looks with minimal ironing. Available in solid, check, or patterned finishes.
            </h6>
            <h6 className="h6">
              Arvind’s formal shirt fabrics are widely used to make shirts intended for daily office use, business meetings, and corporate uniforms. These fabrics offer a neat, professional appearance while remaining comfortable for long work hours
            </h6>
          </div>
        </div>
        <div className="arvindsuiting-image scroll-hide">
          {suitingImg && <img src={suitingImg} alt="Siyaram Suiting" loading="lazy" />}
        </div>
      </div>

      <ArvindSection /> {/* memoize if heavy */}

      {/* Slider Section */}
      <section className="video-section scroll-hide">
        <h2 className="video-section scroll-hide">Our Fabric</h2>
        <div className="hero-container2 scroll-hide">
          <div
            className="hero-slider scroll-hide"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {sliderImages.map((img, id) => (
              <div className="hero-image scroll-hide" key={id}>
                <img src={img} alt={`slide-${id}`} loading="lazy" /> {/* lazy load */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values scroll-hide">
        <h2>Our Core Values</h2>
        <div className="values-cards scroll-hide">
          <div className="value-card scroll-hide">
            <h3>Quality</h3>
            <p>Only the finest fabrics, no compromises.</p>
          </div>
          <div className="value-card scroll-hide">
            <h3>Trust</h3>
            <p>Long-lasting relationships with customers.</p>
          </div>
          <div className="value-card scroll-hide">
            <h3>Innovation</h3>
            <p>Modern designs with classic elegance.</p>
          </div>
        </div>
      </section>
      <Arvindbook />
    </>
  );
}
