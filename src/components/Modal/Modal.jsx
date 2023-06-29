import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import {
  Overlay,
  ModalWindow,
  ModalImage,
  ModalDescription,
} from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

// Refactoring code using React-Hooks
const Modal = ({ onClose, modalData }) => {
  const { largeImageURL, tags } = modalData;
  useEffect(() => {
    const handleKeyDown = event => {
      console.log('event.code:', event.code);
      if (event.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  // Виносимо модалку і рендеримо в портал для модалок в #modal-root
  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ModalWindow>
        <ModalImage src={largeImageURL} alt={tags} />
        <ModalDescription>{tags}</ModalDescription>
      </ModalWindow>
    </Overlay>,
    modalRoot
  );
};

Modal.propTypes = {
  modalData: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default Modal;
