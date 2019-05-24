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
  };

  save = (object, callback) => {
    const onSuccess = (err, result) => {
      if (err) callback(err, null);
      if (callback) callback(null, result);
    };

    datastore.save(object, Datastore.tag, onSuccess);
  };

  saveWithDelay = (object, callback) => {
    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.save(object, callback);
    }, 1000);
  };

  onUpdate = callback => datastore.onUpdate(callback, false);
}

class Img {
  constructor(image) {
    // eslint-disable-next-line no-bitwise
    this.id = `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
    this.src = image.src || '';
    this.width = image.width || null;
    this.height = image.height || null;
  }
}

class Folder {
  constructor(folder) {
    // eslint-disable-next-line no-bitwise
    this.id = `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
    this.createdOn = Date.now();
    this.name = folder.name || 'New Folder';
    this.images = folder.images || [];
  }
}

const History = createMemoryHistory();

export { Datastore, Img, Folder, History };
