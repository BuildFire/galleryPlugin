import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';

export default class Image extends PureComponent {
  constructor(props) {
    super(props);
    this.observer = null;
    this.observerRef = React.createRef();
    this.placeholder = React.createRef();
    this.loading = React.createRef();
    this.final = React.createRef();
    this.state = {
      placeholderColor: '',
      loadingImgComplete: false,
      finalImgComplete: false
    };
  }

  openImage = () => {
    const { viewImage, image } = this.props;
    viewImage(image.src);
  };

  handleLoadingImgComplete = () => {
    this.setState(() => ({ loadingImgComplete: true }));
  };

  handleFinalImgComplete = () => {
    this.setState(() => ({ finalImgComplete: true }));
  };

  getPlaceholderColor = () => {
    const min = 100;
    const max = 200;

    const getColor = () => Math.floor(Math.random() * (max - min) + min);

    return `rgb(${getColor()},${getColor()},${getColor()})`;
  };

  componentWillUnmount = () => {
    if (this.final.current) this.final.current.onload = () => {};
    if (this.loading.current) this.loading.current.onload = () => {};
  };

  componentDidMount = () => {
    this.setState(() => {
      const placeholderColor = this.getPlaceholderColor();
      return { placeholderColor };
    });
  };

  render() {
    const { image } = this.props;
    const { loadingImgComplete, finalImgComplete, placeholderColor } = this.state;
    const { src, width } = image;

    // const loadingSrc = `https://czi3m2qn.cloudimg.io/crop/${Math.floor(width / 3)}x${Math.floor(width / 3)}/q10.fgaussian6.i1/${src}`;
    const finalSrc = `https://czi3m2qn.cloudimg.io/crop/${Math.floor(width * window.devicePixelRatio)}x${Math.floor(width * window.devicePixelRatio)}/q50.i1/${src}`;

    return (
      <div ref={this.observerRef} className="img__holder" onClick={this.openImage}>
        {!finalImgComplete && <div className="placeholder" style={{ background: placeholderColor }} />}
        <LazyLoad height={width} overflow offset={window.innerHeight} throttle={0}>
          {/* <img
            ref={this.loading}
            src={loadingSrc}
            alt="placeholder"
            onLoad={this.handleLoadingImgComplete}
          /> */}
          {/* {loadingImgComplete && ( */}
          <img
            ref={this.final}
            src={finalSrc}
            alt="placeholder"
            onLoad={this.handleFinalImgComplete}
          />
          {/* )} */}
        </LazyLoad>
      </div>
    );
  }
}
