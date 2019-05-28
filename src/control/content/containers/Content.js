import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, Router } from 'react-router-dom';

import { Folder, Img, History, Datastore } from '../scripts';
import { Home, EditFolder } from '.';

const { imageLib, history, notifications, messaging } = window.buildfire;

class Content extends Component {
  constructor(props) {
    super(props);
    this.Datastore = new Datastore();
    this.state = {
      images: [],
      folders: [],
      folder: null
    };
  }

  showImageDialog = () => {
    const dialogOptions = { showIcons: false };
    const onSubmit = (err, result) => {
      if (err) throw err;
      const { selectedFiles } = result;

      const imagePromises = selectedFiles.map(
        src => new Promise(resolve => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.src = `https://czi3m2qn.cloudimg.io/cdn/n/n/${src}`;
          image.originalSrc = src;
        })
      );

      Promise.all(imagePromises).then(imgs => {
        const newImages = imgs.map(
          ({ naturalWidth, naturalHeight, originalSrc }) => new Img({
            src: originalSrc,
            width: naturalWidth,
            height: naturalHeight
          })
        );

        this.setState(
          state => {
            let { images } = { ...state };
            images = [...images, ...newImages];

            return { images };
          },
          () => this.saveWithDelay()
        );
      });
    };

    imageLib.showDialog(dialogOptions, onSubmit);
  };

  addFolder = () => {
    const afterStateChange = () => {
      History.replace('/folder');
      this.saveWithDelay();
    };

    this.setState(
      state => {
        const { folders } = { ...state };
        const folder = new Folder({});
        folders.push(folder);
        return { folder, folders };
      },
      () => afterStateChange()
    );
  };

  removeFolder = (e, folder) => {
    e.stopPropagation();

    const { id, name } = folder;
    const dialogOptions = {
      title: `Delete ${name}?`,
      message: `Are you sure you want to delete ${name}? This cannot be undone!`,
      confirmButton: {
        text: 'Delete',
        key: 'confirm',
        type: 'danger'
      }
    };

    const dialogCallback = (err, result) => {
      const key = result && result.selectedButton ? result.selectedButton.key : err;

      if (key === 'confirm' || key === 1 || key === true) {
        this.setState(
          state => {
            let { folders } = { ...state };
            folders = folders.filter(f => f.id !== id);

            return { folders };
          },
          () => this.saveWithDelay()
        );
      }
    };

    notifications.confirm(dialogOptions, dialogCallback);
  };

  addImages = images => {
    this.setState(
      state => {
        const { folder, folders } = { ...state };
        folder.images = [...folder.images, ...images];

        const index = folders.findIndex(({ id }) => id === folder.id);
        folders[index] = folder;

        return { folder, folders };
      },
      () => this.saveWithDelay()
    );
  };

  openFolder = folder => {
    const afterStateChange = () => {
      History.replace('/folder');
      const message = {
        type: 'folder',
        folder
      };
      messaging.sendMessageToWidget(message);
    };
    this.setState(() => ({ folder }), () => afterStateChange());
  };

  handleReorder = e => {
    const { images } = { ...this.state };
    const { oldIndex, newIndex } = e;

    images.splice(newIndex, 0, images.splice(oldIndex, 1)[0]);

    this.setState(() => ({ images }), () => this.saveWithDelay());
  };

  handleFolderReorder = e => {
    const { oldIndex, newIndex } = e;

    this.setState(
      state => {
        const { folder, folders } = { ...state };
        folder.images.splice(newIndex, 0, folder.images.splice(oldIndex, 1)[0]);

        const index = folders.findIndex(({ id }) => id === folder.id);
        folders[index] = folder;

        return { folder, folders };
      },
      () => this.saveWithDelay()
    );
  };

  removeImage = src => {
    this.setState(
      state => {
        let { images, folders } = { ...state };
        images = images.filter(image => image.src !== src);
        folders = folders.map(folder => {
          folder.images = folder.images.filter(image => image.src !== src);
          return folder;
        });
        return { images, folders };
      },
      () => this.saveWithDelay()
    );
  };

  removeImageFromFolder = src => {
    this.setState(
      state => {
        const { folder, folders } = { ...state };
        folder.images = folder.images.filter(image => image.src !== src);

        const index = folders.findIndex(({ id }) => id === folder.id);
        folders[index] = folder;

        return { folder, folders };
      },
      () => this.saveWithDelay()
    );
  };

  goHome = () => {
    History.replace('/');
    const message = {
      type: 'home'
    };
    messaging.sendMessageToWidget(message);
  };

  saveWithDelay = () => {
    const { folders, images } = { ...this.state };
    const obj = { images, folders };
    this.Datastore.saveWithDelay(obj, err => {
      if (err) throw err;
    });
    localStorage.setItem('gallery.cache', JSON.stringify(this.state));
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState(
      state => {
        const { folder } = { ...state };
        folder[name] = value;
        return { folder };
      },
      () => this.saveWithDelay()
    );
  };

  componentDidUpdate = () => console.warn(this.state);

  componentDidMount = () => {
    const loadData = (err, result) => {
      if (err && err.data) {
        result = err;
        err = null;
      } else if (err) {
        throw err;
      }
      const { images, folders } = result.data;
      if (images && folders) {
        this.setState(() => ({ images, folders }));
      }
    };
    history.onPop(breadcrumb => console.warn(breadcrumb));
    const cache = localStorage.getItem('gallery.cache');
    if (cache) loadData({ data: JSON.parse(cache) });
    this.Datastore.get(loadData);
    this.Datastore.onUpdate(loadData);

    // this.Datastore.saveWithDelay({ images: [], folders: [] }, () => { });
  };

  render() {
    const { images, folders, folder } = this.state;

    return (
      <Router history={History}>
        <Route
          exact
          path="/"
          render={() => (
            <Home
              images={images}
              folders={folders}
              removeImage={this.removeImage}
              addFolder={this.addFolder}
              removeFolder={this.removeFolder}
              openFolder={this.openFolder}
              showImageDialog={this.showImageDialog}
              handleReorder={this.handleReorder}
            />
          )}
        />
        <Route
          exact
          path="/folder"
          render={() => (
            <EditFolder
              galleryImages={images}
              folder={folder}
              goHome={this.goHome}
              removeImageFromFolder={this.removeImageFromFolder}
              handleFolderReorder={this.handleFolderReorder}
              addImages={this.addImages}
              handleInputChange={this.handleInputChange}
            />
          )}
        />
      </Router>
    );
  }
}

export default hot(Content);
