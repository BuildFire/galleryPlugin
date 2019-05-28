import React from 'react';
import { Buttons, FolderActions } from '../components';

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
        <FolderActions bookmark={bookmark} folder={folder} />
      ) : (
        <Buttons view={view} changeView={changeView} />
      )}
    </div>
  );
};

export default NavBar;
