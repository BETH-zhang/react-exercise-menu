import React, { PropTypes, Component } from 'react';
import './index.css';

class Tree extends Component {
  // static propTypes = {
  //   className: PropTypes.string,
  //   checkedKeys: PropTypes.any,
  //   onCheck: PropTypes.func,
  //   children: PropTypes.any
  // }

  render() {
    return (
      <div className="Tree">
        {this.props.children}
      </div>
    );
  }
}

export default Tree;
