// 'use client';

import { React } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from './AgreementSuccessModal.module.css';

const AgreementSuccessModal = ({ isOpen, folio, estado, mensaje, labelFolio, labelGuardar, handleClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.styledModal}>
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
        <h2>{estado} con éxito!</h2>
        <p>{mensaje}</p>
        <p>{labelFolio} <strong>{folio}</strong></p>
        <p>{labelGuardar}</p>
      </div>
    </div>
  );
};

export default AgreementSuccessModal;
