import React, { Component } from 'react';
import { ContextProvider } from '../scripts/context';

require('../scripts/hammer.min.js');

export class TouchController extends Component {
  constructor(props) {
    super(props);
    this.hammerRef = React.createRef();
    this.state = {
      scale: 1
    };
  }

  componentDidMount = () => {
    const hammer = new Hammer.Manager(this.hammerRef.current);
    const pinch = new Hammer.Pinch();
    hammer.add([pinch]);
    hammer.on('pinch', e => {
      const { scale } = e;

      this.setState(() => ({ scale }));
    });
  };

  render() {
    const { children } = this.props;
    return (
      <ContextProvider value={{ ...this.state }} ref={this.hammerRef}>
        {children}
      </ContextProvider>
    );
  }
}

export default TouchController;
