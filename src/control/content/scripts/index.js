import { createMemoryHistory } from 'history';
import Datastore from './Datastore';

const History = createMemoryHistory();

// eslint-disable-next-line no-bitwise
const getUUID = () => `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));

class Img {
  constructor(image) {
    this.id = getUUID();
    this.src = image.src || '';
    this.width = image.width || null;
    this.height = image.height || null;
    this.isImageValid = image.isValid;
  }
}

class Folder {
  constructor(folder) {
    this.id = getUUID();
    this.createdOn = Date.now();
    this.name = folder.name || 'New Folder';
    this.images = folder.images || [];
  }
}

export { Img, Folder, History, Datastore };
