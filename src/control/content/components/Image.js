import React, { PureComponent } from 'react';

export default class Image extends PureComponent {
  constructor(props) {
    super(props);
    this.placeholder = React.createRef();
    this.final = React.createRef();
  }

  handleClick = () => {
    const { onClick, src } = this.props;
    if (onClick) onClick(src);
  };

  handleRemove = () => {
    const { removeImage, src, type } = this.props;
    if (removeImage) removeImage(src, type);
  };

  componentDidMount = () => {
    this.final.current.onload = () => {
      this.placeholder.current.className = 'hidden';
      this.final.current.className = '';
    };
  };

  render() {
    const { src, selected, removeImage } = this.props;
    const placeholderSrc = `https://czi3m2qn.cloudimg.io/crop/100x100/q10/${src}`;
    const finalSrc = `https://czi3m2qn.cloudimg.io/crop/500x500/q100/${src}`;

    return (
      <div className={`image ${selected ? 'selected' : ''}`} onClick={this.handleClick}>
        <img ref={this.placeholder} src={placeholderSrc} alt="placeholder" />
        <img ref={this.final} src={finalSrc} className="hidden" alt="placeholder" />
        {removeImage && (
          <span className="btn btn--icon icon icon-cross2" onClick={this.handleRemove}>
            X
          </span>
        )}
      </div>
    );
  }
}
