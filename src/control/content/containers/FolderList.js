import React from 'react';
import { SortableList, Folder } from '../components';

const FolderList = ({ folders, addFolder, removeFolder, openFolder, handleReorder }) => {
  const onReorder = e => {
    if (handleReorder) handleReorder(e, 'folders');
  };
  return (
    <>
      <h1 className="title">Folders</h1>

      <button onClick={addFolder} className="btn btn--primary" type="button">
        Create Folder
      </button>

      <SortableList group="row" handleReorder={onReorder}>
        {folders
          && folders.map(folder => (
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
};

export default FolderList;
