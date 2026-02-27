import React, { useEffect, useState } from "react";
import "./hero.css";

export default function Hero() {

  //  slider ma show karva mate images ni list
  const images = [
    "/images/logo.png",
    "/images/grado.png",
    "/images/Rivaaj.png",
    "/images/siyaram1.png",
    "/images/Jhamsted1.png",
  ];

  //  current image id store karva mate state
  const [current, setCurrent] = useState(0);

  useEffect(() => {

    //  5 second pachi image automatic change karva mate interval
    const interval = setInterval(() => {

      //  current id ne next image par move kare chhe
      //  last image pachi fari thi first image aavse
      setCurrent((prev) => (prev + 1) % images.length);

    }, 5000); // 👈 5 seconds slow slider

    //  component unmount thay tyare interval clear karva mate
    return () => clearInterval(interval);

  }, [images.length]); //  images ni length change thay to effect fari run thase

  return (
    //  hero section nu outer container
    <div className="hero-container2">

      {/*  slider wrapper je translateX thi move thay chhe */}
      <div
        className="hero-slider"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {/*  badhi images loop kari ne render karva */}
        {images.map((img, id) => (

          //  ek-ek slide mate wrapper
          <div className="hero-image" key={id}>

            {/*  actual image show thay chhe */}
            <img src={img} alt={`slide-${id}`} />

          </div>
        ))}
      </div>
    </div>
  );
}
