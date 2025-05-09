"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const img = "/planhidrico/img/";
const imgLogos = "/planhidrico/img/forms nivelacion tierra/logos/";


const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const lastScrollPos = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(currentScrollPos < lastScrollPos.current || currentScrollPos < 10);
          lastScrollPos.current = currentScrollPos;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.Navbar} ${visible ? styles.active : styles.hidden} ${lastScrollPos.current > 100 ? styles.scrolled : ''}`}>
      <div className={styles.NavbarList}>
        <div className={styles.NavbarImg}>
          <img src={`${imgLogos}Gob Federal.png`} alt="Gobierno Federal" />
          <img src={`${imgLogos}Gob Hgo.png`} alt="Gobierno del Estado de Hidalgo" /> 
          <img src={`${img}headertxt.png`} alt="Logo de Tenemos un Acuerdo" />
        </div>
        <div className={styles.NavbarInicio}>
          <ul className={styles.navbarOpc}>
            <li><Link href="/">Inicio</Link></li>
            {/* <li><Link href="/ecos-del-territorio-hidrico">Materiales de apoyo</Link></li>
            <li><Link href="/training">Capacitación</Link></li> */}
            <li><Link href="/dashboard">Nivelación</Link></li>
          </ul>
          <div className={styles.NavbarCirculo}>
            <img src={`${img}estrella.webp`} alt="Estrella de Hidalgo" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
