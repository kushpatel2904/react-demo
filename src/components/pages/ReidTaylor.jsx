import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import ReidTaylorsection from "./ReidTaylorsection";
import "./ReidTaylor.css";

export default function ReidTaylor() {
  const [current, setCurrent] = useState(0); // slider current index
  const [reidtaylorhero, setreidtaylorhero] = useState(""); // hero image
  const [sliderImages, setSliderImages] = useState([]); // slider images
  const [shirtingImg, setShirtingImg] = useState(""); // shirting section
  const [suitingImg, setSuitingImg] = useState(""); // suiting section
  const [reidTaylorImg, setReidTaylorImg] = useState(""); // ReidTaylor section
  const [loading, setLoading] = useState(true); 
  const [showTopBtn, setShowTopBtn] = useState(false);

/* 🚀 2. SCROLL EFFECTS (Intersection Observer & Back to Top) */
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scroll-show");
          // Optional: stop observing once shown if you only want it to animate once
          // observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 } //screen par element 10% dekhase aetle trigger thase ane  dekhava lagse 
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


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  

  /* ================= FETCH ALL IMAGES USING PROMISE.ALL ================= */
  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        // Firestore collections fetch promises
        const heroPromise = getDocs(collection(db, "reidtaylorhero"));
        const sliderPromise = getDocs(query(collection(db, "reidTaylorImages"), orderBy("order", "asc")));
        const sectionsPromise = getDocs(query(collection(db, "shirtingImg"), orderBy("order", "asc")));

        // Promise.all to fetch all simultaneously
        const [heroSnap, sliderSnap, sectionsSnap] = await Promise.all([heroPromise, sliderPromise, sectionsPromise]);

        // Hero image
        const heroData = heroSnap.docs
          .map(doc => doc.data())
          .find(item => item.type === "hero");
        setreidtaylorhero(heroData?.image || ""); // Gujarati comment: hero image set thay chhe

        // Slider images
        const sliderImgs = sliderSnap.docs.map(doc => doc.data().image);
        setSliderImages(sliderImgs); // Gujarati: slider images set thay chhe

        // Sections: shirting, suiting, reidtaylor
        sectionsSnap.forEach(doc => {
          const data = doc.data();
          if (data.type === "shirting") setShirtingImg(data.image); // shirting image set
          if (data.type === "suiting") setSuitingImg(data.image); // suiting image set
          if (data.type === "reidtaylor") setReidTaylorImg(data.image); // ReidTaylor image set
        });

      } catch (err) {
        console.error("Error fetching all images:", err);
      }finally {
        setLoading(false); 
      }
    };

    fetchAllImages();
  }, []);

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (!sliderImages.length) return;

    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % sliderImages.length); 
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages]);

    
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


      {/* HERO SECTION */}
      <section
        className="hero-section-ReidTaylor "
        style={{
          backgroundImage: `url(${reidtaylorhero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay"></div>
        <h1 className="hero-title-ReidTaylor">Reid & Taylor Formal Wear Excellence</h1>
      </section>

      {/* REID TAYLOR IMAGE */}
      {reidTaylorImg && (
        <section className="brand-image-section ">
          <img src={reidTaylorImg} alt="Reid Taylor Brand" loading="lazy" /> {/* Gujarati: lazy load add */}
        </section>
      )}

      {/* PARAGRAPH */}
      <div className="paragraph-contect scroll-hide">
        <p className="content">Reid & Taylor — Crafted for those who define elegance</p>
      </div>

      {/* SHIRTING */}
      <div className="image-text-container scroll-hide">
        <div className="container-image">
          {shirtingImg && <img src={shirtingImg} alt="Shirting" loading="lazy" />}
        </div>
        <div className="suiting-text">
          <h1>Shirting</h1>
          <h5 className="h5">
            Reid & Taylor is a premium Indian fabric brand renowned for its luxurious suiting and shirting fabrics.
            They combine traditional craftsmanship with modern innovation, offering fabrics with superior comfort,
            durability, and wrinkle resistance. Advanced blends include superfine polyesters, premium cottons,
            and unique options like bamboo and stretch fabrics, perfect for contemporary style and breathability
            in both formal and casual wear.
          </h5>
          <h6 className="h6">
            A trusted choice for custom tailoring, Reid & Taylor provides fabrics for suits, trousers, and shirts,
            available in a variety of materials, colors, and patterns to cater to diverse needs, from boardroom
            meetings to casual settings.
          </h6>
          <h6 className="h6">
            Their fabrics are celebrated for quality, comfort, and elegance, seamlessly blending traditional techniques
            with modern fabric innovations. Materials like superfine polyester, cotton, linen, and their blends offer
            stretch, breathability, and wrinkle resistance, making them suitable for every occasion, from formal events
            to everyday casual wear.
          </h6>
        </div>
      </div>

      {/* SUITING */}
      <div className="image-text-container scroll-hide">
        <div className="suiting-text">
          <h1>Suiting</h1>
          <h5 className="h5">
            Materials & Blends: Reid & Taylor offers a premium range of fabrics, including:
            Natural: 100% cotton (including Giza and Egyptian cotton), 100% linen, and cotton-linen blends.
            Blends: Popular options include polyester-viscose (PV), poly-cotton (PC), and wool blends.
            Specialty: They also provide luxurious fabrics like wool-silk blends, merino wool, and eco-friendly materials known for comfort and durability.
          </h5>
          <h6 className="h6">
            Superior yarns and finest fibers crafted with world-class finishing techniques.
            Comfort, elegance, and natural sheen for a refined look.
            Some specialized collections feature stain-resistant and anti-bacterial finishes.
            Wrinkle-resistant options for modern convenience.
          </h6>
          <h6 className="h6">
            100% Cotton: Soft, breathable, and ideal for everyday elegance.
            Polyester Viscose (PV): Durable and perfect for formal occasions.
            Cotton-Linen Blends: Combines lightness and texture for a sophisticated feel.
            Specialty Fabrics: Includes wool-silk blends, merino wool, and other luxury options designed for style and comfort.
          </h6>
        </div>
        <div className="suiting-image">
          {suitingImg && <img src={suitingImg} alt="Suiting" loading="lazy" />}
        </div>
      </div>

      {/* REID TAYLOR SECTION */}
      <ReidTaylorsection />

      {/* SLIDER */}
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

      {/* VALUES */}
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
