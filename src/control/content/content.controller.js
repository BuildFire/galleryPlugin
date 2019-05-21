import { createMemoryHistory } from 'history';

const { datastore } = window.buildfire;

class Datastore {
  constructor() {
    this.tag = 'content.1';
    this.timeout = null;
  }

  get = callback => {
    const onSuccess = (err, result) => {
      if (err) callback(err, null);
      if (callback) callback(null, result);
    };

    datastore.get(Datastore.tag, onSuccess);
  }

  save = (object, callback) => {
    const onSuccess = (err, result) => {
      if (err) callback(err, null);
      if (callback) callback(null, result);
    };

    datastore.save(object, Datastore.tag, onSuccess);
  }

  saveWithDelay = (object, callback) => {
    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.save(object, callback);
    }, 1000);
  }

  onUpdate = callback => datastore.onUpdate(callback, false);
}

class Image {
  constructor(image) {
    this.src = image.src || '';
    this.name = image.name || '';
  }
}

class Folder {
  constructor(folder) {
    this.id = Date.now();
    this.name = folder.name || 'New Folder';
    this.images = folder.images || [];
  }
}

const History = createMemoryHistory();

export { Datastore, Image, Folder, History };
