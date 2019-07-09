import React from 'react';
import { Image } from '.';

const AllPhotos = ({ images, viewFolder }) => {
  const thumbnails = images ? images.slice(images.length - 4).map(img => {
    return img;
  }) : [];
  const handleClick = () => {
    const mockFolder = {
      name: 'All Photos',
      images
    };
    viewFolder(mockFolder);
  };
  return (
    <div className="grid-item--folder" onClick={handleClick}>
      <div className="subgrid noclick">
        {thumbnails && thumbnails.map(thumbnail => <Image key={thumbnail.id} image={thumbnail} />)}
      </div>
      <h4 className="title ellipsis">All Photos</h4>
    </div>
  );
};

export default AllPhotos;
