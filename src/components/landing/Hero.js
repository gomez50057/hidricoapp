"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from "../../styles/Hero.module.css";
const imgBasePath = "/img/";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const maskRef = useRef(null);

  useEffect(() => {
    // Pinnea la sección completa (elemento con id "header") durante 1000px de scroll
    ScrollTrigger.create({
      trigger: "#header",
      start: "top top",
      end: "top+=1000 top",
      pin: true,
      markers: false,
    });

    // Animación de la máscara: expandir el agujero de 100px a 100vw sin que se mueva
    if (maskRef.current) {
      gsap.set(maskRef.current, {
        "--mask-size": "400px"
      });

      gsap.to(maskRef.current, {
        scrollTrigger: {
          trigger: "#header",
          start: "top top",
          end: "top+=1000 top",
          scrub: true,
          markers: false,
        },
        "--mask-size": "200vw",
        ease: "none"
      });
    }

  }, []);

  return (
    <section id="header">
      <div className={styles.contentHeader}>
        <div className={`${styles.headerTxt} ${styles.fadeInTarget}`}>
          <img src={`${imgBasePath}headertxt.png`} alt="img_representativa" />
        </div>
        <div className={`${styles.headerImg}`}>
          <img src={`${imgBasePath}headerimg.png`} alt="img_representativa" className={styles.floatingImg} />
        </div>
        <div className={`${styles.headerKey}`}>
          <img src={`${imgBasePath}llave.png`} alt="img_representativa" className={styles.floatingImg} />
        </div>
      </div>
      <div className={styles.maskOverlay} ref={maskRef} />
    </section>
  );
}
