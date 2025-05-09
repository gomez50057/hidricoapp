"use client";
import { useState } from 'react';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import './ProjectMap.css';

const MapSection = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
    const elem = document.getElementById("map");
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  return (
    <section className="mapaConte">
      <div id="map">
        <div id="fullscreenButton" onClick={toggleFullScreen}>
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </div>

        <iframe
          src="https://gomez50057.github.io/Plan-Hidrico-Metropolitano/"
          title="Mapa Interactivo"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          allowFullScreen
        />
      </div>

      <div className="mapaTxt">
      <h2><span>Huella Hídrica</span> <span className="spanDoarado">Dónde Estamos</span></h2>
        <p>Descubre nuestro mapa interactivo, donde podrás visualizar de manera dinámica las zonas de mayor estrés hídrico y sobreexplotación de acuíferos, junto con la infraestructura hidráulica existente —presas, pozos, plantas de tratamiento y ríos— y los principales cuerpos de agua. Además, identifica las áreas impactadas por la contaminación y conoce en detalle la situación de los acuíferos.</p>
        <p>Esta herramienta te acerca a la realidad hídrica de nuestra región, mostrando datos clave para impulsar soluciones y un futuro sostenible.</p>
      </div>
    </section>
  );
};

export default MapSection;
