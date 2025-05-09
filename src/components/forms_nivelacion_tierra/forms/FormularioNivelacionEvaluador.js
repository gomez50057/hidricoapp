'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import FirmaDigital from './componentsForm/FirmaDigital';
import styles from './FormNivelacion.module.css';
import AgreementSuccessModal from './AgreementSuccessModal';
import { identificacionOpciones, nivelesOpciones, pendientePromedio, profundidadSueloPedregosidad, resolucionOpciones, tipoSuelo } from '@/utils/utils';
import NivelacionDetalle from './componentsForm/NivelacionDetalle';


const FormularioNivelacionEvaluador = () => {
  const [nivelaciones, setNivelaciones] = useState([]);
  const [isModalOpenEvaluador, setIsModalOpenEvaluador] = useState(false);
  const [preSelectedFolio, setPreSelectedFolio] = useState('');
  const [updatedFolio, setUpdatedFolio] = useState('');

  useEffect(() => {
    axios.get('/api/formularios/', {
      withCredentials: true,         // envía access_token en cookie HTTP-Only
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        setNivelaciones(res.data);
      })
      .catch(err => {
        console.error('Error cargando nivelaciones:', err);
      });
  }, []);

  // Al montar el componente, obtenemos el folio guardado en localStorage (si existe)
  useEffect(() => {
    const storedFolio = localStorage.getItem('selectedFolio');
    if (storedFolio) {
      setPreSelectedFolio(storedFolio);
      // Opcional: removerlo si solo se quiere usar una vez
      localStorage.removeItem('selectedFolio');
    }
  }, []);

  const initialValues = {
    nivelacion: preSelectedFolio, // Campo precargado con el folio si existe
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

  const validationSchema = Yup.object({
    nivelacion: Yup.string().required('Campo obligatorio'),
    area_atencion_prioritaria: Yup.string().required('Campo obligatorio'),
    convenio_colaboracion_pnh: Yup.string().required('Campo obligatorio'),
    pendiente_promedio: Yup.string().required('Campo obligatorio'),
    volumen_agua_anual: Yup.number().positive('Debe ser un número positivo').required('Campo obligatorio'),
    profundidad_suelo_pedregosidad: Yup.string().required('Campo obligatorio'),
    nivel_pedregosidad: Yup.string().required('Campo obligatorio'),
    acreditacion_propiedad: Yup.string().required('Campo obligatorio'),
    constancia_curso: Yup.string().required('Campo obligatorio'),
    tipo_suelo: Yup.string().required('Campo obligatorio'),
    resolucion: Yup.string().required('Campo obligatorio'),
    nombre_revisor: Yup.string().required('Campo obligatorio'),
    firma_digital: Yup.string().required('Firma requerida'),
  });

  const getCSRFToken = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (values, { resetForm }) => {
    console.log('🚀 Entrando a handleSubmit con valores:', values);
    try {
      const csrfToken = getCSRFToken(); // Token explícito
  
      const response = await axios.post(
        '/api/archivos/',
        values,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        }
      );
  
      const folio = response.data.folio;
      setUpdatedFolio(folio);
      setIsModalOpenEvaluador(true);
      resetForm();
    } catch (error) {
      console.error('📛 Error al enviar el formulario evaluador:', error);
      alert('Ocurrió un error al enviar el formulario.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEvaluador(false);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize // Permite que initialValues se actualicen al cambiar preSelectedFolio
      >
        {({ values, setFieldValue }) => (
          <>
            <NivelacionDetalle folio={values.nivelacion} />
            <Form className={styles.formWrapper}>
              <div className={styles.formGroup}>
                <label>Selecciona el formulario de nivelación</label>
                <Field as="select" name="nivelacion" className={styles.inputField}>
                  <option value="">Seleccione</option>
                  {nivelaciones.map(niv => (
                    <option key={niv.id} value={niv.folio}>
                      {niv.folio}
                    </option>
                  ))}
                </Field>
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
                    {pendientePromedio.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
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
                  <label>Profundidad de suelo y pedregosidad</label>
                  <Field as="select" name="profundidad_suelo_pedregosidad" className={styles.inputField}>
                    <option value="">Seleccione</option>
                    {profundidadSueloPedregosidad.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
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
        estado="Actualizado"
        mensaje="Formulario evaluador actualizado con éxito"
        labelFolio=""
        labelGuardar=""
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default FormularioNivelacionEvaluador;
