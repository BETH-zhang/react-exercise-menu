import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
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
      <div
        className={classNames({
          "Tree": true,
          [this.props.className]: this.props.className
        })}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Tree;
