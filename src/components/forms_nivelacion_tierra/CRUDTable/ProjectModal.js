import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import styles from './ProjectModal.module.css';
import EditFormulario from '../forms/FormularioNivelacionEvaluador';
import Evaluador from '../forms/FormularioNivelacionEvaluador';

const ProjectModal = ({ open, handleClose, projectId, mode }) => {
  if (!open) return null;

  const renderContent = () => {
    if (mode === 'edit') {
      return <EditFormulario projectId={projectId} onClose={handleClose} />;
    } else if (mode === 'evaluador') {
      return <Evaluador projectId={projectId} onClose={handleClose} />;
    }
    return null;
  };

  const parseStyledText = (text) => {
    const parts = text.split(/(\*{1,2}[^*]+\*{1,2})/g);
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
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <button
          onClick={handleClose}
          className={styles.closeButton}
        >
          <CloseIcon fontSize="large" style={{ color: 'var(--grisOsc)' }} />
        </button>
        <h2 className={styles.titulo}>
          {parseStyledText(
            mode === 'edit' ? 'Editar *Acuerdo*' : mode === 'evaluador' ? 'Revisar *Candidato*' : 'Historial de Actualizaciones'
          )}
        </h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProjectModal;
