import React from 'react';
import { SortableList } from '../components/utils';

const Folder = ({ folder, openFolder }) => {
  const handleClick = () => openFolder(folder);

  return (
    <div className="folder d-item" onClick={handleClick} onKeyDown={handleClick} role="button">
      <div className="copy">
        <h5>{folder.name}</h5>
      </div>
    </div>
  );
};

const FolderList = ({ folders, addFolder, openFolder, handleReorder }) => (
  <>
    <button onClick={addFolder} type="button">Add Folder</button>
    <SortableList group="row" handleReorder={handleReorder}>
      {
        folders.map(folder => <Folder key={folder.name} folder={folder} openFolder={openFolder} />)
      }
    </SortableList>
  </>
);

export default FolderList;
