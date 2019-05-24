import React, { Component } from 'react';

export class SortableList extends Component {
  constructor(props) {
    super(props);
    this.sortableRef = React.createRef();
    this.id = Date.now() + Math.floor(Math.random() * 10000);
  }

  componentDidMount = () => {
    const element = this.sortableRef.current;
    // const element = document.getElementById(this.id.toString());
    const { group, handleReorder } = this.props;
    this.sortable = new window.Sortable(element, {
      group,
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      onEnd: handleReorder
    });
  };

  render() {
    const { children, group } = this.props;
    return (
      <div ref={this.sortableRef} className={`carousel-items hide-empty draggable-list-view ${group}`}>
        {children}
      </div>
    );
  }
}

export const Modal = ({ show, children, toggle }) => (
  <div className={`modal .modal__container ${show ? 'show' : 'hide'}`} style={{ background: '#3333' }} onClick={toggle}>
    <div className="modal-dialog" role="document" onClick={e => e.stopPropagation()}>
      <div className="modal-content backgroundColorTheme">
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  </div>
);


export const Image = ({ src, selected, removeImage, onClick }) => {
  const handleClick = () => onClick && onClick(src);
  const handleRemove = () => removeImage && removeImage(src);
  return (
    <div className={`image ${selected ? 'selected' : ''}`} onClick={handleClick}>
      <span className="btn btn--icon icon icon-cross2" onClick={handleRemove}>X</span>
      <img src={src} alt="thumbnail" />
    </div>
  );
};


export const Input = ({ name, pattern, value, onChange, placeholder, showLabel }) => {
  let label = '';
  label += name[0].toUpperCase();
  label += name.slice(1);

  return (
    <div className="input--text label--horizontal">
      {showLabel ? <label htmlFor={name}>{label}*</label> : null}
      <input className="form-control" type="text" pattern={pattern} name={name} onChange={onChange} placeholder={placeholder || ''} value={value} />
    </div>
  );
};