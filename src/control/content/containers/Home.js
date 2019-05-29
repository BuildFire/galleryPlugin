import React from 'react';
import { ImageList, FolderList } from '.';

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
      type="gallery"
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
      handleReorder={handleReorder}
    />
  </>
);

export default Home;
