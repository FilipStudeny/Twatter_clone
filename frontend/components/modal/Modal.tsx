import * as React from 'react';
import style from '../../styles/Modal.module.css';
import ReactDOM from 'react-dom';

interface ModalProps {
  title: string;
  show: boolean;
  onCancel: () => void;
  children: React.ReactNode;
}

const ModalOverlay: React.FC<ModalProps> = ({ title, show, onCancel, children }) => {
  const content = (
    <div className={style.modal}>
      <div className={style.modal_header}>
        <h2>{title}</h2>
        <button onClick={onCancel}>X</button>
      </div>
      <div className={style.modal_content}>{children}</div>
      <div className={style.modal_footer}></div>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById('modal-root')!);
};

const Modal: React.FC<ModalProps> = ({ title, show, onCancel, children }) => {
  return (
    <React.Fragment>
      {show && <div className={style.backdrop} onClick={onCancel}></div>}
      <ModalOverlay title={title} onCancel={onCancel} show={show} children={children} />
    </React.Fragment>
  );
};

export default Modal;
