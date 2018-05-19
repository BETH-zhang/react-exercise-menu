import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  toArray,
  getNodeChildren,
} from './utils';
import './index.css';

class TreeNode extends Component {
  static propTypes = {
    currentIndex: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.any,
    children: PropTypes.any
  }

  renderCheckbox = () => {
    return (
      <input type="checkbox" />
    );
  }

  renderSelector = () => {
    return (<div className="title-children">
      {this.props.title}
    </div>);
  }

  renderChildren = () => {
    const { pos } = this.props;
    const { renderTreeNode } = this.context;
    console.log('this.context', this.context);

    const nodeList = this.getNodeChildren();
    if (nodeList.length === 0) {
      return null;
    }

    return (<div className="children">
      {
        React.Children.map(nodeList, (node, index) => (
          renderTreeNode(node, index, pos)
        ))
      }
    </div>);
  }

  getNodeChildren = () => {
    const { children } = this.props;
    const originList = toArray(children).filter(node => node);
    const targetList = getNodeChildren(originList);

    return targetList;
  }

  render() {
    const { checked } = this.props;
    
    return (
      <div
        key={this.props.currentIndex}
        className={classNames({
          "TreeNode": true,
          [this.props.className]: this.props.className
        })}
      >
        {checked}
        <div className="title">
          {this.renderCheckbox()}
          {this.renderSelector()}
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}

export default TreeNode;
