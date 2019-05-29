import React, { PureComponent } from 'react';

export default class Image extends PureComponent {
  constructor(props) {
    super(props);
    this.placeholder = React.createRef();
    this.loading = React.createRef();
    this.final = React.createRef();
    this.state = {
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

  componentWillUnmount = () => {
    this.final.current.onload = () => {};
    this.loading.current.onload = () => {};
  };

  render() {
    const { image } = this.props;
    const { loadingImgComplete } = this.state;
    const { src, width } = image;

    const loadingSrc = `https://czi3m2qn.cloudimg.io/crop/${Math.floor(width / 2)}x${Math.floor(width / 2)}/q20.fgaussian1/${src}`;
    const finalSrc = `https://czi3m2qn.cloudimg.io/crop/${Math.floor(width * window.devicePixelRatio)}x${Math.floor(width * window.devicePixelRatio)}/q100/${src}`;

    return (
      <div className="img__holder" onClick={this.openImage}>
        <img ref={this.placeholder} src="assets/placeholder.png" alt="placeholder" />
        <img ref={this.loading} src={loadingSrc} alt="placeholder" onLoad={this.handleLoadingImgComplete} />
        {loadingImgComplete && (
          <img ref={this.final} src={finalSrc} alt="placeholder" onLoad={this.handleFinalImgComplete} />
        )}
      </div>
    );
  }
}
