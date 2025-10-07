"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import styles from "./NivelacionReporte.module.css";

/**
 * Reporte de Nivelación (exportable a PDF vía window.print()).
 * - Usa el mismo endpoint que NivelacionDetalle.
 * - Oculta todo el resto de la página al imprimir y fuerza Letter landscape.
 * - Estructura en secciones con grids, evitando saltos feos con break-inside.
 */
export default function NivelacionReporte({
  folio,
  logoSrc = "/img/escudo-hidalgo.png", // opcional
  titulo = "Reporte de Nivelación de Tierra",
}) {
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState(null);
  const printRef = useRef(null);

  useEffect(() => {
    if (!folio) {
      setDetalle(null);
      return;
    }
    setError(null);
    setDetalle(null);

    axios
      .get(`/api/formularios/${folio}/`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => setDetalle(res.data))
      .catch((err) => {
        const data = err.response?.data;
        setError(data || err.message);
      });
  }, [folio]);

  const handlePrint = () => {
    // Simplemente dispara la impresión; las reglas @media print
    // se encargan de mostrar solo el reporte en Letter landscape.
    window.print();
  };


  const SINGLE_PAGE_MODE = false;

  useEffect(() => {
    if (!SINGLE_PAGE_MODE) return;
    
    const handleBeforePrint = () => {
      const inner = printRef.current;
      if (!inner) return;

      // .page es el contenedor físico 8.5x11in en print
      const container = inner.parentElement;
      const availW = container.clientWidth;   // ancho disponible (no forzamos llenado)
      const availH = container.clientHeight;  // alto disponible (sí llenamos)

      // Tamaño real del contenido sin escala
      const contentW = inner.scrollWidth;
      const contentH = inner.scrollHeight;

      // Escala objetivo: llenar ALTO
      const scaleH = availH / contentH;

      // Si al llenar alto, el ancho se pasa, capamos por ancho para evitar recorte
      const scaleWCap = availW / contentW;

      // Prioridad alto; limita por ancho si es necesario (no distorsiona)
      const scale = Math.min(scaleH, scaleWCap);

      inner.style.transformOrigin = 'top center';
      inner.style.transform = `scale(${scale})`;
    };

    const handleAfterPrint = () => {
      const inner = printRef.current;
      if (inner) inner.style.transform = '';
    };

    // Compatibilidad
    const mql = window.matchMedia('print');
    const mqlHandler = e => (e.matches ? handleBeforePrint() : handleAfterPrint());

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    if (mql.addEventListener) mql.addEventListener('change', mqlHandler);
    else if (mql.addListener) mql.addListener(mqlHandler);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      if (mql.removeEventListener) mql.removeEventListener('change', mqlHandler);
      else if (mql.removeListener) mql.removeListener(mqlHandler);
    };
  }, []);




  // useEffect(() => {
  //   if (!detalle) return;
  //   const sp = new URLSearchParams(window.location.search);
  //   if (sp.get('autoprint') === '1') {
  //     setTimeout(() => window.print(), 200);
  //   }
  // }, [detalle]);





  const format = (v, fallback = "N/A") => {
    if (v === null || v === undefined || v === "") return fallback;
    return String(v);
  };

  const formatBool = (v) => (v === true || v === "sí" || v === "Si" || v === "SI" ? "Sí" : v === false ? "No" : format(v));

  const googleMapsUrl = useMemo(() => {
    const lat = detalle?.latitud;
    const lng = detalle?.longitud;
    return lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;
  }, [detalle]);

  if (!folio) return null;

  if (error) {
    return (
      <div className={styles.errorBox}>
        <h3>Error</h3>
        <pre>{typeof error === "string" ? error : JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  if (!detalle) {
    return (
      <div className={styles.loading}>
        Cargando reporte del folio <strong>{folio}</strong>…
      </div>
    );
  }

  // Bloques para mapear en grillas
  const datosGenerales = [
    ["Nombre", detalle.nombre],
    ["Apellido paterno", detalle.apellido_paterno],
    ["Apellido materno", detalle.apellido_materno],
    ["CURP", detalle.curp],
    ["Domicilio", detalle.domicilio],
    ["Identificación", detalle.identificacion],
    ["Teléfono", detalle.telefono],
  ];

  const datosParcela = [
    ["Municipio", detalle.municipio],
    ["Localidad", detalle.localidad],
    ["Distrito de riego", detalle.distrito_riego],
    ["Módulo de riego", detalle.modulo_riego],
    ["Superficie parcela (ha)", detalle.superficie_parcela],
    ["No. cuenta CONAGUA", detalle.cuenta_conagua],
    ["Tiempo promedio de riego", detalle.tiempo_promedio_riego],
    ["Latitud", detalle.latitud],
    ["Longitud", detalle.longitud],
    ["Grado pendiente", detalle.grado_pendiente],
    ["Pedregosidad", detalle.pedregosidad],
    ["Profundidad de suelo", detalle.profundidad_suelo],
    [
      "Tamaño canaleta (cm)",
      detalle.tamano_canaleta_ancho && detalle.tamano_canaleta_alto
        ? `${detalle.tamano_canaleta_ancho} x ${detalle.tamano_canaleta_alto} (ancho x alto)`
        : "",
    ],
    ["Canaleta revestida", detalle.tipo_revestimiento],
    ["Gasto canales", detalle.gasto_canales],
    ["Distancia a canaleta revestida (m)", detalle.distancia_canaleta],
    ["Tipo de sección de canaleta", detalle.tipo_seccion],
    ["¿Ha nivelado?", formatBool(detalle.ha_nivelado)],
    ["Año de nivelación", detalle.anio_nivelacion || "N/A"],
    ["Problemas de drenaje", detalle.problemas_drenaje],
    ["Cultivos dominantes", detalle.cultivos_dominantes],
    ["Cultivo actual", detalle.cultivo_actual],
    [
      "Roturación este año",
      detalle.perene_roturacion !== undefined && detalle.perene_roturacion !== null
        ? formatBool(detalle.perene_roturacion)
        : "N/A",
    ],
    ["Fecha libre parcela", detalle.fecha_libre_parcela || "N/A"],
  ];

  const documentosYCap = [
    ["¿Acredita posesión/propiedad?", formatBool(detalle.acreditacion_propiedad)],
    ["Documento presentado", detalle.documento_presentado],
    ["Curso SADER", formatBool(detalle.curso_sader)],
  ];

  const documentosAdjuntos = [
    ["Certeza jurídica (PDF)", detalle.legal_propiedad_pdf],
    ["Identificación oficial (PDF)", detalle.identificacion_pdf],
    ["Comprobante de domicilio (PDF)", detalle.comprobante_domicilio_pdf],
    ["Vale de riego reciente (PDF)", detalle.vale_riego_reciente_pdf],
    ["Constancia (PDF)", detalle.constancia_pdf],
  ];

  return (
    <section className={styles.shell}>
      {/* Botonera (no se imprime) */}
      <div className={styles.toolbar + " " + styles.noPrint}>
        <button className={styles.printBtn} onClick={handlePrint} title="Descargar PDF">
          ⬇️ Descargar PDF
        </button>
      </div>

      {/* Contenido imprimible */}
      <div className={styles.page} aria-label="Reporte imprimible">
        <div className={styles.pageInner} ref={printRef}>
          {/* Encabezado */}
          <header className={styles.header}>
            <div className={styles.brand}>
              {logoSrc ? <img src={logoSrc} alt="Gobierno del Estado de Hidalgo" /> : null}
            </div>
            <div className={styles.headerText}>
              <h1 className={styles.title}>{titulo}</h1>
              <p className={styles.meta}>
                <strong>Folio:</strong> {format(detalle.folio)} &nbsp;|&nbsp;{" "}
                <strong>Fecha de registro:</strong> {format(detalle.fecha)}
              </p>
            </div>
            <div className={styles.watermark}>{format(detalle.folio)}</div>
          </header>
        </div>

        {/* Cédula */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cédula de Registro</h2>
          <div className={styles.gridTwo}>
            <Field label="Fecha de registro" value={detalle.fecha} />
            <Field label="Folio" value={detalle.folio} />
          </div>
        </section>

        {/* Datos generales */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Datos generales del solicitante</h2>
          <div className={styles.gridTwo}>
            {datosGenerales.map(([l, v], i) => (
              <Field key={i} label={l} value={v} />
            ))}
          </div>
        </section>

        {/* Datos de la parcela */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Datos de la parcela</h2>
          <div className={styles.gridTwo}>
            {datosParcela.map(([l, v], i) => (
              <Field key={i} label={l} value={v} />
            ))}
            {googleMapsUrl && (
              <Field
                label="Ver en Google Maps"
                value={
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Maps
                  </a>
                }
              />
            )}
          </div>
        </section>

        {/* Documentos y capacitaciones */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Documentos y capacitaciones</h2>
          <div className={styles.gridTwo}>
            {documentosYCap.map(([l, v], i) => (
              <Field key={i} label={l} value={v} />
            ))}
          </div>

          <div className={styles.attachments}>
            {documentosAdjuntos.map(([label, href], i) => (
              <Attachment key={i} label={label} href={href} />
            ))}
          </div>
        </section>

        {/* Firma digital */}
        {detalle.firma_digital && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Firma Digital</h2>
            <div className={styles.signatureBox}>
              <img
                src={detalle.firma_digital}
                alt="Firma Digital"
                className={styles.signatureImg}
              />
              <div className={styles.signatureLine} />
            </div>
          </section>
        )}

        {/* Pie de página (impresión) */}
        <footer className={styles.footer}>
          <span>Unidad de Planeación y Prospectiva — Gobierno del Estado de Hidalgo</span>
          <span>Generado: {new Date().toLocaleString()}</span>
        </footer>
      </div>
    </section >
  );
}

function Field({ label, value }) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}:</span>
      <span className={styles.value}>
        {value === 0 ? "0" : value ? value : "N/A"}
      </span>
    </div>
  );
}

function Attachment({ label, href }) {
  return (
    <div className={styles.attachment}>
      <span className={styles.attachmentLabel}>{label}:</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          Descargar
        </a>
      ) : (
        <span className={styles.na}>N/A</span>
      )}
    </div>
  );
}
