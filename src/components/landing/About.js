"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "../../styles/About.module.css";
const imgBasePath = "/img/";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const maskRef = useRef(null);

  useEffect(() => {
    if (maskRef.current) {
      gsap.set(maskRef.current, { width: "0%" });

      gsap.to(maskRef.current, {
        scrollTrigger: {
          trigger: "." + styles.aboutContainer,
          start: "center center",
          end: "top+=500 top",
          scrub: true,
          markers: false,
        },
        width: "100%",
        ease: "none",
      });
    }
  }, []);

  return (
    <section>
      <div className={styles.aboutContainer} style={{ position: "relative", overflow: "hidden" }}>
        <div className={styles.maskOverlay} ref={maskRef}></div>

        <div className={styles.aboutImg}>
          <img src={`${imgBasePath}aboutImg.jpg`} alt="Campo de riego" />
        </div>

        <div className={styles.aboutTxt}>
          <h2>
            <span>Transformando</span> el <span>Futuro</span> con <span>Agua:</span> Una <span className="spanDoarado">Visión Hídrica</span> para <span className="spanDoarado">Hidalgo</span>
          </h2>
          <h3>Compromiso con el bienestar, desarrollo y sustentabilidad de nuestras metrópoli</h3>
          <p>El Gobierno del Estado de Hidalgo, con una visión integral, participativa y centrada en el bienestar de las y los hidalguenses, impulsa el Plan Hídrico Metropolitano, una estrategia transformadora que forma parte del Plan Estatal de Desarrollo.</p>
          <p>Este proyecto se articula en torno a cuatro ejes fundamentales: acceso universal al agua potable, saneamiento responsable, prevención de riesgos por inundaciones y modernización del riego agrícola. Cada eje está diseñado para detonar el desarrollo sostenible, fortalecer la justicia social y asegurar un futuro resiliente.</p>
        </div>
      </div>
    </section>
  );
}
