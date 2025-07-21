'use client';

import { useEffect, useState } from 'react';
import NivelacionDetalle from '../componentsForm/NivelacionDetalle';

const FormularioNivelacionEvaluador = () => {
  const [preSelectedFolio, setPreSelectedFolio] = useState('');

  // Obtener folio preseleccionado desde localStorage
  useEffect(() => {
    const storedFolio = localStorage.getItem('selectedFolio');
    if (storedFolio) {
      setPreSelectedFolio(storedFolio);
      localStorage.removeItem('selectedFolio');
    }
  }, []);

  return (
    <>
      <NivelacionDetalle folio={preSelectedFolio} />
    </>
  );
};

export default FormularioNivelacionEvaluador;
