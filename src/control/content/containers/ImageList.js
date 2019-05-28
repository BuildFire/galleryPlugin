import React from 'react';
import LazyLoad from 'react-lazy-load';
import { SortableList, Image } from '../components';

const ImageList = ({ images, showImageDialog, removeImage, handleReorder }) => (
  <section className="image__grid">
    {/* <h1 className="title">Files</h1> */}
    <button onClick={showImageDialog} className="btn btn--add" type="button">
      Add Images
    </button>
    <SortableList group="grid" handleReorder={handleReorder}>
      {images && images.map(({ id, src }) => (
        <LazyLoad key={id}>
          <Image src={src} removeImage={removeImage} />
        </LazyLoad>
      ))}
    </SortableList>
  </section>
);

export default ImageList;
