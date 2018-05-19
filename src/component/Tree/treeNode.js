import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import './index.css';

class TreeNode extends Component {
  // static propTypes = {
  //   level: PropTypes.number,
  //   className: PropTypes.string,
  //   title: PropTypes.any,
  //   children: PropTypes.any
  // }

  render() {
    return (
      <div
        key={this.props.level}
        className={classNames({
          "TreeNode": true,
          [this.props.className]: this.props.className
        })}
        style={{
          marginLeft: `${(this.props.level - 1) * 25}px`
        }}
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
