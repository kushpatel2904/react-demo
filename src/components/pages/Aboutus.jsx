import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import CollectionShower from "./shower";
import "./Aboutus.css";

export default function Aboutus() {
  const [aboutImages, setAboutImages] = useState([]);
  const [whyImages, setWhyImages] = useState([]);
  const [craftImages, setCraftImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExploring, setIsExploring] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null); // New State

  const teamData = [
    { name: "DHARMESH PATEL", role: "OWNER", bio: "With over 20 years of experience in the textile industry, Dharmesh leads Rivaaj with a vision for perfection." },
    { name: "RAJU TAILOR", role: "PARTNER", bio: "A master of precision, Raju ensures every cut and stitch meets the highest standards of formal wear." },
    { name: "NIL PATEL", role: "Co-Founder & CEO", bio: "Nil brings modern strategies and innovation, making Rivaaj a global name in premium fabrics." },
    { name: "MAYUR KOKRA", role: "STAFF", bio: "Mayur is the backbone of our operations, ensuring customer satisfaction and quality control." }
  ];


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [aboutSnap, whySnap, craftSnap] = await Promise.all([
          getDocs(collection(db, "about")),
          getDocs(collection(db, "why")),
          getDocs(collection(db, "craft")),
        ]);

        setAboutImages(
          aboutSnap.docs.map(d => d.data().image).filter(Boolean)
        );

        setWhyImages(
          whySnap.docs.map(d => d.data().image).filter(Boolean)
        );

        setCraftImages(
          craftSnap.docs.map(d => d.data().image).filter(Boolean)
        );

      } catch (err) {
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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
      {/* ABOUT HERO */}
      <div className="about-wrapper scroll-hide">
        <div className="about-card">
          <div className="about-images">
            {aboutImages[0] && (
              <img
                src={aboutImages[0]}
                className="img-main"
                alt="Premium fabric showcase"
                loading="lazy"
              />
            )}
            {aboutImages[1] && (
              <img
                src={aboutImages[1]}
                className="img-overlay"
                alt="Fabric texture close-up"
                loading="lazy"
              />
            )}
          </div>

          <div className="about-content">
            <h4>ABOUT US</h4>
            <h2>Crafting Premium Experiences</h2>
            <p>
              We provide premium quality fabrics crafted with perfection. Our
              designs blend modern trends with timeless elegance.
            </p>
            <p>
              Our mission is to bring confidence and class to every outfit you
              wear.
            </p>
            <button onClick={() => setIsExploring(true)}>Explore More</button>
          </div>
        </div>
      </div>

      {/* ART SECTION */}
      <section className="about-wrapper scroll-hide">
        <h1 className="occasion-title scroll-hide">The Art of Fine Fabrics</h1>

        <div className="about-inner">
          <div className="about-left">
            {aboutImages[2] && (
              <img
                src={aboutImages[2]}
                className="img img-large"
                alt="Luxury fabric craftsmanship"
                loading="lazy"
              />
            )}
            {aboutImages[5] && (
              <img
                src={aboutImages[5]}
                className="img img-small"
                alt="Detailed textile pattern"
                loading="lazy"
              />
            )}

            <p className="about-caption scroll-hide">
              Premium fabrics for statement pieces and everyday sophistication — Constantin.
            </p>
          </div>

          <div className="about-right">
            <span className="year">2026</span>
            <p className="about-text scroll-hide">
              Whether for signature statement pieces or refined daily wear,
              Constantin offers fabrics crafted to perfection.
            </p>

            <div className="right-images">
              {aboutImages[4] && (
                <img
                  src={aboutImages[4]}
                  alt="Modern fabric design"
                  loading="lazy"
                />
              )}
              {aboutImages[3] && (
                <img
                  src={aboutImages[3]}
                  alt="Classic fabric finish"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>

        <h1 className="brand-watermark">RIVAAJ</h1>
      </section>

      {/* WHY CHOOSE US */}
      {whyImages.length > 0 && (
        <div className="why-wrapper scroll-hide">
          <div className="why-container">
            <span className="badge">Why Choose Us</span>
            <h2>Why Choose Us</h2>

            <p className="subtitle scroll-hide">
              Formal fabrics are the silent architects of confidence, shaping every
              moment with elegance and precision.
            </p>

            <div className="card-grid">
              {whyImages.map((img, i) => (
                <div className="why-card" key={i}>
                  <img
                    src={img}
                    alt={`Reason ${i + 1} for choosing our fabrics`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      


      <section className="team-section scroll-hide">
        <div className="team-header">
          <span className="team-subtitle">Our Team</span>
          <h1 className="team-title">Meet our Team</h1>
        </div>

        <div className="team-grid">
          {craftImages.slice(0, 4).map((img, index) => (
            <div
              className="team-card"
              key={index}
              onClick={() => setSelectedMember({ ...teamData[index], img })} // Click event
            >
              <div className="img-container">
                <img src={img} alt={teamData[index].name} />

              </div>
              <h3>{teamData[index].name}</h3>
              <p>{teamData[index].role}</p>
            </div>
          ))}
        </div>
      </section>

     {/* LUXURY DETAIL OVERLAY */}
{selectedMember && (
  <div className="member-detail-overlay">
    <div className="overlay-bg" onClick={() => setSelectedMember(null)}></div>
    <div className="detail-content">
    
      <div className="detail-grid">
        <div className="detail-img-side">
          <img src={selectedMember.img} alt={selectedMember.name} />
        </div>
        <div className="detail-info-side">
          <span className="gold-tag">RIVAAJ ELITE</span>
          <h2>{selectedMember.name}</h2>
          <h4 className="role-text">{selectedMember.role}</h4>
          <div className="divider"></div>
          <p className="bio-text">{selectedMember.bio}</p>

          {/* REPLACED SOCIAL LINKS WITH BACK BUTTON */}
          <div className="back-navigation">
            <button 
              className="back-to-site-btn" 
              onClick={() => setSelectedMember(null)}
            >
              BACK 
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}



      <div className="paragraph-contect scroll-hide">
        <p className="content1">
          Passion in Every Thread
        </p>
      </div>
      <CollectionShower />

      {isExploring && (
        <div className="luxury-overlay">
          <div className="overlay-close" onClick={() => setIsExploring(false)}>CLOSE ✕</div>

          <div className="overlay-grid">
            <div className="overlay-text-side">
              <span className="gold-text">SINCE 2010</span>
              <h2>The Soul of Rivaaj</h2>
              <p>Every thread tells a story. We don’t just craft fabric , we weave an emotion that defines your personality.</p>

              <div className="feature-list">
                <div className="f-item"><strong>01.</strong> Hand-Picked Fibers</div>
                <div className="f-item"><strong>02.</strong> Precision Weaving</div>
                <div className="f-item"><strong>03.</strong> Eco-Friendly Dyes</div>
              </div>
            </div>

            <div className="overlay-image-side">
              {aboutImages[4] && <img src={aboutImages[4]} alt="Process" />}
              <div className="image-caption">Crafted in our Surat Atelier</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
