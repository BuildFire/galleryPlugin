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
    const { imageLib } = window.buildfire;

    const placeholderSrc = '../../../../../styles/media/holder-1x1.gif';
    const finalSrc = imageLib.cropImage(src, { width: 100, height: 100 });

    return (
      <div className={`image ${selected ? 'selected' : ''}`} onClick={this.handleClick}>
        <img ref={this.placeholder} src={placeholderSrc} alt="placeholder" />
        <img ref={this.final} src={finalSrc} className="hidden" alt="placeholder" />
        {removeImage && (
          <span className="btn btn--icon icon icon-cross2" onClick={this.handleRemove}>
          </span>
        )}
      </div>
    );
  }
}
