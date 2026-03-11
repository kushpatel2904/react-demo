import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./customtailoring.css";

export default function CustomTailoring({ onBack }) {
  const [images, setImages] = useState({
    ct_image1: null,
    ct_image2: null,
    ct_image3: null,
    ct_step1: null,
    ct_step2: null,
    ct_step3: null,
    ct_step4: null
  });

  useEffect(() => {
    // Scroll to top when this component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Fetch images from Firebase
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jhamstedknowmore"));
        const imgData = {};
        // Use type property from dashboard payload to identify images
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type) {
            imgData[data.type] = data.image;
          }
        });
        setImages(prev => ({ ...prev, ...imgData }));
      } catch (error) {
        console.error("Error fetching custom tailoring images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="custom-tailoring-wrapper">
      {/* Header with Back Button */}
      <div className="custom-tailoring-header">
        <button className="back-btn" onClick={onBack}>
          &larr; Back to 
        </button>
      </div>

      {/* Main Title Area */}
      <section className="ct-intro-section">
        <h1 className="ct-main-title">Custom Tailored Suits With Best Fit & Style</h1>
        <div className="vertical-line"></div>
        <p className="ct-intro-text">
          Perfected to every inch, crafted for excellence. We single out every detail of your desired attire, and the way you want it. A blend of utmost care and diligent artistry is put to work that displays a new you.
        </p>
      </section>

      {/* Process Steps Section */}
      <section className="ct-process-section">
        <div className="process-step">
          {images.ct_step1 ? (
             <img src={images.ct_step1} alt="Step 1" className="step-image" />
          ) : (
             <div className="step-image-placeholder"></div>
          )}
          <div className="step-number">01</div>
          <h3>We Understand Your Tailoring Requirements</h3>
        </div>
        <div className="process-divider"></div>
        <div className="process-step">
          {images.ct_step2 ? (
             <img src={images.ct_step2} alt="Step 2" className="step-image" />
          ) : (
             <div className="step-image-placeholder"></div>
          )}
          <div className="step-number">02</div>
          <h3>Customized Fitting</h3>
        </div>
        <div className="process-divider"></div>
        <div className="process-step">
          {images.ct_step3 ? (
             <img src={images.ct_step3} alt="Step 3" className="step-image" />
          ) : (
             <div className="step-image-placeholder"></div>
          )}
          <div className="step-number">03</div>
          <h3>Our masters use their craftsmanship to create your perfect custom fit product</h3>
        </div>
        <div className="process-divider"></div>
        <div className="process-step">
          {images.ct_step4 ? (
             <img src={images.ct_step4} alt="Step 4" className="step-image" />
          ) : (
             <div className="step-image-placeholder"></div>
          )}
          <div className="step-number">04</div>
          <h3>We Create Elegant Custom Clothing</h3>
        </div>
      </section>

      
{/* Showcase Section 1 */}
<section className="ct-showcase">

  <div className="showcase-image">
    {images.ct_image1 ? (
      <img src={images.ct_image1} alt="section1" />
    ) : (
      <div className="image-placeholder">Image 1</div>
    )}
  </div>

  <div className="showcase-content">
    <h2>CUSTOMISED FIT & STYLE</h2>
    <p>
      Our collection goes way beyond our stores, unleashing your fashion
      imagination. We are the pioneers in craftsmanship.
    </p>
  </div>

</section>


{/* Showcase Section 2 */}
<section className="ct-showcase reverse">

  <div className="showcase-image">
    {images.ct_image2 ? (
      <img src={images.ct_image2} alt="section2" />
    ) : (
      <div className="image-placeholder">Image 2</div>
    )}
  </div>

  <div className="showcase-content">
    <h2>CREATE YOUR OWN LOOK</h2>
    <p>
      From fancy embellishments to preferential initials, we make every
      intricate design exclusively to suit you.
    </p>
  </div>

</section>


{/* Showcase Section 3 */}
<section className="ct-showcase">

  <div className="showcase-image">
    {images.ct_image3 ? (
      <img src={images.ct_image3} alt="section3" />
    ) : (
      <div className="image-placeholder">Image 3</div>
    )}
  </div>

  <div className="showcase-content">
    <h2>HIGH QUALITY FINISH</h2>
    <p>
      Right from the first sew till the hem of the cloth,
      our garments give the feel of a perfectly tailored garment.
    </p>
  </div>

</section>
    </div>
  );
}
