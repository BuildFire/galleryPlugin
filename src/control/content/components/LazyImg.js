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

  optimizeImage = url => {
    const size = url.match(/\/\d+\D\d+\//g);
    if (!url.includes('cloudimg.io') || !size || /png-lossy-\d\d.q\d\d/g.test(url)) {
      return url;
    }
    return url.replace(/\/s\/crop\/\d+\D\d+\//g, `/crop${size[0]}png-lossy-65.q65.i1/`);
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
    const croppedSrc = imageLib.cropImage(src, { width: 125, height: 125 });
    const finalSrc = this.optimizeImage(croppedSrc);

    return (
      <div className={`image ${selected ? 'selected' : ''}`} onClick={this.handleClick}>
        <img
          src={fid ? placeholderSrc : finalSrc}
          alt={alt}
          className="lazy"
          data-src={finalSrc}
          data-srcset={srcset}
          data-sizes={sizes}
          data-fallbacksrc={croppedSrc}
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
