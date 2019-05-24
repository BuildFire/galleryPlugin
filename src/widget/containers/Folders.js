import React from 'react';
import Image from '../components';

const Folder = ({ folder, viewFolder }) => {
  const thumbnail = folder.images.length
    ? {
      src: folder.images[folder.images.length - 1].src,
      width: 200,
      height: 200
    }
    : {
      src: 'https://via.placeholder.com/150',
      width: 200,
      height: 200
    };
  const handleClick = () => viewFolder(folder);
  return (
    <div className="grid-item--folder" onClick={handleClick}>
      <div className="noclick">
        <Image image={thumbnail} />
        <h4 className="title ellipsis">{folder.name}</h4>
      </div>
    </div>
  );
};

const AllPhotos = ({ images, viewFolder }) => {
  const thumbnails = images ? images.slice(images.length - 4).map(img => {
    img.width = 200;
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
        {thumbnails && thumbnails.map(thumbnail => <Image image={thumbnail} />)}
      </div>
      <h4 className="title ellipsis">All Photos</h4>
    </div>
  );
};

const Folders = ({ folders, images, viewFolder }) => (
  <div className="plugin__container">
    <div className="empty__state" />
    <section className="grid grid--folder">
      <AllPhotos images={images} viewFolder={viewFolder} />
      {folders && folders.map(folder => <Folder folder={folder} viewFolder={viewFolder} />)}
    </section>
  </div>
);

export default Folders;
