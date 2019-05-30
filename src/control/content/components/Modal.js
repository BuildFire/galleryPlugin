import React from 'react';

const Modal = ({ show, children, toggle }) => (
  <div className={`modal .modal__container ${show ? 'show' : 'hide'}`} style={{ background: 'rgba(255,255,255,.5)' }} onClick={toggle}>
    <div className="modal-dialog" role="document" onClick={e => e.stopPropagation()}>
      <div className="modal-content backgroundColorTheme">
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default Modal;
