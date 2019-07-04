import React, { PureComponent } from 'react';
import { Image, EmptyState } from '../components';

class Gallery extends PureComponent {
  // constructor(props) {
  // super(props);
  //  this.rem = window
  //   .getComputedStyle(document.body)
  //   .getPropertyValue('font-size')
  //   .replace('px', '');
  //  this.width = window.innerWidth / 3 - 0.125 * this.rem;
  // }

  componentDidMount = () => {
    const { clearFolder } = this.props;
    clearFolder();
  };

  render() {
    const { viewImage, images, showNav } = this.props;

    return (
      <div className={`plugin__container ${showNav ? '' : 'nopadding'}`}>
        {(!images || !images.length) && (
          <EmptyState />
        )}
        <section className="grid__group">
          <div className="grid grid--img grid--2">
            {images
              && images.map(image => {
                const { src, id } = image;
                const thumbnail = { src, height: 125, width: 125 };
                return <Image key={id} image={thumbnail} viewImage={viewImage} />;
              })}
          </div>
        </section>
      </div>
    );
  }
}

export default Gallery;
