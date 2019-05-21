import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { Datastore, History} from '../widget.controller';
import { Gallery } from '../components/utils';
class Widget extends Component {
  constructor(props) {
    super(props);
    this.Datastore = new Datastore();
    this.state = {
      images: [],
      folders: []
    };
  }
  
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
    this.Datastore.get(loadData);
    this.Datastore.onUpdate(loadData);
  }

  render() {
    const { images } = this.state;
    return (
      <>
        <Gallery images={images} />
      </>
    );
  }
}

export default hot(Widget);
