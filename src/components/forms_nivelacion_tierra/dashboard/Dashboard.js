"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Preloader from '../shared/Preloader';
import '../shared/Preloader.css';
import './Dashboard.css';
const imgIconos = "/planhidrico/img/forms nivelacion tierra/iconos/";
const img = "/planhidrico/img/forms nivelacion tierra/";

const DashboardCharts = dynamic(() => import('./DashboardCharts'), { loading: () => <Preloader />, ssr: false });
const Formulario = dynamic(() => import('../forms/FormNivelacion'), { loading: () => <Preloader />, ssr: false });
const TableEvaluar = dynamic(() => import('../CRUDTable/coordinador/CRUDTable'), { loading: () => <Preloader />, ssr: false });
const TablePresidentes = dynamic(() => import('../CRUDTable/enlace/TablePresidentes'), { loading: () => <Preloader />, ssr: false });
const Headerdashboard = dynamic(() => import('../dashboard/HeaderDashboard'), { loading: () => <Preloader />, ssr: false });
const SvgIcon = dynamic(() => import('../shared/SvgIcon'), { loading: () => <Preloader />, ssr: false });
const ConfirmationModal = dynamic(() => import('../shared/LogoutModal'), { loading: () => <Preloader />, ssr: false });

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn || !storedUserRole) {
      // No está logeado: redirigir
      window.location.href = '/planhidrico/login';
    } else {
      // Establecer el rol
      setUserRole(storedUserRole);
    }

    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach((item) => {
      item.addEventListener('click', () => {
        listItems.forEach((li) => li.classList.remove('active'));
        item.classList.add('active');
      });
    });

    const toggleBtn = document.querySelector('.toggle');
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.add('active');
    toggleBtn?.classList.add('active');
    toggleBtn.onclick = () => {
      toggleBtn.classList.toggle('active');
      sidebar.classList.toggle('active');
    };
  }, []);

  const handleMenuClick = (componentName) => {
    setActiveComponent(componentName);
    // Actualizar la clase active para el elemento del menú seleccionado
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach((li) => li.classList.remove('active'));
    document.querySelector(`[data-component=${componentName}]`)?.classList.add('active');
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsModalOpen(false);
    fetch(`${apiUrl}/api/logout/`, {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      window.location.href = '/planhidrico/login';
    });
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const renderContent = () => {
    switch (activeComponent) {
      case 'formulario': return <Formulario />;
      case 'tableEvaluar': return <TableEvaluar />;
      case 'tablePresidentes': return <TablePresidentes />;
      case 'dashboardCharts': return <DashboardCharts />;
      default: return <h1>DASHBOARD <span> Elige una opción de la barra de navegación lateral izquierda </span></h1>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar active">
        <div className="toggle active"></div>
        <ul className="list">
          {userRole === '2a' && (
            <li className="list-item" data-component="formulario" onClick={() => handleMenuClick('formulario')}>
              <b></b>
              <b></b>
              <a href="#" className="list-item-link">
                <div className="icon">
                  <SvgIcon name="formulario" />
                </div>
                <span className="title">Cedula</span>
              </a>
            </li>
          )}
          {userRole === '2b' && (
            <li className="list-item" data-component="tableEvaluar" onClick={() => handleMenuClick('tableEvaluar')}>
              <b></b>
              <b></b>
              <a href="#" className="list-item-link">
                <div className="icon">
                  <SvgIcon name="acuerdo" />
                </div>
                <span className="title">Patrón</span>
                <span className="sub-title">de solicitantes</span>
              </a>
            </li>
          )}
          {userRole === '2a' && (
            <li className="list-item" data-component="tablePresidentes" onClick={() => handleMenuClick('tablePresidentes')}            >
              <b></b>
              <b></b>
              <a href="#" className="list-item-link">
                <div className="icon">
                  <SvgIcon name="acuerdo" />
                </div>
                <span className="title">Patrón</span>
                <span className="sub-title">de solicitantes</span>
              </a>
            </li>
          )}
        </ul>

        <div className="sidebar-card">
          <div className="sidebarCardImg">
            <img src={`${img}sidebarRecurso.png`} alt="Icono de Cerrar Sesión" />
          </div>
          <button onClick={handleLogoutClick}>
            <img src={`${imgIconos}exit.png`} alt="Icono de Cerrar Sesión" className="icon" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        <Headerdashboard />
        <section className="content">
          {renderContent()}
        </section>
      </div>

      <ConfirmationModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirmLogout} />
    </div>
  );
}
