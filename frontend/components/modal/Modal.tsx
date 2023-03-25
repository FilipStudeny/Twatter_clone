import * as React from 'react';
import style from '../../styles/Modal.module.css';
import ReactDOM from 'react-dom';

interface ModalProps {
    onCancel: () => void;
    children: React.ReactNode[] | React.ReactNode
}

const ModalOverlay: React.FC<ModalProps> = ({ onCancel, children }) => {
    const handleChildClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };
    
    const handleModalClick = () => {
        onCancel();
    };

    const content = (
        <div onClick={handleModalClick} className={style.ModalBackground}>
            <div className={style.Modal} onClick={handleChildClick}>
                {children}
            </div>
        </div>
        
    );

    return ReactDOM.createPortal(content, document.getElementById('modal')!);
};

const Modal: React.FC<ModalProps> = ({onCancel, children }: ModalProps) => {
  return (
    <React.Fragment>
        <ModalOverlay onCancel={onCancel}>
            {children}
        </ModalOverlay>
    </React.Fragment>
  );
};

export default Modal;
