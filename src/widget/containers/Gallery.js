import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazy-load';
import { Image } from '../components';

class Gallery extends PureComponent {
  constructor(props) {
    super(props);
    this.rem = window
      .getComputedStyle(document.body)
      .getPropertyValue('font-size')
      .replace('px', '');
    this.width = window.innerWidth / 3 - 0.125 * this.rem;
  }

  componentDidMount = () => {
    const { clearFolder } = this.props;
    clearFolder();
  };

  render() {
    const { viewImage, images } = this.props;
    return (
      <div className="plugin__container">
        <div className="empty__state" />
        <section className="grid__group">
          <div className="grid grid--img grid--1">
            {images
              && images.map(image => {
                const { src, height } = image;
                const thumbnail = { src, height, width: window.innerWidth / 3 };
                return (
                  <LazyLoad
                    key={image.id}
                    width={this.width}
                    height={this.width}
                    debounce
                    offsetVertical={window.innerHeight / 3}
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
