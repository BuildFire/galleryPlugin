import React from 'react';
import { SortableList, Folder } from '../components';

const FolderList = ({ folders, addFolder, removeFolder, openFolder, handleReorder }) => {
  const onReorder = e => {
    if (handleReorder) handleReorder(e, 'folders');
  };
  return (
    <>
      <h1 className="title">Folders</h1>

      <button onClick={addFolder} className="btn btn-success btn-add" type="button">
        Add Folder
      </button>

      {!folders || folders.length === 0 ? <div style={{marginTop: '15px'}} className="empty-state"><h4>You haven't added any folders</h4></div> : ''}

      {folders || folders.length > 0 ? <SortableList group="row" handleReorder={onReorder}>
        {folders
          && folders.map(folder => (
            <Folder
              key={folder.id}
              folder={folder}
              openFolder={openFolder}
              removeFolder={removeFolder}
            />
          ))}
      </SortableList> : ''}
    </>
  );
};

export default FolderList;
