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
    this.width = (window.innerWidth / 3) - (0.125 * this.rem);
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
          <div className="grid grid--img grid--2">
            {images
              && images.map(image => {
                const { src } = image;
                const thumbnail = { src, height: this.width, width: this.width };
                return (
                  <Image image={thumbnail} viewImage={viewImage} />
                );
              })}
          </div>
        </section>
      </div>
    );
  }
}

export default Gallery;
