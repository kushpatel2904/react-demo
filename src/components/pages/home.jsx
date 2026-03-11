import React, { useEffect, useState } from "react";
import HomeSection from "./homesection";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "./home.css";


export default function Home() {
  const [hero, setHero] = useState("");
  const [whyImages, setWhyImages] = useState([]);
  const [workImages, setWorkImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showVideo, setShowVideo] = useState(false); // Video Modal State
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

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

  // Handle closing modal
  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  const handleCloseContact = () => setShowContact(false);

  const onContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const onContactSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await addDoc(collection(db, "queries"), {
        name: contactForm.name,
        phone: contactForm.phone,
        email: contactForm.email,
        message: contactForm.message,
        createdAt: new Date()
      });
  
      setSuccessMsg("Your query has been submitted successfully!");
  
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
  
    } catch (error) {
      console.error("Error submitting query:", error);
      setSuccessMsg("Failed to submit query.");
    }
  
    setShowContact(false);
    setShowQuickActions(false);
  
    setContactForm({
      name: "",
      phone: "",
      email: "",
      message: ""
    });
  };

  useEffect(() => {
    if (!showContact) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowContact(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showContact]);

  useEffect(() => {
    const shouldLock = showVideo || showContact;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showVideo, showContact]);

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
    {successMsg && (
  <div className="success-message">
    {successMsg}
  </div>
)}
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

      {/* BACK TO TOP BUTTON (OLD - SAME AS BEFORE) */}
      <button
        className={`back-to-top ${showTopBtn ? "show" : ""}`}
        onClick={scrollToTop}
        title="Go to top"
      >
        ↑
      </button>

      {/* CONTACT MODAL */}
      <div
        className={`contact-modal ${showContact ? "show" : ""}`}
        onClick={handleCloseContact}
        aria-hidden={!showContact}
      >
        <div className="contact-modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
          <button className="contact-close-btn" onClick={handleCloseContact} aria-label="Close contact form">
            <svg viewBox="0 0 24 24" fill="currentColor">  
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /> {/*close button icon */}
            </svg>
          </button>

          

          <div className="contact-head">
            <span className="contact-badge">Contact Us</span>
            <h2>Send your query</h2>
            <p>We’ll reply as soon as possible.</p>
          </div>

          <form className="contact-form" onSubmit={onContactSubmit}>
            <div className="contact-grid">
              <label className="contact-field">
                <span>Name</span>
                <input name="name" value={contactForm.name} onChange={onContactChange} placeholder="Your name" required />
              </label>

              <label className="contact-field">
                <span>Phone</span>
                <input name="phone" value={contactForm.phone} onChange={onContactChange} placeholder="Mobile number" />
              </label>

              <label className="contact-field contact-field-full">
                <span>Email</span>
                <input
                  name="email"
                  value={contactForm.email}
                  onChange={onContactChange}
                  placeholder="Email"
                  type="email"
                  required
                />
              </label>

              <label className="contact-field contact-field-full">
                <span>Message</span>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={onContactChange}
                  placeholder="Write your message..."
                  rows={5}
                  required
                />
              </label>
            </div>

            <div className="contact-actions">
              <button type="button" className="contact-secondary" onClick={handleCloseContact}>
                Cancel
              </button>
              <button type="submit" className="contact-primary">
                Submit Query
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* FLOATING ARROW + SMALL ACTIONS */}
      <div className="floating-actions" aria-label="Quick actions">
        {showQuickActions && (
          <>
            <button
              className="fab fab-mini fab-contact"
              onClick={() => setShowContact(true)}
              title="Contact us"
              aria-label="Contact us"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm-2 12H6v-2h12v2Zm0-3H6V9h12v2Zm0-3H6V6h12v2Z" />
              </svg>
            </button>

            <a
              className="fab fab-mini fab-whatsapp"
              href="https://wa.me/919913023110"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.52 3.48A11.91 11.91 0 0 0 12.03 0C5.42 0 .06 5.35.06 11.93c0 2.1.55 4.15 1.6 5.97L0 24l6.29-1.64a11.91 11.91 0 0 0 5.74 1.46h.01c6.61 0 11.97-5.35 11.97-11.93 0-3.19-1.24-6.19-3.49-8.41Zm-8.49 18.3h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.74.97 1-3.64-.24-.37a9.89 9.89 0 0 1-1.5-5.22c0-5.48 4.47-9.94 9.97-9.94 2.66 0 5.17 1.03 7.05 2.9a9.86 9.86 0 0 1 2.92 7.04c0 5.48-4.47 9.94-9.99 9.94Zm5.46-7.43c-.3-.15-1.75-.86-2.02-.96-.27-.1-.46-.15-.65.15-.2.3-.75.96-.92 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.65-1.56-.89-2.14-.23-.55-.46-.48-.65-.49h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.64.71.23 1.35.2 1.86.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
              </svg>
            </a>
          </>
        )}

        <button
          className={`fab fab-main fab-arrow ${showTopBtn ? "show" : ""} ${showQuickActions ? "open" : ""}`}
          onClick={() => setShowQuickActions((v) => !v)}
          title="More options"
          aria-label="More options"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
          </svg>
        </button>
      </div>

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