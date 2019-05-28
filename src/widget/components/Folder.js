import React from 'react';
import { Image } from '.';

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

export default Folder;
