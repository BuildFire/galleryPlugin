import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazy-load';
import { Image } from '../components';


class Gallery extends PureComponent {
  constructor(props) {
    super(props);
    const { scale } = this.props;
    this.gridRef = React.createRef();
    this.rem = window
      .getComputedStyle(document.body)
      .getPropertyValue('font-size')
      .replace('px', '');
    this.state = {
      width: (window.innerWidth / Math.abs(scale - 5)) - (0.125 * this.rem)
    };
  }

  componentDidMount = () => {
    const { clearFolder } = this.props;
    clearFolder();
  };

  componentDidUpdate = () => {
    const { scale } = this.props;
    this.setState(() => {
      const width = (window.innerWidth / Math.abs(scale - 5)) - (0.125 * this.rem);
      return { width };
    });
  }

  render() {
    const { viewImage, images, scale } = this.props;
    const { width } = this.state;
    return (
      <div className="plugin__container">
        <div className="empty__state" />
        <section className="grid__group">
          <div className={`grid grid--img grid--${scale}`}>
            {images
              && images.map(image => {
                const { src } = image;
                const thumbnail = { src, height: width, width };
                return (
                  <LazyLoad
                    key={image.id}
                    width={width}
                    height={width}
                    debounce
                    throttle={0}
                  >
                    <Image image={thumbnail} viewImage={viewImage} />
                  </LazyLoad>
                );
              })}
          </div>
        </section>
      </div>
    );
  }
}

export default Gallery;
