import React, { PropTypes, Component } from 'react';
import Head from '../Head';
import Tree from '../Tree';
import './index.css';

class Menu extends Component {
  // static propTypes = {
  //   title: PropTypes.string,
  //   data: PropTypes.ary,
  // }

  constructor() {
    super();
    this.state = {
    }
  }

  clearHandle = () => {
    console.log('清除');
  }

  render() {
    console.log(this.props.data);
    return (
      <div className="Menu">
        <Head
          title={this.props.title}
          clearHandle={this.clearHandle}
        />

        <Tree
        />
      </div>
    );
  }
}

export default Menu;
