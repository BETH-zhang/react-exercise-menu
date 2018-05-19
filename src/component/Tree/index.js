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

  constructor(props) {
    super();
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
    const {} = this.props;

    return {
      tree: {
        // root: this,

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

  onNodeClick = () => {}
  onNodeSelect = () => {}
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
    console.log(React.Children, '===');
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
