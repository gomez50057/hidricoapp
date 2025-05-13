"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './NivelacionDetalle.module.css';

export default function NivelacionDetalle({ folio }) {
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState(null);

  // Carga datos del backend
  useEffect(() => {
    if (!folio) {
      setDetalle(null);
      return;
    }
    setError(null);
    setDetalle(null);
  
    axios
      .get(`/api/formularios/${folio}/`, {
        withCredentials: true,              // incluye access_token en la cookie
        headers: { 'Content-Type': 'application/json' },
      })
      .then(res => setDetalle(res.data))
      .catch(err => {
        // Si el backend devolvió JSON con errores, lo mostramos, si no, el mensaje genérico
        const data = err.response?.data;
        setError(data || err.message);
      });
  }, [folio]);
  
  // Manejo de estados
  if (!folio)   return null;
  if (error)    return <div className={styles.errorMessage}>Error: {JSON.stringify(error)}</div>;
  if (!detalle) return <div>Cargando detalles del folio <strong>{folio}</strong>...</div>;  

  return (
    <div className={styles.detailWrapper}>

      {/* Sección: Cédula de Registro */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Cédula de Registro {detalle.folio}</h3>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Fecha de registro:</span>
            <span className={styles.detailValue}>{detalle.fecha}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Folio:</span>
            <span className={styles.detailValue}>{detalle.folio}</span>
          </div>
        </div>
      </div>

      {/* Sección: Datos generales del solicitante */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Datos generales del solicitante</h3>
        <div className={styles.detailGrid}>
          {[
            ['Nombre', detalle.nombre],
            ['Apellido paterno', detalle.apellido_paterno],
            ['Apellido materno', detalle.apellido_materno],
            ['CURP', detalle.curp],
            ['Domicilio', detalle.domicilio],
            ['Identificación', detalle.identificacion],
            ['Teléfono', detalle.telefono],
          ].map(([label, value], i) => (
            <div key={i} className={styles.detailItem}>
              <span className={styles.detailLabel}>{label}:</span>
              <p className={styles.detailValue}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sección: Datos de la parcela */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Datos de la parcela</h3>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Municipio:</span>
            <p className={styles.detailValue}>{detalle.municipio}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Localidad:</span>
            <p className={styles.detailValue}>{detalle.localidad}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Distrito de riego:</span>
            <p className={styles.detailValue}>{detalle.distrito_riego}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Módulo de riego:</span>
            <p className={styles.detailValue}>{detalle.modulo_riego}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Superficie parcela (ha):</span>
            <p className={styles.detailValue}>{detalle.superficie_parcela}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>No. cuenta CONAGUA:</span>
            <p className={styles.detailValue}>{detalle.cuenta_conagua}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Tiempo promedio de riego (parcela):</span>
            <p className={styles.detailValue}>{detalle.tiempo_promedio_riego}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Latitud:</span>
            <p className={styles.detailValue}>{detalle.latitud}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Longitud:</span>
            <p className={styles.detailValue}>{detalle.longitud}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Ver en Google Maps:</span>
            <p className={styles.detailValue}>
              <a href={`https://www.google.com/maps?q=${detalle.latitud},${detalle.longitud}`} target="_blank" rel="noopener noreferrer">Maps</a>
            </p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Grado pendiente:</span>
            <p className={styles.detailValue}>{detalle.grado_pendiente}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Pedregosidad:</span>
            <p className={styles.detailValue}>{detalle.pedregosidad}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Profundidad de suelo:</span>
            <p className={styles.detailValue}>{detalle.profundidad_suelo}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Tamaño de la canaleta (cm):</span>
            <p className={styles.detailValue}>{detalle.tamano_canaleta_ancho} x {detalle.tamano_canaleta_alto} ancho-alto</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>canaleta revestida:</span>
            <p className={styles.detailValue}>{detalle.tipo_revestimiento}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Gasto canales:</span>
            <p className={styles.detailValue}>{detalle.gasto_canales}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Distancia de parcela a la canaleta revestida (m):</span>
            <p className={styles.detailValue}>{detalle.distancia_canaleta}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Tipo de sección de la canaleta:</span>
            <p className={styles.detailValue}>{detalle.tipo_seccion}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>¿Ha nivelado?</span>
            <p className={styles.detailValue}>{detalle.ha_nivelado}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Año de nivelación:</span>
            <p className={styles.detailValue}>{detalle.anio_nivelacion || 'N/A'}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Problemas de drenaje:</span>
            <p className={styles.detailValue}>{detalle.problemas_drenaje}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Cultivos dominantes:</span>
            <p className={styles.detailValue}>{detalle.cultivos_dominantes}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Cultivo actual:</span>
            <p className={styles.detailValue}>{detalle.cultivo_actual}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Se va realizar trabajos de roturación (cambio del cultivo) en el presente año:</span>
            <p className={styles.detailValue}>{detalle.perene_roturacion || 'N/A'}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Fecha libre parcela:</span>
            <p className={styles.detailValue}>{detalle.fecha_libre_parcela || 'N/A'}</p>
          </div>
        </div>

      </div>

      {/* Sección: Documentos y capacitaciones */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Documentos y capacitaciones</h3>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>¿Acredita la legal posesión o propiedad de la tierra?:</span>
            <p className={styles.detailValue}>{detalle.acreditacion_propiedad}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Documento presentado:</span>
            <p className={styles.detailValue}>{detalle.documento_presentado}</p>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Certeza jurídica de la perecerla:</span>
            {detalle.legal_propiedad_pdf ? (
              <a href={detalle.legal_propiedad_pdf} target="_blank" rel="noopener noreferrer">Descargar</a>
            ) : 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Identificación oficial:</span>
            {detalle.identificacion_pdf ? (
              <a href={detalle.identificacion_pdf} target="_blank" rel="noopener noreferrer">Descargar</a>
            ) : 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Comprobante de domicilio:</span>
            {detalle.comprobante_domicilio_pdf ? (
              <a href={detalle.comprobante_domicilio_pdf} target="_blank" rel="noopener noreferrer">Descargar</a>
            ) : 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Vale de riego reciente::</span>
            {detalle.vale_riego_reciente_pdf ? (
              <a href={detalle.vale_riego_reciente_pdf} target="_blank" rel="noopener noreferrer">Descargar</a>
            ) : 'N/A'}
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Curso SADER:</span>
            <p className={styles.detailValue}>{detalle.curso_sader}</p>
          </div>
          {/* <div className={styles.detailItem}>
            <span className={styles.detailLabel}>¿Cuándo tomó SADER?:</span>
            <p className={styles.detailValue}>{detalle.cuando_toma_sader || 'N/A'}</p>
          </div> */}
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Constancia PDF:</span>
            {detalle.constancia_pdf ? (
              <a href={detalle.constancia_pdf} target="_blank" rel="noopener noreferrer">Descargar</a>
            ) : 'N/A'}
          </div>
        </div>
      </div>


      {/* Sección: Firma Digital */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Firma Digital</h3>
        <div className={styles.detailItem}>
          <img
            src={detalle.firma_digital}
            alt="Firma Digital"
            className={styles.firmaImage}
          />
        </div>
      </div>
    </div>
  );
}
