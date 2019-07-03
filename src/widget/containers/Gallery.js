import React, { PureComponent } from 'react';
import { Image } from '../components';

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
    const { viewImage, images, folders } = this.props;
    const hideFooter = folders && folders.length < 1;

    return (
      <div className={`plugin__container ${hideFooter ? 'nopadding' : ''}`}>
        <div className="empty__state" />
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
