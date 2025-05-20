import * as Yup from 'yup';

export const validationSchema = Yup.object({
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
  vale_riego_reciente_pdf: Yup.mixed()
    .required('Debe cargar un archivo PDF')
    .test('fileFormat', 'Solo se permite PDF', (value) => value && value.type === 'application/pdf')
    .test('fileSize', 'El archivo debe ser menor o igual a 10 MB', (value) => value && value.size <= FILE_SIZE_LIMIT),
  curso_sader: Yup.string().required('Campo obligatorio'),
  // cuando_toma_sader: Yup.string().when('curso_sader', (curso_sader, schema) => {
  //   if (curso_sader === 'no') {
  //     return schema.required('Especifique cuándo lo tomará');
  //   }
  //   if (curso_sader === 'si') {
  //     return schema.required('Carga la constancia');
  //   }
  // }),
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

export const validationSchemaEvaluador = Yup.object({
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
  porcentaje: Yup.number()
    .typeError('Debe ser un número')
    .max(40, 'No puede ser mayor a 40')
    .test(
      'maxTwoDecimals',
      'Sólo hasta 2 decimales',
      value =>
        value == null ||
        /^\d+(\.\d{1,2})?$/.test(value.toString())
    )
    .required('Campo obligatorio'),
  resolucion: Yup.string().required('Campo obligatorio'),
  // nombre_revisor: Yup.string().required('Campo obligatorio'),
  // firma_digital: Yup.string().required('Firma requerida'),
});