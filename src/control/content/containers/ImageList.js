import React from 'react';
import { Image, SortableList } from '../components/utils';

const ImageList = ({ images, removeImage, handleReorder }) => (
  <>
    {/* <button onClick={showImageDialog} type="button">Add Image</button> */}
    <SortableList group="grid" handleReorder={handleReorder}>
      {
        images.map(({ src }) => <Image key={src} src={src} removeImage={removeImage} />)
      }
    </SortableList>
  </>
);

export default ImageList;
