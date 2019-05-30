import React, { PureComponent } from 'react';

export default class Image extends PureComponent {
  constructor(props) {
    super(props);
    // this.placeholderColor = '';
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
  }

  getPlaceholderColor = () => {
    const min = 100;
    const max = 200;

    const getColor = () => Math.floor(Math.random() * (max - min) + min);

    return `rgb(${getColor()},${getColor()},${getColor()})`;
  }

  componentWillUnmount = () => {
    this.final.current.onload = () => {};
    this.loading.current.onload = () => {};
  };

  componentDidMount = () => {
    this.setState(() => {
      const placeholderColor = this.getPlaceholderColor();
      return { placeholderColor };
    });
  }

  render() {
    const { image } = this.props;
    const { loadingImgComplete, finalImgComplete, placeholderColor } = this.state;
    const { src, width } = image;

    const loadingSrc = `https://czi3m2qn.cloudimg.io/crop/${Math.floor(width / 2)}x${Math.floor(width / 2)}/q20.fgaussian1/${src}`;
    const finalSrc = `https://czi3m2qn.cloudimg.io/crop/${Math.floor(width * window.devicePixelRatio)}x${Math.floor(width * window.devicePixelRatio)}/q100/${src}`;

    return (
      <div className="img__holder" onClick={this.openImage}>
        {(loadingImgComplete && finalImgComplete) || (
        <div className="placeholder" style={{ background: placeholderColor }} />
        )}
        <img ref={this.loading} src={loadingSrc} alt="placeholder" onLoad={this.handleLoadingImgComplete} />
        {loadingImgComplete && (
          <img ref={this.final} src={finalSrc} alt="placeholder" onLoad={this.handleFinalImgComplete} />
        )}
      </div>
    );
  }
}
