import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.css';

export const contextTypes = {
  bTree: PropTypes.shape({
    root: PropTypes.object,
    checkable: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.node,
    ]),
    filterTreeNode: PropTypes.func,
    renderTreeNode: PropTypes.func,

    isKeyChecked: PropTypes.func,

    onNodeClick: PropTypes.func,
    onNodeExpand: PropTypes.func,
    onNodeSelect: PropTypes.func,
    onBatchNodeCheck: PropTypes.func,
    onCheckConductFinished: PropTypes.func,
  })
}

class Tree extends Component {
  static propTypes = {
    className: PropTypes.string,
    checkedKeys: PropTypes.any,
    onCheck: PropTypes.func,
    children: PropTypes.any
  }

  static childContextTypes = contextTypes;

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      selectedKeys: [],
      halfCheckedKeys: [],
      checkedKeys: [],
      ...(this.getSyncProps(props) || {}),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState((prevState) => (
      this.getSyncProps(nextProps, this.props, prevState)
    ));
  }

  getChildContext() {
    const {
      checkable, filterTreeNode
    } = this.props;

    return {
      bTree: {
        // root: this,
        checkable,

        filterTreeNode,
        renderTreeNode: this.renderTreeNode,
        isKeyChecked: this.isKeyChecked,

        onNodeClick: this.onNodeClick,
        onNodeSelect: this.onNodeSelect,
        onNodeContextMenu: this.onNodeContextMenu,
        onBatchNodeCheck: this.onBatchNodeCheck,
        onCheckConductFinished: this.onCheckConductFinished,
      }
    }
  }

  onNodeClick = (e, treeNode) => {
    console.log('onNodeSelect');
    const { onClick } = this.props;
    if (onClick) {
      onClick(e, treeNode);
    }
  }

  onNodeSelect = (e, treeNode) => {
    console.log('onNodeSelect');
  }

  onNodeContextMenu = () => {}
  onBatchNodeCheck = () => {}
  onCheckConductFinished = () => {}

  getSyncProps = (props = {}, prevProps, preState) => {
    console.log('sync props: 同步数据给treenode');
    return null;
  }

  isKeyChecked = (key) => {
    const { checkedKeys = [] } = this.state;
    return checkedKeys.indexOf(key) !== -1;
  }

  renderTreeNode = (child, index, level = 0) => {
    console.log(child, index, level);
    const {
      selectedKeys = [], halfCheckedKeys = [],
    } = this.state;
    const {} = this.props;
    const key = child.key;

    return React.cloneElement(child, {
      eventKey: key,
      checked: this.isKeyChecked(key),
      halfChecked: halfCheckedKeys.indexOf(key) !== -1,
    });
  }

  render() {
    return (
      <div
        className={classNames({
          "Tree": true,
          [this.props.className]: this.props.className
        })}
        role="tree-node"
        unselectable="no"
      >
        {React.Children.map(this.props.children, this.renderTreeNode, this)}
      </div>
    );
  }
}

export default Tree;
