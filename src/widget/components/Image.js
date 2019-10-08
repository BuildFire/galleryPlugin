import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';

export default class Image extends PureComponent {
  constructor(props) {
    super(props);
    this.image = React.createRef();
    this.placeholder = React.createRef();
  }

  openImage = () => {
    const { viewImage, image } = this.props;
    viewImage(image.src);
  };

  handleImgError = e => {
    if (e.target) {
      e.target.src = e.target.attributes
        ? e.target.attributes['data-fallbacksrc'].value
        : '../../../styles/media/holder-1x1.png';
    }
  };

  handleOnLoad = () => {
    if (this.placeholder.current) {
      this.placeholder.current.style.display = 'none';
    }
  };

  componentWillUnmount = () => {
    if (this.image.current) this.image.current.onLoad = () => {};
  };

  render() {
    const { image } = this.props;
    const { src } = image;

    const croppedSrc = window.buildfire.imageLib.cropImage(src, {
      width: 125,
      height: 125,
      compression: 65
    });

    return (
      <div className="img__holder" onClick={this.openImage}>
        <LazyLoad height={125} overflow offset={window.innerHeight} throttle={0}>
          <img
            ref={this.image}
            src={croppedSrc}
            data-fallbacksrc={src}
            alt="placeholder"
            onError={this.handleImgError}
            onLoad={this.handleOnLoad}
          />
        </LazyLoad>
        <img
          ref={this.placeholder}
          className="placeholder"
          src="../../../styles/media/holder-1x1.gif"
          alt="placeholder"
        />
      </div>
    );
  }
}
