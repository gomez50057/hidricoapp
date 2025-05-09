'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Report.module.css';

const Report = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}/api/formularios/`)
      .then(response => {
        setReportData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching report data:', err);
        setError('Error al cargar los datos');
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>{error}</div>;
  if (!reportData.length) return <div>No hay datos disponibles.</div>;

  return (
    <div className={styles.reportContainer}>
      <h1>Reporte de Formularios de Nivelación</h1>
      {reportData.map((item) => (
        <div key={item.id} className={styles.card}>
          <h2>Folio: {item.folio}</h2>
          <p><strong>ID:</strong> {item.id}</p>
          <p>
            <strong>Nombre Completo:</strong> {item.nombre} {item.apellido_paterno} {item.apellido_materno}
          </p>
          <p><strong>CURP:</strong> {item.curp}</p>
          <p><strong>No. Cuenta CONAGUA:</strong> {item.cuenta_conagua}</p>
          <p><strong>Domicilio:</strong> {item.domicilio}</p>
          <p><strong>Identificación:</strong> {item.identificacion}</p>
          <p><strong>Teléfono:</strong> {item.telefono}</p>
          <p><strong>Municipio:</strong> {item.municipio}</p>
          <p><strong>Localidad:</strong> {item.localidad}</p>
          <p><strong>Distrito de Riego:</strong> {item.distrito_riego}</p>
          <p><strong>Módulo de Riego:</strong> {item.modulo_riego}</p>
          <p><strong>Superficie de Parcela:</strong> {item.superficie_parcela}</p>
          <p><strong>Tiempo Promedio de Riego:</strong> {item.tiempo_promedio_riego}</p>
          <p><strong>Latitud:</strong> {item.latitud}</p>
          <p><strong>Longitud:</strong> {item.longitud}</p>
          <p><strong>Grado de Pendiente:</strong> {item.grado_pendiente}</p>
          <p><strong>Pedregosidad:</strong> {item.pedregosidad}</p>
          <p><strong>Profundidad del Suelo:</strong> {item.profundidad_suelo}</p>
          <p><strong>Tamaño de la Canaleta:</strong> {item.tamano_canaleta}</p>
          <p><strong>Tipo de Revestimiento:</strong> {item.tipo_revestimiento}</p>
          <p><strong>Gasto en Canales:</strong> {item.gasto_canales}</p>
          <p><strong>Distancia de la Canaleta:</strong> {item.distancia_canaleta}</p>
          <p><strong>Tipo de Sección:</strong> {item.tipo_seccion}</p>
          <p><strong>Ha Nivelado:</strong> {item.ha_nivelado}</p>
          <p><strong>Año de Nivelación:</strong> {item.anio_nivelacion}</p>
          <p><strong>Problemas de Drenaje:</strong> {item.problemas_drenaje}</p>
          <p><strong>Cultivos Dominantes:</strong> {item.cultivos_dominantes}</p>
          <p><strong>Cultivo Actual:</strong> {item.cultivo_actual}</p>
          <p><strong>Perene Roturación:</strong> {item.perene_roturacion}</p>
          <p><strong>Fecha Libre de Parcela:</strong> {item.fecha_libre_parcela}</p>
          <p><strong>Acreditación de Propiedad:</strong> {item.acreditacion_propiedad}</p>
          <p><strong>Documento Presentado:</strong> {item.documento_presentado}</p>
          <p>
            <strong>Archivo PDF:</strong>{' '}
            <a href={item.archivo_pdf} target="_blank" rel="noopener noreferrer">
              Ver documento
            </a>
          </p>
          <p><strong>Curso Sader:</strong> {item.curso_sader}</p>
          <p><strong>Cuándo Toma Sader:</strong> {item.cuando_toma_sader}</p>
          <p>
            <strong>Firma Digital:</strong>
            {item.firma_digital && (
              <img src={item.firma_digital} alt="Firma Digital" className={styles.firmaImage} />
            )}
          </p>
          <p><strong>Fecha:</strong> {item.fecha}</p>
        </div>
      ))}
    </div>
  );
};

export default Report;
