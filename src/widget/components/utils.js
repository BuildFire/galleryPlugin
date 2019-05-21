import React from 'react';

export const Image = ({ src }) => (
  <div className="image">
    <img src={src} />
  </div>
);

export const Gallery = ({ images }) => (
  <div className="gallery">
    {
      images.map(({ src }) => <Image src={src} />)
    }
  </div>
);
