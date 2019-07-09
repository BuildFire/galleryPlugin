import React from 'react';

const FolderActions = ({ bookmark, folder }) => (
  <>
    {/* <button className="btn btn--icon" type="button">
      <span className="icon icon-share2" />
    </button> */}
    <button className="btn btn--icon" onClick={bookmark} type="button">
      <span className={`icon icon-star${folder && folder.bookmarked ? '-full' : ''}`} />
    </button>
  </>
);

export default FolderActions;
