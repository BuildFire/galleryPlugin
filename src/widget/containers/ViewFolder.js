import React from 'react';
import { Image } from '../components';

const ViewFolder = ({ folder, viewImage }) => (
  <div className={`plugin__container ${!folder.id ? 'nopadding' : ''}`}>
    <div className="folder__details">
      <h2 className="folder__title">{folder.name}</h2>
      <p className="date">Created on {new Date(folder.createdOn).toDateString()}</p>
    </div>

    <section className="grid__group">
      <div className="grid grid--img grid--1">
        {folder.images
          && folder.images.map(image => {
            const { src } = image;
            const thumbnail = { src, width: window.innerWidth / 3 };
            return <Image key={image.id} image={thumbnail} viewImage={viewImage} />;
          })}
      </div>
    </section>
  </div>
);

export default ViewFolder;
