import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  useEffect(() => {

    const onScroll = () => {
      const elements = document.querySelectorAll(".scroll-hide");

      elements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (elementTop < screenHeight - 100) {
          el.classList.add("scroll-show");
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // page load par bhi check

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <footer className="footer scroll-hide">
        <div className="footer-container scroll-hide">

          {/* LEFT */}
          <div className="footer-col scroll-hide">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/Brand/ReidTaylor">Brands</Link></li>
              <li><Link to="/Collections">Collections</Link></li>
              <li><Link to="/Aboutus">About Us</Link></li>
              <li><Link to="/Store">Store Locator</Link></li>
            </ul>
          </div>

          {/* CENTER */}
          <div className="footer-col center scroll-hide">
            <h4>SIGN UP FOR OUR NEWSLETTER</h4>

            <form className="newsletter scroll-hide" onSubmit={handleSubmit}>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Subscribe</button>
              </div>
            </form>

            {submitted && (
              <p className="newsletter-msg">Thanks for subscribing ✨</p>
            )}
            <h4 className="follow-title scroll-hide">FOLLOW US</h4>
            <div className="social-icons scroll-hide">
              {/* Instagram Link */}
              <a
                href="https://www.instagram.com/rivaaj_fabrics_bardoli/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>

              {/* WhatsApp Link - Optimized for Mobile */}
              <a
                href="https://api.whatsapp.com/send?phone=919913023110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="footer-col righ scroll-hidet">
            <div className="brand scroll-hide">
              <span>Rivaaj</span><br />
              <strong>The Fabric Shop</strong>
            </div>

            <div className="contact-info scroll-hide">
              <p><i className="fa-solid fa-phone"></i> +91 99130 23110</p>
              <p><i className="fa-solid fa-phone"></i> +91 9909253188</p>
              <p><i className="fa-solid fa-envelope"></i>RivaajTheFabrics1508.com</p>
              <p><i className="fa-solid fa-clock"></i> Mon – Sat: 9:30AM – 8PM</p>
            </div>
          </div>
        </div>
      </footer>


    </>
  );
}
