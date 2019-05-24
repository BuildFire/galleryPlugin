import React from 'react';
import { SortableList } from '../components/utils';

const Folder = ({ folder, openFolder, removeFolder }) => {
  const handleClick = () => openFolder(folder);
  const handleRemoveFolder = e => removeFolder(e, folder);

  return (
    <div className="folder d-item" onClick={handleClick} onKeyDown={handleClick} role="button">
      <span className="icon icon-menu cursor-grab pull-left" />

      <div className="media-holder pull-left">
        <span className="icon icon-folder" />
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

const FolderList = ({ folders, addFolder, removeFolder, openFolder, handleReorder }) => (
  <>
    <h1 className="title">Folders</h1>

    <button onClick={addFolder} className="btn btn--primary" type="button">
      Create Folder
    </button>

    <SortableList group="row" handleReorder={handleReorder}>
      {folders && folders.map(folder => (
        <Folder
          key={folder.id}
          folder={folder}
          openFolder={openFolder}
          removeFolder={removeFolder}
        />
      ))}
    </SortableList>
  </>
);

export default FolderList;
