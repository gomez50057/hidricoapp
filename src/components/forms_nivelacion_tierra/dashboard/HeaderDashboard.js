"use client";

import React, { useEffect, useState, useRef } from 'react';
import './HeaderDashboard.css';
import UserOptionsModal from '../shared/UserOptionsModal';

const imgBasePath = "https://bibliotecadigitaluplaph.hidalgo.gob.mx/img_banco/";
const imgLogos = "/planhidrico/img/forms nivelacion tierra/logos/";

export default function HeaderDashboard() {
  const [userName, setUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorElement, setAnchorElement] = useState(null);
  const userCircleRef = useRef(null);

  useEffect(() => {
    // 🔥 Ahora solo tomamos el userName de localStorage
    const storedUserName = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!storedUserName || !isLoggedIn) {
      // No hay sesión, redirigir
      window.location.href = '/planhidrico/login';
    } else {
      setUserName(storedUserName);
    }
  }, []);

  const handleCircleClick = () => {
    setIsModalOpen(true);
    setAnchorElement(userCircleRef.current);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="header-dashboard">
      <div className="header-left">
        <img src={`${imgLogos}Gob Federal.png`} alt="Gobierno Federal" />
        <img src={`${imgLogos}Gob Hgo.png`} alt="Gobierno del Estado de Hidalgo" />
      </div>

      <div className="header-right">
        <div className="welcome-container">
          <p className="welcome-text">Hola! <span>{userName}</span></p>
          <div
            className="Navbar_circulo"
            ref={userCircleRef}
            onClick={handleCircleClick}
          >
            <img src={`${imgBasePath}estrella.webp`} alt="Usuario" />
          </div>
        </div>
      </div>

      <UserOptionsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        anchorElement={anchorElement}
        username={userName}
      />
    </header>
  );
}
