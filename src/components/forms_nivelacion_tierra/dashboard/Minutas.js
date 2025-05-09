"use client";

import { useState } from "react";
import styles from "./Minutas.module.css";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/Preview";
import { minutasData } from "@/utils/minutasData";

const Minutas = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Minutas <span>Metropolitanas</span></h2>
      <div className={styles.menu}>
        {minutasData.map((comision) => (
          <div key={comision.id} className={styles.menuItem}>
            <div
              className={styles.menuHeader}
              onClick={() => toggleMenu(comision.id)}
            >
              <div className={styles.containerTitle}>
                <img src={comision.img} alt={comision.title} className={styles.comisionImage} />
                <span>{comision.title}</span>
              </div>

              <div
                className={`${styles.arrow} ${openMenu === comision.id ? styles.open : ""
                  }`}
              ></div>
            </div>
            {/* Submenú con clase dinámica */}
            <ul className={`${styles.subMenu} ${openMenu === comision.id ? styles.open : ""}`} >
              {comision.acuerdos.map((acuerdo, index) => (
                <li key={index} className={styles.acuerdo}>
                  <div className={styles.acuerdoInfo}>
                    <span className={styles.nombre}>{acuerdo.nombre}</span>
                    <span className={styles.fecha}>{acuerdo.fecha}</span>
                  </div>
                  <div className={styles.icons}>
                    <a href={acuerdo.link} target="_blank" rel="noopener noreferrer" className={styles.iconLink} title="Visualizar" >
                      <PreviewIcon className={styles.icon} />
                    </a>
                    <a href={acuerdo.link} download className={styles.iconLink} title="Descargar" >
                      <DownloadIcon className={styles.icon} />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Minutas;
