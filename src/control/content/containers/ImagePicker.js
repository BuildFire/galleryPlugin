import React, { Component } from 'react';
import { Image, SortableList } from '../components';

export default class ImagePicker extends Component {
  fid = 'folder-imgs';

  componentWillUnmount = () => {
    const frameExists = document.lazyLoadInstances && document.lazyLoadInstances[this.fid];
    if (frameExists) {
      document.lazyLoadInstances[this.fid] = null;
      delete document.lazyLoadInstances[this.fid];
    }
  };

  render() {
    const { images, galleryImages, toggleImagesModal, handleAddImages, selectImage } = this.props;
    return (
      <div>
        <SortableList fid={this.fid} group="grid" noSort>
          {galleryImages.map(({ id, src, selected }) => {
            if (!images.find(img => img.id === id)) {
              return (
                <Image
                  key={id}
                  id={id}
                  src={src}
                  fid={this.fid}
                  selected={selected}
                  onClick={selectImage}
                />
              );
            }
            return null;
          })}
        </SortableList>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={toggleImagesModal} type="button">
            Close
          </button>
          <button className="btn btn--add btn--lg" onClick={handleAddImages} type="button">
            Add
          </button>
        </div>
      </div>
    );
  }
}
