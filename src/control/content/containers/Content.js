import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, Router } from 'react-router-dom';
import EditFolder from './EditFolder';
import Home from './Home';
import { Datastore, Image, Folder, History } from '../content.controller';

const { imageLib, history } = window.buildfire;
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
      const newImages = selectedFiles.map(src => new Image({ src }));

      this.setState(state => {
        let { images } = { ...state };
        images = [...images, ...newImages];

        return { images };
      }, () => this.saveWithDelay());
    };
    imageLib.showDialog(dialogOptions, onSubmit);
  }

  addFolder = () => {
    const afterStateChange = () => {
      History.replace('/folder');
      this.saveWithDelay();
    };

    this.setState(state => {
      const { folders } = { ...state };
      const folder = new Folder({});
      folders.push(folder);
      return { folder, folders };
    }, () => afterStateChange());
  }

  addImages = images => {
    this.setState(state => {
      const { folder } = { ...state };

      folder.images = [...folder.images, ...images];

      return { folder };
    }, () => this.saveWithDelay());
  }

  openFolder = folder => this.setState(() => ({ folder }), History.replace('/folder'));

  handleReorder = e => {
    const { images } = { ...this.state };
    const { oldIndex, newIndex } = e;

    images.splice(newIndex, 0, images.splice(oldIndex, 1)[0]);

    this.setState(() => ({ images }), () => this.saveWithDelay());
  };

  handleFolderReorder = e => {
    const { folder } = { ...this.state };
    const { oldIndex, newIndex } = e;

    folder.images.splice(newIndex, 0, folder.images.splice(oldIndex, 1)[0]);

    this.setState(() => ({ folder }), () => this.saveWithDelay());
  }

  removeImage = src => {
    this.setState(state => {
      let { images, folders } = { ...state };
      images = images.filter(image => image.src !== src);
      folders = folders.map(folder => {
        folder.images = folder.images.filter(image => image.src !== src);
        return folder;
      });
      return { images, folders };
    }, () => this.saveWithDelay());
  }

  removeImageFromFolder = src => {
    this.setState(state => {
      const { folder } = { ...state };
      folder.images = folder.images.filter(image => image.src !== src);
      return { folder };
    }, () => this.saveWithDelay());
  }

  saveWithDelay = () => {
    const { folders, images } = { ...this.state };
    const obj = { images, folders };
    this.Datastore.saveWithDelay(obj, (err, result) => {
      if (err) throw err;
      console.warn(result);
    });
  }

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState(state => {
      const { folder } = { ...state };
      folder[name] = value;
      return ({ folder });
    });
  }

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
      this.setState(() => ({ images, folders }));
    };
    history.onPop(breadcrumb => console.warn(breadcrumb));
    this.Datastore.get(loadData);
    this.Datastore.onUpdate(loadData);

    // this.Datastore.saveWithDelay({ images: [], folders: [] }, () => { });
  }

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
              history={History}
              removeImageFromFolder={this.removeImageFromFolder}
              handleFolderReorder={this.handleFolderReorder}
              addImages={this.addImages}
              handleInputChange={this.handleInputChange} />
          )}
        />
      </Router>
    );
  }
}

export default hot(Content);
