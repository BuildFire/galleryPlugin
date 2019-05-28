import React, { PureComponent } from 'react';

export default class Image extends PureComponent {
  constructor(props) {
    super(props);
    this.placeholder = React.createRef();
    this.final = React.createRef();
  }

  openImage = () => {
    const { viewImage, image } = this.props;
    viewImage(image.src);
  };

  componentDidMount = () => {
    if (this.final.current && this.placeholder.current) {
      this.final.current.onload = () => {
        this.placeholder.current.className = 'hidden';
        this.final.current.className = '';
      };
    }
  };

  componentWillUnmount = () => {
    this.final.current.onload = () => {};
  };

  render() {
    const { image } = this.props;
    const { src, width } = image;

    const placeholderSrc = `https://czi3m2qn.cloudimg.io/crop/${Math.floor(width / 2)}x${Math.floor(width / 2)}/q10.fgaussian6/${src}`;
    const finalSrc = `https://czi3m2qn.cloudimg.io/crop/${width * window.devicePixelRatio}x${width * window.devicePixelRatio}/q100/${src}`;

    return (
      <div className="img__holder" onClick={this.openImage}>
        <img ref={this.placeholder} src={placeholderSrc} alt="placeholder" />
        <img ref={this.final} src={finalSrc} className="hidden" alt="placeholder" />
      </div>
    );
  }
}
