import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, Router } from 'react-router-dom';

import { Folder, Img, History, Datastore } from '../scripts';
import { Home, EditFolder } from '.';

const { imageLib, notifications, messaging } = window.buildfire;

class Content extends Component {
  constructor(props) {
    super(props);
    this.Datastore = new Datastore();
    this.deleteFolderTimeout = null;
    this.busy = false;
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

      const optimizeImg = src => {
        const croppedImg = imageLib.cropImage(src, { width: 1, height: 1 });
        if (!croppedImg.includes('cloudimg.io')) {
          return src;
        }

        let regex = /\/crop\/\d+\D\d+\/n\//g;

        if (croppedImg.indexOf('/s/crop/') > -1) {
          regex = /\/s\/crop\/\d+\D\d+\//g;
        }
        return croppedImg.replace(regex, '/cdno/n/q1/');
      };

      const imagePromises = selectedFiles.map(
        src => new Promise(resolve => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.src = src;
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

  addImagesToFolder = images => {
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

  removeImage = (imgId, type) => {
    const removeImageFromGallery = () => {
      this.setState(
        state => {
          let { images, folders } = { ...state };
          images = images.filter(image => image.id !== imgId);
          folders = folders.map(folder => {
            folder.images = folder.images.filter(image => image.id !== imgId);
            return folder;
          });
          return { images, folders };
        },
        () => this.saveWithDelay()
      );
    };

    const removeImageFromFolder = () => {
      this.setState(
        state => {
          const { folder, folders } = { ...state };
          folder.images = folder.images.filter(image => image.id !== imgId);

          const index = folders.findIndex(({ id }) => id === folder.id);
          folders[index] = folder;

          return { folder, folders };
        },
        () => this.saveWithDelay()
      );
    };

    switch (type) {
      case 'gallery': {
        removeImageFromGallery();
        break;
      }
      case 'folder': {
        removeImageFromFolder();
        break;
      }
      default:
        break;
    }
  };

  addFolder = () => {
    const afterStateChange = () => {
      History.replace('/folder');
      setTimeout(() => {
        const { folder } = this.state;
        const message = {
          type: 'folder',
          folder
        };
        messaging.sendMessageToWidget(message);
      }, 250);
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
    if (this.busy) return;

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

    const timer = setTimeout(() => {
      if (this.busy) this.busy = false;
    }, 5000);

    const dialogCallback = (err, result) => {
      if (timer) clearInterval(timer);
      this.busy = false;
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

    // if (this.deleteFolderTimeout) {
    //   clearTimeout(this.deleteFolderTimeout);
    // }
    notifications.confirm(dialogOptions, dialogCallback);
    // this.deleteFolderTimeout = setTimeout(() => {
    // }, 500);
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

  handleReorder = (e, type) => {
    const { oldIndex, newIndex } = e;

    const reorderGalleryImages = () => {
      const { images } = { ...this.state };
      images.splice(newIndex, 0, images.splice(oldIndex, 1)[0]);
      this.setState(() => ({ images }), () => this.saveWithDelay());
    };

    const reorderFolderImages = () => {
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

    const reorderFolders = () => {
      const { folders } = { ...this.state };
      folders.splice(newIndex, 0, folders.splice(oldIndex, 1)[0]);
      this.setState(() => ({ folders }), () => this.saveWithDelay());
    };

    switch (type) {
      case 'gallery': {
        reorderGalleryImages();
        break;
      }
      case 'folder': {
        reorderFolderImages();
        break;
      }
      case 'folders': {
        reorderFolders();
        break;
      }
      default: {
        break;
      }
    }
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

  componentDidMount = () => {
    const loadData = (err, result) => {
      if (err) throw err;
      const { images, folders } = result.data;
      if (images && folders) {
        this.setState(() => ({ images, folders }));
      }
    };

    this.Datastore.get((error, result) => loadData(error, result));
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
              removeImage={this.removeImage}
              handleReorder={this.handleReorder}
              addImagesToFolder={this.addImagesToFolder}
              handleInputChange={this.handleInputChange}
            />
          )}
        />
      </Router>
    );
  }
}

export default hot(Content);
