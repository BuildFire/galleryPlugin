import React, { Component } from 'react';
import { SortableList, Image } from '../components';

class ImageList extends Component {
  // constructor(props) {
  //   super(props);
  //   this.fid = Date.now() * Math.floor(Math.random() * 20 + 2);
  // }

  onReorder = e => {
    const { type, handleReorder } = this.props;
    handleReorder(e, type);
  };

  componentWillUnmount = () => {
    const { fid } = this.props;
    const frameExists = document.lazyLoadInstances && document.lazyLoadInstances[fid];
    if (frameExists) {
      document.lazyLoadInstances[fid] = null;
      delete document.lazyLoadInstances[fid];
    }
  };

  render() {
    const { fid, type, images, showImageDialog, removeImage, onClick } = this.props;
    return (
      <>
        <h1 className="title">Gallery</h1>
        <section className="image__grid">
          <button onClick={showImageDialog} className="btn btn--add" type="button">
            {type === 'gallery' ? 'Add Images' : 'Select Images'}
          </button>
          <SortableList fid={fid} group="grid" handleReorder={e => this.onReorder(e)}>
            {images
              && images.map(({ id, src }) => (
                <Image
                  key={id}
                  src={src}
                  fid={fid}
                  removeImage={removeImage}
                  type={type}
                  onClick={onClick}
                />
              ))}
          </SortableList>
        </section>
      </>
    );
  }
}

export default ImageList;
