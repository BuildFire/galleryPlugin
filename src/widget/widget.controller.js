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

  onUpdate = callback => datastore.onUpdate(callback, false);
}

const History = createMemoryHistory();

export { Datastore, History };
