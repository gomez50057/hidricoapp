import React from 'react';
import ReactDOM from 'react-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from './AgreementSuccessModal.module.css';

const AgreementSuccessModal = ({ isOpen, folio, estado, mensaje, labelFolio, labelGuardar, handleClose }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.overlay}>
      <div className={styles.styledModal}>
        <div className={styles.containerClose}>
          <IconButton
            onClick={() => {
              handleClose();
              window.location.reload();
            }}
            className={styles.closeButton}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>

        <h2>{estado} con éxito!</h2>
        <p>{mensaje}</p>
        <p>{labelFolio} <strong>{folio}</strong></p>
        <p>{labelGuardar}</p>
      </div>
    </div>
  );

  // Renderiza fuera del flujo del componente padre
  return ReactDOM.createPortal(modalContent, document.body);
};

export default AgreementSuccessModal;
