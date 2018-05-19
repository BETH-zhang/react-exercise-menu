import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import './index.css';

class TreeNode extends Component {
  // static propTypes = {
  //   key: PropTypes.string,
  //   className: PropTypes.string,
  //   title: PropTypes.any
  // }

  render() {
    return (
      <div
        key={this.props.key}
        className={classNames({
          "TreeNode": true,
          [this.props.className]: this.props.className
        })}
      >
        TreeNode
      </div>
    );
  }
}

export default TreeNode;
