const { datastore } = window.buildfire;

export default class Datastore {
  constructor() {
    this.tag = 'gallery';
    this.timeout = null;
  }

  get = callback => {
    const onSuccess = (err, result) => {
      if (err) callback(err, null);
      if (callback) callback(null, result);
    };

    datastore.get(this.tag, onSuccess);
  };

  save = (object, callback) => {
    const onSuccess = (err, result) => {
      if (err) callback(err, null);
      if (callback) callback(null, result);
    };
    datastore.save(object, this.tag, onSuccess);
  };

  saveWithDelay = (object, callback) => {
    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.save(object, callback);
    }, 1000);
  };

  onUpdate = callback => datastore.onUpdate(callback, false);
}
