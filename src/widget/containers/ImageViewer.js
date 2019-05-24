import React, { PureComponent } from 'react';

// import Image from '../components';

// class ImageViewer extends PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       images: props.images,
//       index: props.index
//     };
//   }

//   nextImage = () => {
//     this.setState(state => {
//       let { index } = state;
//       index += 1;
//       return { index };
//     });
//   };

//   prevImage = () => {
//     this.setState(state => {
//       let { index } = state;
//       index -= 1;
//       return { index };
//     });
//   };

//   render() {
//     const { images, index } = this.state;
//     const image = images[index];
//     console.warn(image.src);

//     return (
//       <div className="modal show" tabIndex="-1" role="dialog">
//         <div className="modal-dialog" role="document">
//           <div className="modal-content">
//             <div className="modal-body">
//               <img src={image.src} alt="preview" />
//             </div>
//             <div className="modal-footer">
//               <button onClick={this.prevImage} className="btn btn-default" disabled={index < 1} type="button">Prev</button>
//               <button onClick={this.nextImage} className="btn btn-default" disabled={index === images.length - 1} type="button">Next</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default class ImageViewer extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.gallery = null;
//     this.state = {};
//   }

//   componentDidMount = () => {

//   }

//   render() {
//     return (
//       <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
//         <div className="pswp__bg" />

//         <div className="pswp__scroll-wrap">
//           <div className="pswp__container">
//             <div className="pswp__item" />
//             <div className="pswp__item" />
//             <div className="pswp__item" />
//           </div>

//           <div className="pswp__ui pswp__ui--hidden">
//             <div className="pswp__top-bar">
//               <div className="pswp__counter" />

//               <button
//                 className="pswp__button pswp__button--close"
//                 title="Close (Esc)"
//                 type="button"
//                 />

//               <button className="pswp__button pswp__button--share" title="Share" type="button" />

//               <button
//                 className="pswp__button pswp__button--fs"
//                 title="Toggle fullscreen"
//                 type="button"
//                 />

//               <button
//                 className="pswp__button pswp__button--zoom"
//                 title="Zoom in/out"
//                 type="button"
//                 />

//               <div className="pswp__preloader">
//                 <div className="pswp__preloader__icn">
//                   <div className="pswp__preloader__cut">
//                     <div className="pswp__preloader__donut" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
//               <div className="pswp__share-tooltip" />
//             </div>

//             <button
//               className="pswp__button pswp__button--arrow--left"
//               title="Previous (arrow left)"
//               type="button"
//               />

//             <button
//               className="pswp__button pswp__button--arrow--right"
//               title="Next (arrow right)"
//               type="button"
//               />

//             <div className="pswp__caption">
//               <div className="pswp__caption__center" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default ImageViewer;

const ImageViewer = ({ shareImage }) => (
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
          {/* <button className="pswp__button icon-share2" title="Share" type="button" /> */}

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

export default ImageViewer;
