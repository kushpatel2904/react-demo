import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import LinenSection from "./linensection";
import "./linen.css";

export default function Linen() {
  /* ================= STATE ================= */
  const [current, setCurrent] = useState(0); // slider ma current index
  const [linenhero, setlinenhero] = useState(""); // hero image state
  const [sliderImages, setSliderImages] = useState([]); // slider images list
  const [suitingImg, setSuitingImg] = useState(""); // suiting section image
  const [shirtingImg, setShirtingImg] = useState(""); // shirting section image
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
    const fetchAllData = async () => {
      try {
        // Promise.all thi hero, slider, sections ek saathe fetch thay
        const heroPromise = getDocs(collection(db, "linenhero"));
        const sliderPromise = getDocs(query(collection(db, "linenSlider"), orderBy("order", "asc")));
        const sectionsPromise = getDocs(collection(db, "linenSections"));

        const [heroSnap, sliderSnap, sectionsSnap] = await Promise.all([
          heroPromise,
          sliderPromise,
          sectionsPromise
        ]);

        // Hero Image
        const heroData = heroSnap.docs
          .map(doc => doc.data())
          .find(item => item.type === "hero");
        setlinenhero(heroData?.image || "");

        // Slider Images
        const sliderImgs = sliderSnap.docs.map(doc => doc.data().image);
        setSliderImages(sliderImgs);

        // Suiting / Shirting
        sectionsSnap.forEach(doc => {
          const data = doc.data();
          if (data.type === "suiting") setSuitingImg(data.image);
          if (data.type === "shirting") setShirtingImg(data.image);
        });

      } catch (err) {
        console.error("linen fetch all error:", err);
      }finally {
        setLoading(false); 
      }
    };

    fetchAllData();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (sliderImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % sliderImages.length);
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
    onScroll(); // page load ma call

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
        className="hero-section-linen scroll-hide"
        style={{
          backgroundImage: `url(${linenhero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay scroll-hide"></div>
        <h1 className="hero-title-linen scroll-hide">Linen That Speaks Class</h1>
      </section>

      {/* Paragraph Content */}
      <div className="paragraph-contect scroll-hide">
        <p className="content scroll-hide">India’s No. 1 Linen Brand – Where Luxury Meets Comfort</p>
      </div>

      {/* Shirting Section */}
      <div className="image-text-container scroll-hide">
        <div className="linen-image">
          {shirtingImg && <img src={shirtingImg} alt="Siyaram Shirting" loading="lazy" />} {/* lazy load added */}
        </div>
        <div className="suiting-text" >
          <h1 className="h1 scroll-hide">Linen shirting</h1>
          <div className="linen-text scroll-hide">
            <h5 className="h5">
              Linen Club fabrics are made from 100% pure European flax fibers,
              primarily sourced from France and Belgium. This ensures high quality and sustainable production.
              Linen's natural fibers allow excellent airflow, making the garments comfortable in warm weather or on long workdays.
              The fabric has a distinctive, slightly textured appearance and a natural sheen that lends a sophisticated and timeless look, ideal for a refined formal style
            </h5>
            <h6 className="h6">
              Neutral tones like whites, creams, light greys, navy, and charcoal are considered ideal for formal office wear and events.
              Solids are the most formal, while subtle stripes or self-designs can also work for a semi-formal look.
              Linen Club fabrics can be tailored into various formal garments
            </h6>
            <h6 className="h6">
              Crisp, slim-fit linen shirts in solid colors are a foundation for formal or smart-casual office looks.
              Well-fitted linen trousers in neutral shades offer a sophisticated alternative to wool, especially in warmer climates.
              A well-constructed linen suit (or blazer paired with chinos/trousers) in a dark or neutral color is appropriate for summer weddings, business meetings, and formal gatherings, balancing elegance with comfort.
            </h6>
          </div>
        </div>
      </div>

      {/* Suiting Section */}
      <div className="suiting-section scroll-hide">
        <div className="shirting-text scroll-hide">
          <h1 className="h1">The "Crumpled Elegance" Suit</h1>
          <div className="suiting-text scroll-hide">
            <h5 className="h5">
              Linen is made from the natural fibers of the flax plant and is highly valued for its unique properties,
              which make it ideal for suits, particularly in hot and humid climates.
              Linen fibers have a natural hollow structure and a loose weave that allows air to circulate freely around the body, helping heat escape and keeping you cool.
            </h5>
            <h6 className="h6">
              Linen is a naturally light fabric that drapes well and doesn't cling to the body, offering an effortless and relaxed feel.
              Linen fibers are stronger than cotton, and the fabric actually becomes softer and more comfortable with every wash and wear, making it a long-lasting addition to your wardrobe.
              Linen suits are available in a broad spectrum of colors, suitable for different occasions and personal styles.

            </h6>
            <h6 className="h6">
              Blues and Greens: These shades offer a refreshing yet sophisticated look that works well for various social events, including beach or garden parties.
              Gray (Light or Pastel): A sophisticated option that transitions well from daytime to evening events.
              Cream/Ecru: A soft, natural alternative to stark white, exuding elegance.
              Navy Blue/Blue: A classic and refined choice that offers sophistication without the weight of traditional wool.
            </h6>
          </div>
        </div>
        <div className="linenclub-image scroll-hide">
          {suitingImg && <img src={suitingImg} alt="Siyaram Suiting" loading="lazy" />} {/* lazy load added */}
        </div>
      </div>

      {/* Linen Section Component */}
      <LinenSection /> {/* memoize this component for optimization if needed */}

      {/* Video / Slider Section */}
      <section className="video-section scroll-hide">
        <h2 className="video-section">Our Fabric</h2>
        <div className="hero-container2">
          <div
            className="hero-slider scroll-hide"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {sliderImages.map((img, id) => (
              <div className="hero-image scroll-hide" key={id}>
                <img src={img} alt={`slide-${id}`} loading="lazy" /> {/* lazy load added */}
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
    </>
  );
}
