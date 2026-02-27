import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  // Toggle main mobile menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (isMenuOpen) setIsBrandOpen(false); // Reset brands if closing menu
  };

  // Close everything
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsBrandOpen(false);
  };

  // Toggle Brand sub-menu (Open/Close on click)
  const toggleBrand = (e) => {
    e.stopPropagation();
    setIsBrandOpen((prev) => !prev);
  };

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);


  

  return (
    <nav className="navbar">
      {/* Desktop Logo */}
      <div className="logo">
        <Link to="/" onClick={closeMenu}>
          <img src="/images/Rivaaj6.png" alt="Rivaaj The Fabric Shop" />
        </Link>
      </div>

      {/* Hamburger Toggle */}
      <button
        type="button"
        className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Logo View */}
      <div className="mobile-title">
        <img src="/images/Rivaaj6.png" alt="Rivaaj The Fabric Shop" />
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <button className="menu-close" onClick={closeMenu}>✕</button>
        
        <li>
          <Link to="/" onClick={closeMenu}>Home</Link>
        </li>

        {/* Brands Dropdown Toggle */}
        <li className={`brand-dropdown ${isBrandOpen ? "active" : ""}`}>
          <span className="brand-link" onClick={toggleBrand}>
            Brands <span className="arrow">▼</span>
          </span>

          <div className="brand-menu">
            <Link to="/Brand/siyaram" onClick={closeMenu}>Siyaram</Link>
            <Link to="/Brand/Linen" onClick={closeMenu}>Linen</Link>
            <Link to="/Brand/JHamsted" onClick={closeMenu}>J. Hampstead</Link>
            <Link to="/Brand/Arvind" onClick={closeMenu}>Arvind</Link>
            <Link to="/Brand/Raymond" onClick={closeMenu}>Raymond</Link>
            <Link to="/Brand/ReidTaylor" onClick={closeMenu}>Reid & Taylor</Link>
          </div>
        </li>

        <li>
          <Link to="/Collections" onClick={closeMenu}>Collections</Link>
        </li>

        <li>
          <Link to="/Aboutus" onClick={closeMenu}>About us</Link>
        </li>

        <li>
          <Link to="/Store" onClick={closeMenu}>Store Locator</Link>
        </li>
      </ul>

      {/* Desktop Shop Button */}
      <Link to="/Collections" className="shop-btn desktop-only">
        SHOP NOW
      </Link>
    </nav>
  );
}