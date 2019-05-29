import React from 'react';
import LazyLoad from 'react-lazy-load';
import { SortableList, Image } from '../components';

const ImageList = ({ type, images, showImageDialog, removeImage, handleReorder }) => {
  const onReorder = e => {
    handleReorder(e, type);
  };
  
  return (
    <section className="image__grid">
      {/* <h1 className="title">Files</h1> */}
      <button onClick={showImageDialog} className="btn btn--add" type="button">
        Add Images
      </button>
      <SortableList group="grid" handleReorder={onReorder}>
        {images
          && images.map(({ id, src }) => (
            <LazyLoad key={id}>
              <Image src={src} removeImage={removeImage} type={type} />
            </LazyLoad>
          ))}
      </SortableList>
    </section>
  );
};

export default ImageList;