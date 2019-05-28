import React from 'react';

const PswpGallery = ({ shareImage }) => (
  <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
    <div className="pswp__bg" />

    <div className="pswp__scroll-wrap">
      <div className="pswp__container">
        <div className="pswp__item" />
        <div className="pswp__item" />
        <div className="pswp__item" />
      </div>

      <div className="pswp__ui pswp__ui--hidden">
        <div className="pswp__top-bar">
          <div className="pswp__counter" />

          <button className="pswp__button pswp__button--close" title="Close (Esc)" type="button" />

          <button
            className="pswp__button pswp__button--share"
            onClick={shareImage}
            onTouchStart={shareImage}
            title="Share"
            type="button"
          />

          <button
            className="pswp__button pswp__button--fs"
            title="Toggle fullscreen"
            type="button"
          />

          <button className="pswp__button pswp__button--zoom" title="Zoom in/out" type="button" />

          <div className="pswp__preloader">
            <div className="pswp__preloader__icn">
              <div className="pswp__preloader__cut">
                <div className="pswp__preloader__donut" />
              </div>
            </div>
          </div>
        </div>

        <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div className="pswp__share-tooltip" />
        </div>

        <button
          className="pswp__button pswp__button--arrow--left"
          title="Previous (arrow left)"
          type="button"
        />

        <button
          className="pswp__button pswp__button--arrow--right"
          title="Next (arrow right)"
          type="button"
        />

        <div className="pswp__caption">
          <div className="pswp__caption__center" />
        </div>
      </div>
    </div>
  </div>
);

export default PswpGallery;
