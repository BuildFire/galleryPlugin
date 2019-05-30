import React from 'react';
import { Image } from '.';

const Folder = ({ folder, openFolder, removeFolder }) => {
  const handleClick = () => openFolder(folder);
  const handleRemoveFolder = e => removeFolder(e, folder);
  const thumbnailSrc = folder.images && folder.images.length ? folder.images[folder.images.length - 1].src : null;

  return (
    <div className="folder d-item" onClick={handleClick} onKeyDown={handleClick} role="button">
      <span className="icon icon-menu cursor-grab pull-left" />

      <div className="media-holder pull-left">
        {thumbnailSrc ? <Image src={thumbnailSrc} /> : <span className="icon icon-folder" />}
      </div>

      <div className="copy">
        <h5>{folder.name}</h5>
        <div className="actions">
          <button className="btn btn--icon" type="button">
            <span className="icon icon-pencil" />
          </button>
          <span className="btn-icon btn-delete-icon btn-danger" onClick={handleRemoveFolder} />
        </div>
      </div>
    </div>
  );
};

export default Folder;
