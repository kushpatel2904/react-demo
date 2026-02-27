import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import OccasionSection from "./OccasionSection";
import "./siyaram.css";

export default function Siyaram() {
  /* ================= STATE ================= */
  const [current, setCurrent] = useState(0); // slider ma current index
  const [heroImage, setHeroImage] = useState(""); // hero image URL
  const [sliderImages, setSliderImages] = useState([]); // slider images array
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

  /* ================= FETCH ALL DATA PARALLEL ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ================= PROMISE ALL =================
        const heroPromise = getDocs(collection(db, "siyaramhero")); // hero image fetch
        const sliderQuery = query(
          collection(db, "siyaramSlider"),
          orderBy("order", "asc")
        );
        const sliderPromise = getDocs(sliderQuery); // slider images fetch
        const sectionPromise = getDocs(collection(db, "siyaramSections")); // suiting & shirting fetch

        const [heroSnap, sliderSnap, sectionSnap] = await Promise.all([
          heroPromise,
          sliderPromise,
          sectionPromise,
        ]); // parallel fetch

        // ================= HERO IMAGE =================
        const heroData = heroSnap.docs
          .map(doc => doc.data())
          .find(item => item.type === "hero");
        setHeroImage(heroData?.image || "");

        // ================= SLIDER IMAGES =================
        const sliderImgs = sliderSnap.docs.map(doc => doc.data().image);
        setSliderImages(sliderImgs);

        // ================= SUITING / SHIRTING =================
        sectionSnap.forEach(doc => {
          const data = doc.data();
          if (data.type === "suiting") setSuitingImg(data.image);
          if (data.type === "shirting") setShirtingImg(data.image);
        });

      } catch (err) {
        console.error("Siyaram data fetch error:", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (sliderImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % sliderImages.length); // slider rotate
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages]);

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
    onScroll(); // page load ma check

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

      
      {/* ================= HERO SECTION ================= */}
      <section
        className="hero-section-siyaram scroll-hide"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay"></div>
        <h1 className="hero-title-siyaram">
          Siyaram's Suitings And Shirtings
        </h1>
      </section>

      {/* ================= PARAGRAPH ================= */}
      <div className="paragraph-contect scroll-hide">
        <p className="content">
          At Siyaram’s, adorn the passion of excellent clothing
        </p>
      </div>

      {/* ================= SUITING ================= */}
      <div className="image-text-container scroll-hide">
        <div className="container-image">
          {suitingImg && (
            <img src={suitingImg} alt="Siyaram Suiting" loading="lazy" />
          )}
        </div>

        <div className="suiting-text">
          <h1 className="h1">Suiting</h1>
          <h5 className="h5">
            Siyaram's is a leading Indian fabric manufacturer known for its wide range of high-quality,
            innovative suiting and shirting fabrics, offering superior comfort,
            fall, and wrinkle resistance through advanced blends like super fine polyesters,
            cottons, and unique options like bamboo and stretch fabrics for modern style and breathability in both formal and casual wear
          </h5>
          <h6 className="h6">
            They are a trusted brand for custom tailoring,
            providing fabrics for suits,
            trousers, and shirts with options in various materials, colors,
            and patterns for diverse needs, from boardroom to casual settings
          </h6>
          <h6 className="h6">
            Siyaram's suiting fabrics are known for quality, comfort, and style,
            blending traditional craftsmanship with modern innovation,
            using materials like superfine polyester, cotton, linen, and blends for features such as stretch,
            breathability, and wrinkle resistance, suitable for various occasions from formal to casual wear
          </h6>
        </div>
      </div>

      {/* ================= SHIRTING ================= */}
      <div className="suiting-section scroll-hide">
        <div className="shirting-text">
          <h1>Shirting</h1>
          <h5 className="container2-h5">
            Materials & Blends: Siyaram's provides a diverse selection of fabrics, including:
            Natural: 100% cotton (including Giza cotton and superfine cotton), 100% linen, and cotton-linen blends.
            Blends: Popular options include polyester-viscose (PV), poly-cotton (PC), and poly-bamboo blends.
            Specialty: They also offer fabrics made with bamboo fibers, which are known for their softness, moisture management, and eco-friendly properties.
          </h5>
          <h6 className="container2-h6">
            Superior yarns and rich fibers that undergo world-class finishing processes.
            Comfort, elegance, and enhanced luster.
            Anti-bacterial and anti-viral properties in some specialized collections (developed in association with Health Guard).
            Wrinkle-free options.
          </h6>
          <h6 className="container2-h6">
            100% Cotton: Soft, breathable, comfortable for daily wear (e.g., premium cotton).
            Polyester Viscose (PV): A blend offering durability and a formal look, often used for formal wear.
            Cotton-Linen Blends: Combines the breathability of cotton with the texture of linen for a stylish feel.
            Specialty Fabrics: Includes Evita Bamboo, Vitello, and even Anti-Bacterial options for hygiene
          </h6>
        </div>

        <div className="suiting-image">
          {shirtingImg && (
            <img src={shirtingImg} alt="Siyaram Shirting" loading="lazy" />
          )}
        </div>
      </div>

      {/* ================= OCCASION SECTION ================= */}
      <OccasionSection />

      {/* ================= SLIDER ================= */}
      <section className="video-section scroll-hide">
        <h2>Our Fabric</h2>

        <div className="hero-container2">
          <div
            className="hero-slider"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {sliderImages.map((img, index) => (
              <div className="hero-image" key={index}>
                <img src={img} alt={`slide-${index}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
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
    </>
  );
}
