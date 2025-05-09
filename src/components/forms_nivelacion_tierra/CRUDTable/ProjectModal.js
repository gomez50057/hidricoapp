import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
// import EditFormulario from '../forms/EditFormulario';
// import UpdateFormulario from '../forms/UpdateFormulario';
// import Report from '../forms/tools/Report';
// import AllAdvances from '@/components/shared/AllAdvances';
import styles from './ProjectModal.module.css';
import EditFormulario from '../forms/FormularioNivelacionEvaluador';

import Evaluador from '../forms/FormularioNivelacionEvaluador';

import CloseIcon from '@mui/icons-material/Close';

const style = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85%',
  height: '95%',
  borderRadius: '20px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflowX: 'hidden',
  overflowY: 'auto'
};

const ProjectModal = ({ open, handleClose, projectId, mode }) => {
  const renderContent = () => {
    // if (mode === 'edit') {
    //   return <EditFormulario projectId={projectId} onClose={handleClose} />;
    // } else if (mode === 'update') {
    //   return <UpdateFormulario projectId={projectId} onClose={handleClose} />;
    // } else if (mode === 'history') {
    //   return <HistoryList projectId={projectId} onClose={handleClose} />;
    // } else if (mode === 'advances') {
    //   return <AllAdvances projectId={projectId} onClose={handleClose} />;
    // }
    // return null;

    if (mode === 'edit') {
      return <EditFormulario projectId={projectId} onClose={handleClose} />;
    } else if (mode === 'evaluador') {
      return <Evaluador projectId={projectId} onClose={handleClose} />;
    } //else if (mode === 'history') {
    //   return <HistoryList projectId={projectId} onClose={handleClose} />;
    // } else if (mode === 'advances') {
    //   return <AllAdvances projectId={projectId} onClose={handleClose} />;
    // }
    return null;
  };

  const parseStyledText = (text) => {
    const parts = text.split(/(\*{1,2}[^*]+\*{1,2})/g); // Captura *...* o **...**
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const clean = part.slice(1, -1);
        return (
          <span key={index} className={styles.tituloSpan}>
            {clean}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <button
          onClick={handleClose}
          className="close-button"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <CloseIcon fontSize="large" style={{ color: 'var(--grisOsc)' }} />
        </button>

        <h2 id="modal-title" className={styles.titulo}>
          {parseStyledText(
            mode === 'edit' ? 'Editar *Acuerdo*' : mode === 'evaluador' ? 'Revisar *Candidato*' : 'Historial de Actualizaciones'
          )}
        </h2>
        {renderContent()}
      </Box>
    </Modal>
  );
};

export default ProjectModal;
