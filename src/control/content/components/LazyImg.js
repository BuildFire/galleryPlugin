import React, { PureComponent } from 'react';
import LazyLoad from 'vanilla-lazyload';

export default class Image extends PureComponent {
  componentDidUpdate() {
    const { fid } = this.props;
    const frameExists = document.lazyLoadInstances && document.lazyLoadInstances[fid];
    if (frameExists) document.lazyLoadInstances[fid].update();
  }

  handleClick = () => {
    const { onClick, id } = this.props;
    if (onClick) onClick(id);
  };

  handleRemove = () => {
    const { removeImage, type, id } = this.props;
    if (removeImage) removeImage(id, type);
  };

  handleImgError = e => {
    if (e.target) {
      e.target.src = e.target.attributes
        ? e.target.attributes['data-fallbacksrc'].value
        : '../../../styles/media/holder-1x1.png';
    }
  };

  componentDidMount = () => {
    const { fid } = this.props;
    if (!fid) return;

    const initLazyLoad = frameId => {
      document.lazyLoadInstances[frameId] = new LazyLoad({
        elements_selector: '.lazy',
        container: document.getElementById(frameId)
      });
    };

    if (!document.lazyLoadInstances) {
      document.lazyLoadInstances = {};
      initLazyLoad(fid);
    } else if (!document.lazyLoadInstances[fid]) {
      initLazyLoad(fid);
    } else {
      document.lazyLoadInstances[fid].update();
    }
  };

  render() {
    const { alt, src, srcset, sizes, fid, width, height, selected, removeImage } = this.props;
    const { imageLib } = window.buildfire;

    const placeholderSrc = '../../../../../styles/media/holder-1x1.gif';
    const croppedSrc = imageLib.cropImage(src, { width: 125, height: 125, compression: 65 });

    return (
      <div className={`image ${selected ? 'selected' : ''}`} onClick={this.handleClick}>
        <img
          src={fid ? placeholderSrc : croppedSrc}
          alt={alt}
          className="lazy"
          data-src={croppedSrc}
          data-srcset={srcset}
          data-sizes={sizes}
          data-fallbacksrc={src}
          width={width}
          height={height}
          onError={this.handleImgError}
        />
        {removeImage && (
          <span className="btn btn--icon icon icon-cross2" onClick={this.handleRemove} />
        )}
      </div>
    );
  }
}
