'use client';

import SignatureCanvas from 'react-signature-canvas';
import { useRef, useState } from 'react';
import styles from './FirmaDigital.module.css';

const FirmaDigital = ({ setFieldValue }) => {
  const sigCanvas = useRef(null);
  const [mensaje, setMensaje] = useState('');

  const clear = () => {
    sigCanvas.current.clear();
    setFieldValue('firma_digital', '');
    setMensaje('Firma eliminada.');
    setTimeout(() => setMensaje(''), 3000);
  };

  const save = () => {
    if (sigCanvas.current.isEmpty()) {
      setMensaje('⚠️ La firma está vacía, no se puede guardar.');
    } else {
      const dataURL = sigCanvas.current.getCanvas().toDataURL('image/png');
      setFieldValue('firma_digital', dataURL);
      setMensaje('✅ Firma guardada con éxito.');
    }
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className={styles.signatureWrapper}>
      <div className={styles.containerSignatureWrapper}>
        <label>Firma Digital:</label>
        <SignatureCanvas
          penColor="black"
          canvasProps={{ className: styles.signatureCanvas }}
          ref={sigCanvas}
        />
      </div>

      <div className={styles.signatureControls}>
        <button type="button" onClick={clear} className={styles.button}>Limpiar</button>
        <button type="button" onClick={save} className={styles.button}>Guardar Firma</button>
      </div>

      {mensaje && <div className={styles.message}>{mensaje}</div>}
    </div>
  );
};

export default FirmaDigital;
