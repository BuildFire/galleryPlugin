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

  optimizeImage = url => {
    const size = url.match(/\/\d+\D\d+\//g);
    if (!url.includes('cloudimg.io') || !size || /png-lossy-\d\d.q\d\d/g.test(url)) {
      return url;
    }
    return url.replace(/\/s\/crop\/\d+\D\d+\//g, `/crop${size[0]}png-lossy-65.q65.i1/`);
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

    const croppedSrc = window.buildfire.imageLib.cropImage(src, { width: 125, height: 125 });
    const finalSrc = this.optimizeImage(croppedSrc);

    return (
      <div className="img__holder" onClick={this.openImage}>
        <LazyLoad height={125} overflow offset={window.innerHeight} throttle={0}>
          <img
            ref={this.image}
            src={finalSrc}
            data-fallbacksrc={croppedSrc}
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
