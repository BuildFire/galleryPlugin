import React from 'react';

const Buttons = ({ view, changeView }) => (
  <nav>
    <button
      className={`btn btn--icon ${view === 'gallery' ? 'btn-primary' : ''}`}
      onClick={() => changeView('gallery')}
      type="button"
    >
      <span className={`icon icon-picture2 ${view === 'gallery' ? 'whiteTheme' : ''}`} />
    </button>
    <button
      className={`btn btn--icon ${view === 'folders' ? 'btn-primary' : ''}`}
      onClick={() => changeView('folders')}
      type="button"
    >
      <span
        className={`icon icon-folder-picture ${view === 'folders' ? 'whiteTheme' : ''}`}
      />
    </button>
  </nav>
);

export default Buttons;
