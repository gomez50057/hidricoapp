'use client';

import React, { use, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NivelacionReporte from '@/components/forms_nivelacion_tierra/forms/tools/NivelacionReporte';


export default function ReportePage({ params }) {
  // params es Promise en client; unwrap con use()
  const { folio } = use(params);
  const sp = useSearchParams();

  useEffect(() => {
    if (sp.get('autoprint') === '1') {
      const t = setTimeout(() => window.print(), 800);
      return () => clearTimeout(t);
    }
  }, [sp]);

  return <NivelacionReporte folio={folio} logoSrc="https://bibliotecadigitaluplaph.hidalgo.gob.mx/img_banco/logo-uplah-sipdus.png" />;
}

