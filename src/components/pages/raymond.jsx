import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import RaymondSection from "./raymondsection";
import "./raymond.css";

export default function Raymond() {
  const [current, setCurrent] = useState(0); // slider ma current index
  const [raymondhero, setraymondhero] = useState(""); // hero image state
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

  /* ================= FETCH ALL DATA TOGETHER ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // fetch hero, slider and sections ek sath Promise.all thi
        const [heroSnap, sliderSnap, sectionSnap] = await Promise.all([
          getDocs(collection(db, "raymondhero")),
          getDocs(query(collection(db, "raymondSlider"), orderBy("order", "asc"))),
          getDocs(collection(db, "raymondSections")),
        ]);

        // Hero image
        const heroData = heroSnap.docs
          .map(doc => doc.data())
          .find(item => item.type === "hero");
        setraymondhero(heroData?.image || "");

        // Slider images
        const imgs = sliderSnap.docs.map(doc => doc.data().image);
        setSliderImages(imgs);

        // Suiting / Shirting sections
        sectionSnap.forEach(doc => {
          const data = doc.data();
          if (data.type === "suiting") setSuitingImg(data.image);
          if (data.type === "shirting") setShirtingImg(data.image);
        });

      } catch (err) {
        console.error("raymond fetch error:", err);
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
      setCurrent(prev => (prev + 1) % sliderImages.length); // next slide
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
        className="hero-section-Raymond scroll-hide"
        style={{
          backgroundImage: `url(${raymondhero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay scroll-hide"></div>
        <h1 className="hero-title-Raymond scroll-hide">
          Raymond, A Diversified Group Shaping A Stronger & Better Tomorrow
        </h1>
      </section>

      {/* Paragraph */}
      <div className="paragraph-contect scroll-hide">
        <p className="content scroll-hide">“Raymond, Defining Elegance Beyond Time”</p>
      </div>

      {/* Shirting Section */}
      <div className="image-text-container scroll-hide">
        <div className="Raymond-image">
          {shirtingImg && <img src={shirtingImg} alt="Siyaram Shirting" loading="lazy" />} {/* lazy load */}
        </div>
        <div className="suiting-text">
          <h1 className="h1">
            Raymond, A Diversified Group Shaping A Stronger & Better Tomorrow.
          </h1>
          <div className="Raymond-text scroll-hide">
            <h5 className="h5">
              With roots dating back to 1925, as a small woollen mill in Thane (Maharashtra), manufacturing coarse woollen blankets, Raymond Brand has evolved into a leading manufacturer of the finest fabrics in the world. Reckoned for its pioneering innovations and having enjoyed the patronage of millions of consumers, Raymond is amongst the trusted brands in India.
            </h5>
            <h5 className="h5">
              The brand is widely recognized for its premium suiting fabrics,
              exceptional quality, and timeless elegance. Over the decades,
              Raymond has built a strong reputation based on craftsmanship,
              innovation, and trust, serving generations of customers across India and internationally.
            </h5>

            <h6 className="h6">
              Raymond offers a wide range of products including fabrics, ready-to-wear apparel, tailored clothing, and lifestyle solutions. With its strong retail presence and commitment to excellence, Raymond continues to set benchmarks in the fashion and textile industry while shaping a future rooted in quality and style.
            </h6>
          </div>
        </div>
      </div>

      {/* Suiting Section */}
      <div className="Raymondclub-section scroll-hide">
        <div className="Raymondclub-text scroll-hide">
          <h1>Raymond Ready to Wear</h1>
          <div className="paragraph-contect scroll-hide">
            <h5 className="h5">
              Raymond is one of the largest vertically and horizontally integrated manufacturers of worsted suiting fabric in the world and is a market leader in the domestic worsted suiting industry in India.
              Raymond’s advanced fabric manufacturing plants in Vapi (Gujarat), Chhindwara (Madhya Pradesh) and Jalgaon (Maharashtra) have an aggregate manufacturing capacity of ~43 million meters of suiting fabric extending across all wool, poly-wool, silk and other premium blends.
              Marketed under the brand ‘Raymond Fine Fabrics’, it is undoubtedly amongst the most preferred brands in the Textile sector.
            </h5>
            <h6 className="h6">
              The Raymond Group has set an unparalleled benchmark in High-Value Cotton Shirting fabrics with an aim to craft and deliver exceptional quality fabrics.
              With proven expertise in crafting natural fabrics in India, Raymond has an edge in creating the best cotton and linen fabrics.
              Having the prowess of manufacturing 340s count cotton and 150 lea linen, Raymond is the preferred supplier to domestic and international brands both for high-value cotton and linen fabrics along with bottom-weight fabrics.
            </h6>
            <h6 className="h6">
              Pure silk, linen, silk jacquards, poly-viscose, jute silk, cotton, and more exquisite fabrics are available.
              Ensembles feature self-colour, digital and machine embroidery along with hand embroideries such as zardozi, aari, and beadwork, as well as digital and block prints.
            </h6>
          </div>
        </div>
        <div className="Raymondclub-image scroll-hide">
          {suitingImg && <img src={suitingImg} alt="Siyaram Suiting" loading="lazy" />}
        </div>
      </div>

      {/* Raymond Section Component */}
      <RaymondSection /> {/* memoize if heavy */}

      {/* Slider Section */}
      <section className="video-section scroll-hide">
        <h2 className="video-section scroll-hide">Our Fabric</h2>
        <div className="hero-container2 scroll-hide">
          <div
            className="hero-slider scroll-hide"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {sliderImages.map((img, id) => (
              <div className="hero-image" key={id}>
                <img src={img} alt={`slide-${id}`} loading="lazy" />
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
