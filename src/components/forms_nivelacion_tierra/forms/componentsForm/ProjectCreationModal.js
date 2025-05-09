import React from 'react';
import styled from '@emotion/styled';
import Modal from 'react-modal';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

const StyledModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
  width: 50%;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
  border-radius: 35px;
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    margin-bottom: 20px;
    text-align: center;
  }
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background: #007bff;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
    &:hover {
      background: #0056b3;
    }
  }
`;

const globalModalStyles = css`
  .ReactModal__Overlay {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }
`;

const ProjectCreationModal = ({ isOpen, onRequestClose, projectId }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onRequestClose();
    navigate('/panel-usuario');
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      contentLabel="Proyecto Creado"
      css={globalModalStyles}
    >
      <h2>La operación fue exitosa</h2>
      <p>ID del Proyecto: {projectId}</p>
      <button onClick={handleClose}>He finalizado</button>
    </StyledModal>
  );
};

export default ProjectCreationModal;
