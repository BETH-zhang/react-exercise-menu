import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import './index.css';

class TreeNode extends Component {
  // static propTypes = {
  //   currentIndex: PropTypes.string,
  //   className: PropTypes.string,
  //   title: PropTypes.any,
  //   children: PropTypes.any
  // }

  render() {
    return (
      <div
        key={this.props.currentIndex}
        className={classNames({
          "TreeNode": true,
          [this.props.className]: this.props.className
        })}
      >
        <div className="title">
          <input type="checkbox" />
          <div className="title-children">
            {this.props.title}
          </div>
        </div>
        <div className="children">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default TreeNode;
