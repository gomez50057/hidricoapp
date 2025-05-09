"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import './UserOptionsModal.css';
import LogoutModal from './LogoutModal'; // Importar el componente de confirmación

const imgBasePath = "https://bibliotecadigitaluplaph.hidalgo.gob.mx/img_banco/";

const UserOptionsModal = ({ isOpen, onClose, anchorElement, username }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();  // Importar el router, pero solo lo usaremos en el cliente

  // Verificar si estamos en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true); // Solo marcamos el cliente cuando estamos seguros de que el componente está montado en el cliente
    }
  }, []);

  if (!isOpen || !anchorElement || !isClient) return null;

  const { top, left, height } = anchorElement.getBoundingClientRect();
  const modalStyle = {
    position: 'absolute',
    top: height + (window.scrollY > 0 ? 100 : 20),
    left: left + window.scrollX - 200,
    zIndex: 1000,
  };

  const handleLoginRedirect = () => {
    if (isClient) {
      router.push('/login');
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleFaqClick = () => {
    if (isClient) {
      router.push('/preguntas-frecuentes');
    }
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div className="profile-header">
            <img src={`${imgBasePath}estrella.webp`} alt="img_representativa" />
            <div className="profile-info">
              {username ? (
                <div className="username" style={{ cursor: 'pointer' }}>{username}</div>
              ) : (
                <div className="username" onClick={handleLoginRedirect} >
                  Inicia sesión primero
                </div>
              )}
            </div>
          </div>

          <div className="menu-item" onClick={handleFaqClick}>
            <HelpOutlineIcon />
            <span>Preguntas frecuentes</span>
          </div>

          {/* Bloques de enlaces con íconos */}
          <div className="menu-item small-screen-links" onClick={handleFaqClick}>
            <HelpOutlineIcon />
            <span><Link href="/integrantes/">Integrantes</Link></span>
          </div>

          <div className="menu-item small-screen-links" onClick={handleFaqClick}>
            <HelpOutlineIcon />
            <span><Link href="/noticias/">Noticias</Link></span>
          </div>

          <div className="menu-item small-screen-links" onClick={handleFaqClick}>
            <HelpOutlineIcon />
            <span><Link href="/login/">Acceder</Link></span>
          </div>

          <button
            className="logout-button"
            onClick={username ? handleLogoutClick : handleLoginRedirect}
          >
            <LogoutIcon />
            {username ? 'Finalizar la sesión' : 'Iniciar sesión'}
          </button>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={closeLogoutModal}
      />
    </>
  );
};

export default UserOptionsModal;
