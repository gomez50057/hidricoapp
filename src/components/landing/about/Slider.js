"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ejesPlanEstatal } from '../../../utils/planEstal';
import styles from './Slider.module.css';
const imgBasePath = "/img/";

gsap.registerPlugin(ScrollTrigger);

const SingleSlider = ({ items }) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!containerEl || !wrapper) return;

    const containerWidth = containerEl.offsetWidth;
    const wrapperWidth = wrapper.scrollWidth;
    const offset = 1000;

    const initialX = containerWidth - offset;
    const finalX = containerWidth - wrapperWidth - offset;

    gsap.set(wrapper, { x: initialX });

    gsap.to(wrapper, {
      x: finalX,
      ease: 'none',
      scrollTrigger: {
        trigger: containerEl,
        start: 'center center',
        pin: true,
        scrub: 1,
        end: () => `+=${wrapperWidth}`,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [items]);

  return (
    <div className={styles.sliderContainer} ref={containerRef}>
      <div className={styles.row}>
        <div className={styles.wrapper} ref={wrapperRef}>

          <div className={styles.logoAcuerdo}></div>
          <div className={styles.titule}>
            <h2>Un <span>Plan</span> para el <span className="spanDoarado">Futuro de Hidalgo</span></h2>
            <p>Construido Contigo</p>
          </div>

          <div className={styles.element}>
            <div className={styles.imgBackContainer}>
              <div className={styles.backgroundShape}></div>
              <div className={styles.imgContainer}>
                <Image src={`${imgBasePath}eje2.png`} alt="prueba" width={600} height={100} objectFit="contain" />
              </div>
            </div>
            <div className={styles.text}>
              <h2>¿Qué es el Plan Hídrico Metropolitano de Hidalgo?</h2>
              <p>Es un conjunto de estrategias, políticas y acciones destinadas gestionar , proteger y  garantizar el acceso equitativo y sustentable al agua, buscando corregir desigualdades históricas en la distribución del recurso hídrico, priorizando su uso para consumo humano, especialmente en comunidades vulnerables, a través de la modernización de la infraestructura hídrica como son los sistemas de riego, tratamiento y uso de aguas residuales, promoviendo una gestión más eficiente y transparente frente a los desafíos del cambio climático y la sobreexplotación de acuíferos.</p>
              <div className={styles.line}></div>
            </div>
          </div>

          <div className={styles.element}>
            <div className={styles.fileShapeL}>
              <h2 className={styles.title}>Objetivos Generales</h2>
              <div className={styles.cardElement02}>
                <div className={styles.item}>
                  <span className={styles.textElement02}>Implementar una gestión integral y sostenible del recurso hídrico en la región metropolitana de Hidalgo, asegurando la disponibilidad y calidad del agua para consumo humano, agrícola, industrial y ambiental</span>
                </div>
              </div>
            </div>
            <div className={styles.imgContainerElement02}>
              <Image src={`${imgBasePath}objetivos.png`} alt="prueba" width={600} height={100} objectFit="contain" />
            </div>
            <div className={styles.fileShapeR}>
              <h2 className={styles.title}>Objetivos Específicos</h2>
              <div className={styles.cardElement02}>
                <div className={styles.item}>
                  <span className={styles.circle}></span>
                  <span className={styles.textElement02}>Incrementar la productividad en los
                    cultivos.</span>
                </div>
                <div className={styles.separator}></div>
                <div className={styles.item}>
                  <span className={styles.circle}></span>
                  <span className={styles.textElement02}>Reconversión de cultivos.</span>
                </div>
                <div className={styles.separator}></div>
                <div className={styles.item}>
                  <span className={styles.circle}></span>
                  <span className={styles.textElement02}>Concluir y consolidar la transferencia de
                    los distritos de riego.</span>
                </div>
                <div className={styles.separator}></div>
                <div className={styles.item}>
                  <span className={styles.circle}></span>
                  <span className={styles.textElement02}>Garantizar el acceso al agua potable mediante la construcción y modernización de infraestructura hidráulica </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.element}>
            {/* <div className={styles.imgContainerJustificacion}>
              <Image src={`${imgBasePath}eje2.png`} alt="prueba" width={600} height={100} objectFit="contain" />
            </div> */}
            <div className={styles.imgContainerElement03}>
              <Image src={`${imgBasePath}justificacion.png`} alt="prueba" width={600} height={100} objectFit="contain" />
            </div>
            <div className={styles.textJustificacion}>
              <h2><span className="spanVino">Justificación</span> </h2>
              <h3><span>Agua Segura, Futuro Seguro: Por un Hidalgo Sustentable y Próspero</span></h3>
              <p>En Hidalgo, el agua no solo es un recurso esencial; es la base para el bienestar social, el desarrollo económico y la protección del medio ambiente. El crecimiento poblacional, la actividad agrícola e industrial, y los efectos del cambio climático han incrementado la presión sobre nuestros recursos hídricos, poniendo en riesgo su disponibilidad y calidad a largo plazo.</p>
              <p>El Plan Hídrico Metropolitano surge como una respuesta estratégica y urgente a estas necesidades. Este plan asegura agua potable para miles de familias, protege comunidades contra inundaciones, mejora el saneamiento y fortalece la producción agrícola mediante tecnologías innovadoras de riego.</p>
            </div>
          </div>


          {/* {items.map((item, index) => (
            <div
              key={item.id || index}
              className={styles.slide}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.text}>
                <h2>{formatText(item.name)}</h2>
                <p>{formatText(item.description)}</p>
              </div>
              <div className={styles.imgContainer}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={600}
                  height={100}
                  objectFit="contain"
                />
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div >
  );
};

SingleSlider.propTypes = {
  items: PropTypes.array.isRequired,
};

const Slider = () => {
  return <SingleSlider items={ejesPlanEstatal} />;
};

export default Slider;
