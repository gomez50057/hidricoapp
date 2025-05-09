import * as Yup from 'yup';

const validationSchema = Yup.object({
  nombre: Yup.string()
    .required('El nombre es obligatorio'),
  descripcion: Yup.string()
    .required('La descripción es obligatoria'),
  nombre_contacto: Yup.string()
    .required('El nombre de contacto es obligatorio'),
  numero_contacto: Yup.string()
    .required('El número de contacto es obligatorio')
    .matches(/^\d{10}$/, 'El número de contacto debe contener exactamente 10 dígitos sin espacios'),
  extension: Yup.string()
    .transform(value => (value === '' ? undefined : value))
    .matches(/^\d{1,5}$/, 'La extensión debe contener solo dígitos y no puede exceder 5 caracteres')
    .notRequired(),
  // La carga de archivos no es obligatoria; se valida su tipo en el componente
});

export default validationSchema;
