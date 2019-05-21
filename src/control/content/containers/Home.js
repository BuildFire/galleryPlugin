import React from 'react';
import ImageList from './ImageList';
import FolderList from './FolderList';

const Home = ({ images, removeImage, folders, showImageDialog, addFolder, openFolder, handleReorder }) => (
  <div>
    <button onClick={showImageDialog} type="button">Add Image</button>
    <ImageList
      images={images}
      removeImage={removeImage}
      showImageDialog={showImageDialog}
      handleReorder={handleReorder}
    />
    <FolderList
      folders={folders}
      addFolder={addFolder}
      openFolder={openFolder}
      // handleReorder={handleReorder}
    />
  </div>
);


export default Home;
