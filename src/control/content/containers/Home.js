import React from 'react';
import ImageList from './ImageList';
import FolderList from './FolderList';

const Home = ({
  images,
  removeImage,
  folders,
  showImageDialog,
  addFolder,
  removeFolder,
  openFolder,
  handleReorder
}) => (
  <>
    <ImageList
      images={images}
      removeImage={removeImage}
      showImageDialog={showImageDialog}
      handleReorder={handleReorder}
    />
    <FolderList
      folders={folders}
      addFolder={addFolder}
      removeFolder={removeFolder}
      openFolder={openFolder}
      // handleReorder={handleReorder}
    />
  </>
);

export default Home;
