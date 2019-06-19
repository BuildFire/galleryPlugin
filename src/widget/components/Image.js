import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';

export default class Image extends PureComponent {
  constructor(props) {
    super(props);
    this.placeholder = React.createRef();
    this.loading = React.createRef();
    this.final = React.createRef();
    // this.state = { placeholderColor: '' };
  }

  openImage = () => {
    const { viewImage, image } = this.props;
    viewImage(image.src);
  };

  // getPlaceholderColor = () => {
  //   const min = 100;
  //   const max = 200;

  //   const getColor = () => Math.floor(Math.random() * (max - min) + min);

  //   return `rgba(${getColor()}, ${getColor()}, ${getColor()}, .25)`;
  // };

  optimizeImage = url => {
    const size = url.match(/\/\d+\D\d+\//g);
    if (!url.includes('cloudimg.io') || !size || /png-lossy-\d\d.q\d\d/g.test(url)) {
      return url;
    }
    const compressionRatio = window.devicePixelRatio > 1 ? '40' : '65';
    return url.replace(
      /\/s\/crop\/\d+\D\d+\//g,
      `/crop${size[0]}png-lossy-${compressionRatio}.q${compressionRatio}.i1/`
    );
  };

  componentWillUnmount = () => {
    if (this.final.current) this.final.current.onload = () => {};
    if (this.loading.current) this.loading.current.onload = () => {};
  };

  // componentDidMount = () => {
  //   this.setState(() => {
  //     const placeholderColor = this.getPlaceholderColor();
  //     return { placeholderColor };
  //   });
  // };

  render() {
    const { image } = this.props;
    // const { placeholderColor } = this.state;
    const { src, width } = image;

    const croppedSrc = window.buildfire.imageLib.cropImage(src, { width, height: width });
    const finalSrc = this.optimizeImage(croppedSrc);

    return (
      <div ref={this.observerRef} className="img__holder" onClick={this.openImage}>
        <LazyLoad height={width} overflow offset={window.innerHeight} throttle={0}>
          <img
            ref={this.final}
            src={finalSrc}
            alt="placeholder"
            onLoad={this.handleFinalImgComplete}
          />
        </LazyLoad>
        {/* <div className="placeholder" style={{ background: placeholderColor }} /> */}
        <img className="placeholder" src="../../../styles/media/holder-1x1.gif" alt="placeholder" />
      </div>
    );
  }
}
