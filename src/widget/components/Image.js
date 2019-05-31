import React, { PureComponent } from 'react';

export default class Image extends PureComponent {
  constructor(props) {
    super(props);
    this.observer = null;
    this.observerRef = React.createRef();
    this.placeholder = React.createRef();
    this.loading = React.createRef();
    this.final = React.createRef();
    this.state = {
      isIntersecting: false,
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
    this.observer = new IntersectionObserver(entries => {
      const { isIntersecting } = entries[0];
      this.setState({ isIntersecting });
    });
    
    this.observer.observe(this.observerRef.current);
    this.setState(() => {
      const placeholderColor = this.getPlaceholderColor();
      return { placeholderColor };
    });
  }

  componentDidUpdate = () => console.warn(this.state)

  render() {
    const { image } = this.props;
    const { loadingImgComplete, finalImgComplete, placeholderColor, isIntersecting } = this.state;
    const { src, width } = image;

    const loadingSrc = `https://czi3m2qn.cloudimg.io/crop/${Math.floor(width / 2)}x${Math.floor(width / 2)}/q20.fgaussian1/${src}`;
    const finalSrc = `https://czi3m2qn.cloudimg.io/crop/${Math.floor(width * window.devicePixelRatio)}x${Math.floor(width * window.devicePixelRatio)}/q100/${src}`;

    return (
      <div ref={this.observerRef} className="LazyLoad img__holder" onClick={this.openImage}>
        {(loadingImgComplete && finalImgComplete) || (
        <div className="placeholder" style={{ background: placeholderColor }} />
        )}
        {isIntersecting && <img ref={this.loading} src={loadingSrc} alt="placeholder" onLoad={this.handleLoadingImgComplete} />}
        {isIntersecting && loadingImgComplete && (
          <img ref={this.final} src={finalSrc} alt="placeholder" onLoad={this.handleFinalImgComplete} />
        )}
      </div>
    );
  }
}
