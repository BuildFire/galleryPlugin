import React from 'react';
import { Folder, AllPhotos } from '../components';

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
