import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import JHamstedsection from "./jhamstedsection";
import "./jhamsted.css";

export default function JHamsted() {
  /* ================= STATE ================= */
  const [current, setCurrent] = useState(0); // slider ma current index
  const [jhamstedhero, setjhamstedhero] = useState(""); // hero image state
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
        // queries prepare karvi
        const heroPromise = getDocs(collection(db, "jhamstedhero"));
        const sliderPromise = getDocs(
          query(collection(db, "jhamstedSlider"), orderBy("order", "asc"))
        );
        const sectionsPromise = getDocs(collection(db, "jhamstedSections"));

        // Promise.all thi parallel fetch
        const [heroSnap, sliderSnap, sectionsSnap] = await Promise.all([
          heroPromise,
          sliderPromise,
          sectionsPromise,
        ]);

        // hero image set karvu
        const heroData = heroSnap.docs
          .map(doc => doc.data())
          .find(item => item.type === "hero");
        setjhamstedhero(heroData?.image || "");

        // slider images set karvu
        const imgs = sliderSnap.docs.map(doc => doc.data().image);
        setSliderImages(imgs);

        // suiting / shirting set karvu
        sectionsSnap.forEach(doc => {
          const data = doc.data();
          if (data.type === "suiting") setSuitingImg(data.image);
          if (data.type === "shirting") setShirtingImg(data.image);
        });
      } catch (err) {
        console.error("JHamsted fetch error:", err);
      }finally {
        setLoading(false); 
      }
    };

    fetchAllData();
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
    onScroll();

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

      {/* Hero Section */}
      <section
        className="hero-section-JHamsted scroll-hide"
        style={{
          backgroundImage: `url(${jhamstedhero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay-JHamsted scroll-hide"></div>
        <h1 className="hero-title-JHamsted scroll-hide">
          J. Hampstead – Luxury You Can Wear
        </h1>
      </section>

      {/* Paragraph Content */}
      <div className="paragraph-contect scroll-hide">
        <p className="content scroll-hide">
          A Legacy of Fine Fabrics & Luxury in Every Thread
        </p>
      </div>

      {/* Shirting Section */}
      <div className="image-text-container scroll-hide">
        <div className="container-image scroll-hide">
          {shirtingImg && (
            <img src={shirtingImg} alt="Siyaram Shirting" loading="lazy" /> // lazy load added
          )}
        </div>
        <div className="suiting-text"> 
          <h1 className="h1 scroll-hide">
            European fashion with an Indian style statement
          </h1>
          <div className="fabrics-text scroll-hide">
            <h5 className="h5">
              The advent of J. Hampstead in India, in the year 1995, was marked
              by the manufacturing of premium quality suiting fabrics made from
              lush fibers including wool, cashmere, kid mohair, merino wool and
              silk.
              <br />
              The brand has gained prominence owing to its fabrics that are
              superlative in softness, smoothness, texture and luster & also
              exhibits a premium collection of cotton and jhamsted fabrics, with
              the thread count beginning from 25’s lea to the superfine 150’s lea.
            </h5>
            <h5 className="h5">
              Indo-Western clothing is a fusion of Indian traditional fashion
              and modern Western trends. It combines classic Indian design
              elements (like embroidery, drapes, or traditional cuts) with
              Western silhouettes (like jackets, shirts, pants, or structured
              tops). This style is popular for festive wear, weddings, parties,
              and stylish contemporary outfits
            </h5>
            <h6 className="h6">
              The formal, semi formal wear, and casual range of shirting and
              suiting materials are woven from the finest of Egyptian cotton
              available in diverse designs and varied colours. This includes
              everything from formal shirts and pants to casual suits for men,
              perfect for both business and leisure.
              <br />
              J. Hampstead has established a strong foothold in the market for
              professional menswear with premium fabrics and apparel — featuring
              an exquisite range of men's shirt and trousers that define stylish
              outfits for men with a distinct flair of sophistication.
            </h6>
          </div>
        </div>
      </div>

      {/* Suiting Section */}
      <div className="suiting-section scroll-hide">
        <div className="suit-text scroll-hide">
          <h1>Jhamsted – Crafted for the Modern Gentleman</h1>
          <div className="shirting-text scroll-hide">
            <h5 className="container2-h5">
              a premium Indian brand under Siyaram's that offers high-quality
              men's suiting, shirting fabrics (wool, jhamsted, cotton), and
              ready-to-wear apparel like shirts and trousers
            </h5>
            <h6 className="container2-h6">
              Known for smoothness, luster, and softness, using fine fibers
              like wool, cashmere, mohair, and silk. Woven from fine Egyptian
              Giza cotton yarns and premium jhamsted, available in diverse
              designs and colors. An Indo-Western brand focuses on fusion
              fashion — combining traditional Indian clothing aesthetics with
              modern Western silhouettes and styling. These brands are popular
              for weddings, parties, festive occasions, and stylish contemporary
              wear. They design outfits that feel elegant, cultural, yet modern
              all at once.
            </h6>
            <h6 className="container2-h6">
              J. Hampstead is a premium international menswear brand under the
              house of Siyaram Silk Mills Ltd.. Originally an international
              worsted textile brand, it was acquired by Siyaram in 1995 and has
              since established a strong presence in India. Indo-Western clothing
              is a fusion of Indian traditional fashion and modern Western trends.
              <br />
              It combines classic Indian design elements (like embroidery,
              drapes, or traditional cuts) with Western silhouettes (like
              jackets, shirts, pants, or structured tops). This style is popular
              for festive wear, weddings, parties, and stylish contemporary
              outfits
            </h6>
          </div>
        </div>
        <div className="suit-image scroll-hide">
          {suitingImg && (
            <img src={suitingImg} alt="Siyaram Suiting" loading="lazy" />
          )}
        </div>
      </div>

      {/* JHamsted Section Component */}
      <JHamstedsection />

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
    </>
  );
}
