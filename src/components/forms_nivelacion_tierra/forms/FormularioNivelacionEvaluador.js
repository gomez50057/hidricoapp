'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import FirmaDigital from './componentsForm/FirmaDigital';
import styles from './FormNivelacion.module.css';
import AgreementSuccessModal from './AgreementSuccessModal';
import { identificacionOpciones, nivelesOpciones, gradoPendienteOpciones, profundidadSueloPedregosidad, resolucionOpciones, tipoSuelo } from '@/utils/utils';
import { validationSchemaEvaluador } from './validationSchema';
import NivelacionDetalle from './componentsForm/NivelacionDetalle';

const FormularioNivelacionEvaluador = () => {
  const [isModalOpenEvaluador, setIsModalOpenEvaluador] = useState(false);
  const [preSelectedFolio, setPreSelectedFolio] = useState('');
  const [updatedFolio, setUpdatedFolio] = useState('');

  // Obtener folio preseleccionado desde localStorage
  useEffect(() => {
    const storedFolio = localStorage.getItem('selectedFolio');
    if (storedFolio) {
      setPreSelectedFolio(storedFolio);
      localStorage.removeItem('selectedFolio');
    }
  }, []);

  const initialValues = {
    nivelacion: preSelectedFolio,
    area_atencion_prioritaria: '',
    convenio_colaboracion_pnh: '',
    pendiente_promedio: '',
    volumen_agua_anual: '',
    profundidad_suelo_pedregosidad: '',
    nivel_pedregosidad: '',
    acreditacion_propiedad: '',
    constancia_curso: '',
    tipo_suelo: '',
    resolucion: '',
    nombre_revisor: '',
    firma_digital: '',
  };

  const getCSRFToken = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (values, { resetForm }) => {
    console.log('🚀 Entrando a handleSubmit con valores:', values);

    if (!values.nivelacion) {
      alert('Error: No se encontró el folio seleccionado.');
      return;
    }

    const csrfToken = getCSRFToken();

    const payload = {
      ...values,
      nivelacion: values.nivelacion,  // Enviar directamente el folio
    };

    console.log('Payload enviado:', payload);

    try {
      const response = await axios.post('/api/archivos/', payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      setUpdatedFolio(response.data.folio);
      setIsModalOpenEvaluador(true);
      resetForm();
    } catch (error) {
      console.error('📛 Error al enviar el formulario evaluador:', error);
      if (error.response?.data) {
        console.error('Detalles del error del servidor:', error.response.data);
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Ocurrió un error al enviar el formulario.');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEvaluador(false);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemaEvaluador}
        onSubmit={handleSubmit}
        enableReinitialize // Permite que initialValues se actualicen al cambiar preSelectedFolio
      >
        {({ values, setFieldValue }) => (
          <>
            <NivelacionDetalle folio={values.nivelacion} />
            <Form className={styles.formWrapper}>
              <h1><span>Cédula</span> de <span className="spanDoarado">evaluación y dictamen</span></h1>
              
              <div className={styles.formGroup}>
                <h3 className={styles.inputField}>
                  {preSelectedFolio
                    ? `Cédula registro de solicitud del candidato (${preSelectedFolio})`
                    : 'No hay folio seleccionado'}
                </h3>
                <Field type="hidden" name="nivelacion" value={preSelectedFolio} />
                <ErrorMessage name="nivelacion" component="div" className={styles.errorMessage} />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>¿Se localiza en área de atención prioritaria?</label>
                  <Field as="select" name="area_atencion_prioritaria" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="area_atencion_prioritaria" component="div" className={styles.errorMessage} />
                </div>

                <div className={styles.formGroup}>
                  <label>¿El módulo de riego cuenta con convenio del PNH?</label>
                  <Field as="select" name="convenio_colaboracion_pnh" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="convenio_colaboracion_pnh" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Pendiente promedio</label>
                  <Field as="select" name="pendiente_promedio" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {gradoPendienteOpciones.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="pendiente_promedio" component="div" className={styles.errorMessage} />
                </div>

                <div className={styles.formGroup}>
                  <label>Volumen de agua promedio por año (m³)</label>
                  <Field name="volumen_agua_anual" type="number" className={styles.inputField} />
                  <ErrorMessage name="volumen_agua_anual" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Profundidad de suelo</label>
                  <Field as="select" name="profundidad_suelo_pedregosidad" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {profundidadSueloPedregosidad.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="profundidad_suelo_pedregosidad" component="div" className={styles.errorMessage} />
                </div>

                <div className={styles.formGroup}>
                  <label>Nivel de pedregosidad</label>
                  <Field as="select" name="nivel_pedregosidad" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {nivelesOpciones.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="nivel_pedregosidad" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Acreditación de la posesión o legal propiedad</label>
                  <Field as="select" name="acreditacion_propiedad" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="acreditacion_propiedad" component="div" className={styles.errorMessage} />
                </div>

                <div className={styles.formGroup}>
                  <label>¿Presenta constancia de curso de capacitación?</label>
                  <Field as="select" name="constancia_curso" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {identificacionOpciones.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="constancia_curso" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tipo de suelo (serie de suelos)</label>
                  <Field as="select" name="tipo_suelo" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {tipoSuelo.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="tipo_suelo" component="div" className={styles.errorMessage} />
                </div>

                <div className={styles.formGroup}>
                  <label>Resolución</label>
                  <Field as="select" name="resolucion" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {resolucionOpciones.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="resolucion" component="div" className={styles.errorMessage} />
                </div>

                <div className={styles.formGroup}>
                  <label>Nombre de quien revisó</label>
                  <Field name="nombre_revisor" className={styles.inputField} />
                  <ErrorMessage name="nombre_revisor" component="div" className={styles.errorMessage} />
                </div>
              </div>

              <FirmaDigital setFieldValue={setFieldValue} />

              <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>Enviar</button>
              </div>
            </Form>
          </>
        )}
      </Formik>

      <AgreementSuccessModal
        isOpen={isModalOpenEvaluador}
        folio={updatedFolio}
        estado="Guardado"
        mensaje="Cédula de evaluación y dictamen guardada con éxito"
        labelFolio=""
        labelGuardar=""
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default FormularioNivelacionEvaluador;
