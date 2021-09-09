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
        <h1 className="title margin-bottom-lg">{type === 'gallery' ? 'Gallery' : 'Images'}</h1>
        <p className="info-note">Add images to create a gallery and organize it with folders. You can drag and drop images on the image grid to rearrange their order.</p>
        <section className="image__grid">
          <button onClick={showImageDialog} className="btn btn-success btn-add" type="button">
            {type === 'gallery' ? 'Add Images' : 'Add Images'}
          </button>
          {!images || images.length === 0 ? <div style={{flexGrow: 1, marginLeft: '10px'}} className="empty-state"><h4>You haven't added any images</h4></div> : ''}

          {images && images.length > 0 ? <SortableList fid={fid} group="grid" handleReorder={e => this.onReorder(e)}>
            {images
              && images.map(({ id, src }) => (
                <Image
                  key={id}
                  id={id}
                  src={src}
                  fid={fid}
                  removeImage={removeImage}
                  type={type}
                  onClick={onClick}
                />
              ))}
          </SortableList> : ''}
        </section>
      </>
    );
  }
}

export default ImageList;
