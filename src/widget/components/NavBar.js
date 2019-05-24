import React from 'react';

const Buttons = ({ view, changeView }) => (
  <nav>
    <button
      className={`btn btn--icon ${view === 'gallery' ? 'btn-primary' : ''}`}
      onClick={() => changeView('gallery')}
      type="button"
    >
      <span className={`icon icon-picture2 ${view === 'gallery' ? 'titleBarTextAndIcons' : ''}`} />
    </button>
    <button
      className={`btn btn--icon ${view === 'folders' ? 'btn-primary' : ''}`}
      onClick={() => changeView('folders')}
      type="button"
    >
      <span
        className={`icon icon-folder-picture ${view === 'folders' ? 'titleBarTextAndIcons' : ''}`}
      />
    </button>
  </nav>
);

const Details = ({ bookmark, folder }) => (
  <>
    <button className="btn btn--icon" type="button">
      <span className="icon icon-share2" />
    </button>
    <button className="btn btn--icon" onClick={bookmark} type="button">
      <span className={`icon icon-star${folder && folder.bookmarked ? '-full' : ''}`} />
    </button>
  </>
);

const NavBar = ({ changeView, view, pathname, bookmark, folder }) => {
  if (pathname === '/folder' && !folder.id) return <></>;
  return (
    <div
      className={`plugin__nav ${
        pathname === '/folder' ? 'plugin__nav--detail' : ''
      } backgroundColorTheme`}
    >
      {/* <input className="search__input" type="text" id="searchImg" placeholder="Search" /> */}
      {pathname === '/folder' ? (
        <Details bookmark={bookmark} folder={folder} />
      ) : (
        <Buttons view={view} changeView={changeView} />
      )}
    </div>
  );
};

export default NavBar;
