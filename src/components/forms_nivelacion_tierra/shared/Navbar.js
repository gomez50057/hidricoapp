"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import UserOptionsModal from './UserOptionsModal';
import './Navbar.css';

const img = "/img/escudos/";
const imgBasePath = "https://bibliotecadigitaluplaph.hidalgo.gob.mx/img_banco/";

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState(''); // Supón que obtienes el nombre de usuario de algún lugar
  const circuloRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(currentScrollPos < scrollPosition || currentScrollPos < 10);
      setScrollPosition(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition]);

  const handleCirculoClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className={`Navbar ${visible ? 'active' : 'hidden'} ${scrollPosition > 100 ? 'scrolled' : ''}`}>
      <ul>
        <div className="Navbar_img">
          {/* <img src={`${img}MX.webp`} alt="img_representativa" />
          <img src={`${img}CDMX.webp`} alt="img_representativa" />
          <img src={`${img}EDOMEX.webp`} alt="img_representativa" /> */}
          <img src={`${img}Coordinación.png`} alt="img_representativa" />
          <img src={`${img}HGO.webp`} alt="img_representativa" />
          <img src={`/img/headertxt.png`} alt="img_representativa" />

          <li><Link href="/" className=""> Inicio </Link></li>
        </div>

        <div className="Navbar_inicio">
          <div className="navbar_opc">
            {/* <li><Link href="/mapa-proyectos" className=""> Proyectos Metropolitanos  </Link></li> */}
            <li><Link href="https://docs.google.com/forms/d/e/1FAIpQLSehI664YEXO00Iq_RCcFavmttiDTAaREbNcgk1ClOZzilnrGQ/viewform?usp=header" target="_blank"
              rel="noopener noreferrer"> POZMVM </Link></li>
            <li><Link href="/integrantes" className=""> Integrantes  </Link></li>
            <li><Link href="/noticias" className=""> Noticias  </Link></li>
            <li><Link href="/login" className=""> Acceder </Link></li>
          </div>
          <div className="Navbar_circulo" ref={circuloRef} onClick={handleCirculoClick}>
            <img src={`${imgBasePath}estrella.webp`} alt="img_representativa" />
          </div>
        </div>
      </ul>

      {/* Mostrar el UserOptionsModal */}
      <UserOptionsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        anchorElement={circuloRef.current}
        username={username} // Pasar el nombre de usuario, si está disponible
      />
    </nav>
  );
};

export default Navbar;
