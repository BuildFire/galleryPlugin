import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';

export default class Image extends PureComponent {

  openImage = () => {
    const { viewImage, image } = this.props;
    viewImage(image.src);
  };

  // optimizeImage = url => {
  //   const size = url.match(/\/\d+\D\d+\//g);
  //   if (!url.includes('cloudimg.io') || !size || /png-lossy-\d\d.q\d\d/g.test(url)) {
  //     return url;
  //   }
  //   const compressionRatio = window.devicePixelRatio > 1 ? '40' : '65';
  //   return url.replace(
  //     /\/s\/crop\/\d+\D\d+\//g,
  //     `/crop${size[0]}png-lossy-${compressionRatio}.q${compressionRatio}.i1/`
  //   );
  // };

  render() {
    const { image } = this.props;
    const { src, width } = image;

    const croppedSrc = window.buildfire.imageLib.cropImage(src, { width, height: width });

    return (
      <div className="img__holder" onClick={this.openImage}>
        <LazyLoad height={width} overflow offset={window.innerHeight} throttle={0}>
          <img
            src={croppedSrc}
            alt="placeholder"
          />
        </LazyLoad>
        <img className="placeholder" src="../../../styles/media/holder-1x1.gif" alt="placeholder" />
      </div>
    );
  }
}
