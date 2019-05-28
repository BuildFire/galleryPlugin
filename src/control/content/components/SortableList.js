import React, { Component } from 'react';

export default class SortableList extends Component {
  constructor(props) {
    super(props);
    this.sortableRef = React.createRef();
    this.id = Date.now() + Math.floor(Math.random() * 10000);
  }

  componentDidMount = () => {
    const element = this.sortableRef.current;
    const { group, handleReorder } = this.props;
    this.sortable = new window.Sortable(element, {
      group,
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      onEnd: handleReorder
    });
  };

  render() {
    const { children, group } = this.props;
    return (
      <div ref={this.sortableRef} className={`carousel-items hide-empty draggable-list-view ${group}`}>
        {children}
      </div>
    );
  }
}
