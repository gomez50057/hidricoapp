'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './Formulario.css';

import SectionTitle from './componentsForm/SectionTitle';
import FirmaDigital from './componentsForm/FirmaDigital';
import styles from './FormNivelacion.module.css';
import AgreementSuccessModal from './AgreementSuccessModal';
import MapaUbicacion from './componentsForm/MapaUbicacion';
import 'leaflet/dist/leaflet.css';

import {
  municipiosDeHidalgo,
  identificacionOpciones,
  identificacionOficialOpciones,
  distritosPorModulos,
  nivelesOpciones,
  gradoPendienteOpciones,
  profundidadSueloOpciones,
  tipoRevestimientoOpciones,
  gastoCanalesOpciones,
  tipoSeccionOpciones,
  productoSembrados,
  cultivosAnuales,
  documentosPresentados
} from '@/utils/utils';

// Componente auxiliar para actualizar campos y el estado de modulosFiltrados
const FormUpdater = ({ setFieldValue, setModulosFiltrados }) => {
  // Obtenemos los valores de Formik usando el hook useFormikContext
  const { values } = useFormikContext();

  useEffect(() => {
    // Actualiza modulosFiltrados según el distrito seleccionado
    setModulosFiltrados(distritosPorModulos[values.distrito_riego] || []);

    // Ajustar campos según condiciones
    if (values.ha_nivelado !== 'si') {
      setFieldValue('anio_nivelacion', 'No aplica');
    }
    if (values.cultivo_actual !== 'Alfalfa') {
      setFieldValue('perene_roturacion', 'No aplica');
    }
    if (!cultivosAnuales.includes(values.cultivo_actual)) {
      setFieldValue('fecha_libre_parcela', '');
    }
    if (values.curso_sader === 'si') {
      setFieldValue('cuando_toma_sader', 'No aplica');
    }
  }, [
    values.distrito_riego,
    values.ha_nivelado,
    values.cultivo_actual,
    values.curso_sader,
    setFieldValue,
    setModulosFiltrados
  ]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    axios.get('/api/csrf/')
      .then(() => console.log('✅ CSRF cookie establecida'))
      .catch(err => console.error('❌ Error obteniendo CSRF token:', err));
  }, []);

  return null; // No renderiza nada
};

const FormNivelacion = () => {
  const [modulosFiltrados, setModulosFiltrados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedFolio, setGeneratedFolio] = useState('');

  const initialValues = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    curp: '',
    cuenta_conagua: '',
    domicilio: '',
    identificacion: '',
    telefono: '',
    municipio: '',
    localidad: '',
    distrito_riego: '',
    modulo_riego: '',
    superficie_parcela: '',
    tiempo_promedio_riego: '',
    latitud: '',
    longitud: '',
    grado_pendiente: '',
    pedregosidad: '',
    profundidad_suelo: '',
    tamano_canaleta_ancho: '',
    tamano_canaleta_alto: '',
    tipo_revestimiento: '',
    gasto_canales: '',
    distancia_canaleta: '',
    tipo_seccion: '',
    ha_nivelado: '',
    anio_nivelacion: '',
    problemas_drenaje: '',
    cultivos_dominantes: '',
    cultivo_actual: '',
    perene_roturacion: '',
    fecha_libre_parcela: '',
    acreditacion_propiedad: '',
    documento_presentado: '',
    legal_propiedad_pdf: null,
    identificacion_pdf: null,
    comprobante_domicilio_pdf: null,
    curso_sader: '',
    constancia_pdf: null,
    cuando_toma_sader: '',
    firma_digital: '',
  };

  const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB en bytes

  const validationSchema = Yup.object({
    nombre: Yup.string().required('Campo obligatorio'),
    apellido_paterno: Yup.string().required('Campo obligatorio'),
    apellido_materno: Yup.string().required('Campo obligatorio'),
    curp: Yup.string()
      .length(18, 'CURP debe tener 18 caracteres')
      .required('Campo obligatorio'),
    cuenta_conagua: Yup.string().required('Campo obligatorio'),
    domicilio: Yup.string().required('Campo obligatorio'),
    telefono: Yup.string()
      .matches(/^\d{10}$/, 'Debe tener 10 dígitos numéricos')
      .required('Campo obligatorio'),
    municipio: Yup.string().required('Campo obligatorio'),
    superficie_parcela: Yup.number().positive('Debe ser positivo').required('Campo obligatorio'),
    tiempo_promedio_riego: Yup.number().positive().required('Campo obligatorio'),
    latitud: Yup.number()
      .typeError('Debe ser un número válido')
      .required('Campo obligatorio'),
    longitud: Yup.number()
      .typeError('Debe ser un número válido')
      .required('Campo obligatorio'),
    tamano_canaleta_ancho: Yup.number().min(0).required('Campo obligatorio'),
    tamano_canaleta_alto: Yup.number().min(0).required('Campo obligatorio'),
    gasto_canales: Yup.string().required('Campo obligatorio'),
    distancia_canaleta: Yup.number().min(0).required('Campo obligatorio'),
    tipo_seccion: Yup.string().required('Campo obligatorio'),
    legal_propiedad_pdf: Yup.mixed()
      .required('Debe cargar un archivo PDF')
      .test('fileFormat', 'Solo se permite PDF', (value) => value && value.type === 'application/pdf')
      .test('fileSize', 'El archivo debe ser menor o igual a 10 MB', (value) => value && value.size <= FILE_SIZE_LIMIT),
    identificacion_pdf: Yup.mixed()
      .required('Debe cargar un archivo PDF')
      .test('fileFormat', 'Solo se permite PDF', (value) => value && value.type === 'application/pdf')
      .test('fileSize', 'El archivo debe ser menor o igual a 10 MB', (value) => value && value.size <= FILE_SIZE_LIMIT),
    comprobante_domicilio_pdf: Yup.mixed()
      .required('Debe cargar un archivo PDF')
      .test('fileFormat', 'Solo se permite PDF', (value) => value && value.type === 'application/pdf')
      .test('fileSize', 'El archivo debe ser menor o igual a 10 MB', (value) => value && value.size <= FILE_SIZE_LIMIT),
    curso_sader: Yup.string().required('Campo obligatorio'),
    cuando_toma_sader: Yup.string().when('curso_sader', (curso_sader, schema) => {
      if (curso_sader === 'no') {
        return schema.required('Especifique cuándo lo tomará');
      }
      if (curso_sader === 'si') {
        return schema.required('Carga la constancia');
      }
    }),
    constancia_pdf: Yup.mixed().when('curso_sader', {
      is: 'si',
      then: (schema) =>
        schema
          .required('Debe cargar la constancia en PDF')
          .test('fileFormat', 'Solo se permite PDF', (value) => value && value.type === 'application/pdf'),
      otherwise: (schema) => schema.notRequired(),
    }),
    firma_digital: Yup.string().required('Firma requerida'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    console.log('🚀 Entrando a handleSubmit con valores:', values);

    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        // Evita incluir valores vacíos o "No aplica" para campos sensibles
        if (value === null || value === 'No aplica' || value === '') return;

        // Añade archivos correctamente
        if (
          key === 'legal_propiedad_pdf' ||
          key === 'identificacion_pdf' ||
          key === 'comprobante_domicilio_pdf' ||
          key === 'constancia_pdf'
        ) {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else {
          formData.append(key, value);
        }
      });

      const response = await axios.post('/api/formularios/',
        formData,
        {
          withCredentials: true, // envía cookies HTTP-Only
          // ¡OJO! No pongas aquí 'Content-Type', deja que Axios lo calcule con boundary
        }
      );

      const folio = response.data.folio;
      setGeneratedFolio(folio);
      setIsModalOpen(true);
      resetForm();

    } catch (error) {
      if (error.response) {
        console.error('📛 Error del servidor:', error.response.status);
        console.error('🧾 Detalles:', error.response.data);
        // Aquí podrías extraer errores de validación, por ejemplo:
      } else {
        console.error('⚠️ Error desconocido:', error);
      }
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGeneratedFolio('');
  };

  return (
    <div className={styles.formWrapper}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <>
            <Form>
              <SectionTitle title="Datos Personales" />
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre">Nombre:</label>
                  <Field name="nombre" className={styles.inputField} />
                  <ErrorMessage name="nombre" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="apellido_paterno">Apellido Paterno:</label>
                  <Field name="apellido_paterno" className={styles.inputField} />
                  <ErrorMessage name="apellido_paterno" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="apellido_materno">Apellido Materno:</label>
                  <Field name="apellido_materno" className={styles.inputField} />
                  <ErrorMessage name="apellido_materno" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="curp">CURP:</label>
                  <Field name="curp" className={styles.inputField} />
                  <ErrorMessage name="curp" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cuenta_conagua">No. cuenta CONAGUA:</label>
                  <Field name="cuenta_conagua" className={styles.inputField} />
                  <ErrorMessage name="cuenta_conagua" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="domicilio">Domicilio:</label>
                  <Field name="domicilio" className={styles.inputField} />
                  <ErrorMessage name="domicilio" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="identificacion">Identificación oficial:</label>
                  <Field as="select" name="identificacion" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOficialOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="identificacion" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="telefono">No. Telefónico:</label>
                  <Field name="telefono" className={styles.inputField} />
                  <ErrorMessage name="telefono" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <SectionTitle title="Datos de la parcela" />
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="municipio">Municipio:</label>
                  <Field as="select" name="municipio" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {municipiosDeHidalgo.map((mun) => (
                      <option key={mun} value={mun}>
                        {mun}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="municipio" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="localidad">Localidad:</label>
                  <Field name="localidad" className={styles.inputField} />
                  <ErrorMessage name="localidad" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="distrito_riego">Distrito de Riego:</label>
                  <Field as="select" name="distrito_riego" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {Object.keys(distritosPorModulos).map((distrito) => (
                      <option key={distrito} value={distrito}>
                        {distrito}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="distrito_riego" component="div" className={styles.errorMessage} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="modulo_riego">Módulo de Riego:</label>
                  <Field as="select" name="modulo_riego" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {modulosFiltrados.map((modulo) => (
                      <option key={modulo} value={modulo}>
                        {modulo}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="modulo_riego" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="superficie_parcela">Superficie de parcela (ha):</label>
                  <Field name="superficie_parcela" className={styles.inputField} />
                  <ErrorMessage name="superficie_parcela" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tiempo_promedio_riego">Tiempo promedio de riego (h):</label>
                  <Field name="tiempo_promedio_riego" className={styles.inputField} />
                  <ErrorMessage name="tiempo_promedio_riego" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Latitud</label>
                  <Field name="latitud" type="text" className={styles.inputField} />
                  <ErrorMessage name="latitud" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label>Longitud</label>
                  <Field name="longitud" type="text" className={styles.inputField} />
                  <ErrorMessage name="longitud" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Selecciona la ubicación en el mapa (opcional)</label>
                <MapaUbicacion setFieldValue={setFieldValue} />
              </div>


              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="grado_pendiente">Grado de Pendiente:</label>
                  <Field as="select" name="grado_pendiente" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {gradoPendienteOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="grado_pendiente" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="pedregosidad">Pedregosidad:</label>
                  <Field as="select" name="pedregosidad" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {nivelesOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="pedregosidad" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="profundidad_suelo">Profundidad del suelo:</label>
                  <Field as="select" name="profundidad_suelo" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {profundidadSueloOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="profundidad_suelo" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tipo_revestimiento">Tipo de revestimiento de canaleta:</label>
                  <Field as="select" name="tipo_revestimiento" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {tipoRevestimientoOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="tipo_revestimiento" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="tamano_canaleta_ancho">Ancho de la canaleta de riego en cm (zanja):</label>
                  <Field name="tamano_canaleta_ancho" type="number" min="0" className={styles.inputField} />
                  <ErrorMessage name="tamano_canaleta_ancho" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tamano_canaleta_alto">Alto de la canaleta de riego en cm (zanja):</label>
                  <Field name="tamano_canaleta_alto" type="number" min="0" className={styles.inputField} />
                  <ErrorMessage name="tamano_canaleta_alto" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="gasto_canales">Gasto en canales (lps):</label>
                  <Field as="select" name="gasto_canales" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {gastoCanalesOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="gasto_canales" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="distancia_canaleta">Distancia de parcela a la canaleta (m):</label>
                  <Field name="distancia_canaleta" type="number" min="0" className={styles.inputField} />
                  <ErrorMessage name="distancia_canaleta" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tipo_seccion">Tipo de sección:</label>
                  <Field as="select" name="tipo_seccion" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {tipoSeccionOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="tipo_seccion" component="div" className={styles.errorMessage} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="ha_nivelado">¿Ha realizado nivelación de tierra anteriormente?</label>
                  <Field as="select" name="ha_nivelado" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="ha_nivelado" component="div" className={styles.errorMessage} />
                </div>
                {values.ha_nivelado === 'si' && (
                  <div className={styles.formGroup}>
                    <label htmlFor="anio_nivelacion">¿En qué año?</label>
                    <Field as="select" name="anio_nivelacion" className={styles.inputField}>
                      <option value="">Seleccione</option>
                      {Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 1980 + i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="anio_nivelacion" component="div" className={styles.errorMessage} />
                  </div>
                )}
                <div className={styles.formGroup}>
                  <label htmlFor="problemas_drenaje">¿Su parcela presenta problemas de drenaje y/o salinidad?</label>
                  <Field as="select" name="problemas_drenaje" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="problemas_drenaje" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="cultivos_dominantes">Cultivos dominantes en la parcela:</label>
                  <Field as="select" name="cultivos_dominantes" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {productoSembrados.map((cultivo) => (
                      <option key={cultivo} value={cultivo}>
                        {cultivo}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="cultivos_dominantes" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cultivo_actual">¿Cultivo actual?</label>
                  <Field as="select" name="cultivo_actual" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {productoSembrados.map((cultivo) => (
                      <option key={cultivo} value={cultivo}>
                        {cultivo}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="cultivo_actual" component="div" className={styles.errorMessage} />
                </div>
                {['Alfalfa', 'Otros cultivos perennes'].includes(values.cultivo_actual) && (
                  <div className={styles.formGroup}>
                    <label htmlFor="perene_roturacion">
                      ¿Va a realizar trabajos de roturación (cambio del cultivo) en el presente año?
                    </label>
                    <Field as="select" name="perene_roturacion" className={styles.inputField}>
                      <option value="">Seleccione</option>
                      {identificacionOpciones.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="perene_roturacion" component="div" className={styles.errorMessage} />
                  </div>
                )}
                {cultivosAnuales.includes(values.cultivo_actual) && (
                  <div className={styles.formGroup}>
                    <label htmlFor="fecha_libre_parcela">¿En qué fecha estaría libre la parcela?</label>
                    <Field type="date" name="fecha_libre_parcela" className={styles.inputField} />
                    <ErrorMessage name="fecha_libre_parcela" component="div" className={styles.errorMessage} />
                  </div>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="acreditacion_propiedad">Acreditación de la posesión o legal propiedad del titular:</label>
                  <Field as="select" name="acreditacion_propiedad" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="acreditacion_propiedad" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="documento_presentado">Documento que presenta:</label>
                  <Field as="select" name="documento_presentado" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {documentosPresentados.map((doc) => (
                      <option key={doc.value} value={doc.value}>
                        {doc.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="documento_presentado" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <SectionTitle title="Carga de Documento y Firma" />
              <p>Solo se permiten archivos en formato PDF. Además, el tamaño de cada archivo adjunto no debe exceder los 10 MB por envío. Asegúrate de que los documentos cumplan con estos requisitos para evitar problemas al cargar el formulario. Si tus archivos superan este límite, te recomendamos reducir el tamaño de tus archivos antes de adjuntarlos</p>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="legal_propiedad_pdf">Certeza jurídica de la perecerla:</label>
                  <input
                    id="legal_propiedad_pdf"
                    name="legal_propiedad_pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      setFieldValue('legal_propiedad_pdf', event.currentTarget.files[0]);
                    }}
                    className={styles.inputField}
                  />
                  <ErrorMessage name="legal_propiedad_pdf" component="div" className={styles.errorMessage} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="identificacion_pdf">Identificación oficial:</label>
                  <input
                    id="identificacion_pdf"
                    name="identificacion_pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      setFieldValue('identificacion_pdf', event.currentTarget.files[0]);
                    }}
                    className={styles.inputField}
                  />
                  <ErrorMessage name="identificacion_pdf" component="div" className={styles.errorMessage} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="comprobante_domicilio_pdf">Comprobante de domicilio:</label>
                  <input
                    id="comprobante_domicilio_pdf"
                    name="comprobante_domicilio_pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      setFieldValue('comprobante_domicilio_pdf', event.currentTarget.files[0]);
                    }}
                    className={styles.inputField}
                  />
                  <ErrorMessage name="comprobante_domicilio_pdf" component="div" className={styles.errorMessage} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="curso_sader">¿Cuenta con curso de capacitación de SADER?</label>
                  <Field as="select" name="curso_sader" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="curso_sader" component="div" className={styles.errorMessage} />
                </div>
                {values.curso_sader === 'no' && (
                  <div className={styles.formGroup}>
                    <label htmlFor="cuando_toma_sader">¿Cuándo lo piensa tomar?</label>
                    <Field type="text" name="cuando_toma_sader" className={styles.inputField} />
                    <ErrorMessage name="cuando_toma_sader" component="div" className={styles.errorMessage} />
                  </div>
                )}

                {values.curso_sader === 'si' && (
                  <div className={styles.formGroup}>
                    <label htmlFor="constancia_pdf">Cargar constancia(solo PDF):</label>
                    <input
                      id="constancia_pdf"
                      name="constancia_pdf"
                      type="file"
                      accept="application/pdf"
                      onChange={(event) => {
                        setFieldValue('constancia_pdf', event.currentTarget.files[0]);
                      }}
                      className={styles.inputField}
                    />
                    <ErrorMessage name="constancia_pdf" component="div" className={styles.errorMessage} />
                  </div>
                )}
              </div>
              <FirmaDigital setFieldValue={setFieldValue} />
              <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>
                  Enviar Formulario
                </button>
              </div>
            </Form>
            {/* Inyectamos el FormUpdater para actualizar campos de forma reactiva */}
            <FormUpdater setFieldValue={setFieldValue} setModulosFiltrados={setModulosFiltrados} />
          </>
        )}
      </Formik>
      <AgreementSuccessModal
        isOpen={isModalOpen}
        folio={generatedFolio}
        estado="Enviado"
        mensaje="Formulario enviado con éxito"
        labelFolio="Este es tu Folio:"
        labelGuardar="Guarda este folio para mantener un seguimiento adecuado."
        handleClose={handleCloseModal}
      />
    </div>
  );
};

export default FormNivelacion;
