import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  traverseTreeNodes, getStrictlyValue,
  getFullKeyList, getPosition, 
  calcSelectedKeys,
  calcCheckedKeys, calcDropPosition,
  arrAdd, arrDel, posToArr,
} from './util';
import './index.css';

/**
 * Thought we still use `cloneElement` to pass `key`,
 * other props can pass with context for future refactor.
 */
export const contextTypes = {
  bTree: PropTypes.shape({
    root: PropTypes.object,

    renderTreeNode: PropTypes.func,

    isKeyChecked: PropTypes.func,

    onBatchNodeCheck: PropTypes.func,
    onCheckConductFinished: PropTypes.func,
  }),
};

class Tree extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    expandedKeys: PropTypes.arrayOf(PropTypes.string),
    checkedKeys: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.object,
    ]),
    onCheck: PropTypes.func,
  };

  static childContextTypes = contextTypes;

  static defaultProps = {
    defaultCheckedKeys: [],
  };

  constructor(props) {
    super(props);

    const {
      defaultCheckedKeys,
      expandedKeys,
    } = props;

    // Sync state with props
    const { checkedKeys = [], halfCheckedKeys = [] } =
      calcCheckedKeys(expandedKeys, props) || {};
      
    const state = {
      checkedKeys,
      halfCheckedKeys,
    };

    state.expandedKeys = getFullKeyList(props.children);
    this.state = {
      ...state,
      ...(this.getSyncProps(props) || {}),
    };

    // Cache for check status to optimize
    this.checkedBatch = null;
  }

  getChildContext() {
    return {
      bTree: {
        // root: this,
        renderTreeNode: this.renderTreeNode,
        isKeyChecked: this.isKeyChecked,

        onBatchNodeCheck: this.onBatchNodeCheck,
        onCheckConductFinished: this.onCheckConductFinished,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    // React 16 will not trigger update if new state is null
    const { checkedKeys = [], halfCheckedKeys = [] } =
      calcCheckedKeys(nextProps.expandedKeys, nextProps) || {};
      
    const state = {
      checkedKeys,
      halfCheckedKeys,
    };

    state.expandedKeys = getFullKeyList(nextProps.children);
    this.setState({
      ...state,
      ...(this.getSyncProps(nextProps) || {}),
    });
  }
  
  onBatchNodeCheck = (key, checked, halfChecked, startNode) => {
    console.log('onBatchNodeCheck', key, checked, halfChecked, startNode);
    if (startNode) {
      this.checkedBatch = {
        treeNode: startNode,
        checked,
        list: [],
      };
    }
    this.checkedBatch.list.push({ key, checked, halfChecked });
  };

  onCheckConductFinished = (e) => {
    console.log('onCheckConductFinished');
    const { checkedKeys, halfCheckedKeys } = this.state;
    const { onCheck, children } = this.props;

    // Use map to optimize update speed
    const checkedKeySet = {};
    const halfCheckedKeySet = {};

    checkedKeys.forEach(key => {
      checkedKeySet[key] = true;
    });
    halfCheckedKeys.forEach(key => {
      halfCheckedKeySet[key] = true;
    });

    // Batch process
    this.checkedBatch.list.forEach(({ key, checked, halfChecked }) => {
      checkedKeySet[key] = checked;
      halfCheckedKeySet[key] = halfChecked;
    });
    const newCheckedKeys = Object.keys(checkedKeySet).filter(key => checkedKeySet[key]);
    const newHalfCheckedKeys = Object.keys(halfCheckedKeySet).filter(key => halfCheckedKeySet[key]);

    // Trigger onChecked
    let selectedObj;

    const eventObj = {
      event: 'check',
      node: this.checkedBatch.treeNode,
      checked: this.checkedBatch.checked,
      nativeEvent: e.nativeEvent,
    };

    selectedObj = newCheckedKeys;

    // [Legacy] TODO: add optimize prop to skip node process
    eventObj.checkedNodes = [];
    eventObj.checkedNodesPositions = []; // [Legacy] TODO: not in API
    eventObj.halfCheckedKeys = newHalfCheckedKeys; // [Legacy] TODO: not in API
    traverseTreeNodes(children, ({ node, pos, key }) => {
      if (checkedKeySet[key]) {
        eventObj.checkedNodes.push(node);
        eventObj.checkedNodesPositions.push({ node, pos });
      }
    });

    this.setUncontrolledState({
      checkedKeys: newCheckedKeys,
      halfCheckedKeys: newHalfCheckedKeys,
    });

    if (onCheck) {
      onCheck(selectedObj, eventObj);
    }

    // Clean up
    this.checkedBatch = null;
  };

  /**
   * Sync state with props if needed
   */
  getSyncProps = (props = {}, prevProps, preState) => {
    // let needSync = false;
    const oriState = preState || this.state;
    const newState = {};
    const myPrevProps = prevProps || {};

    function checkSync(name) {
      if (props[name] !== myPrevProps[name]) {
        return true;
      }
      return false;
    }

    // Children change will affect check box status.
    // And no need to check when prev props not provided
    if (prevProps && checkSync('children')) {
      const newCheckedKeys = calcCheckedKeys(props.checkedKeys || oriState.checkedKeys, props);

      const { checkedKeys = [], halfCheckedKeys = [] } = newCheckedKeys || {};
      newState.checkedKeys = checkedKeys;
      newState.halfCheckedKeys = halfCheckedKeys;
    }

    if (checkSync('checkedKeys')) {
      const { checkedKeys = [], halfCheckedKeys = [] } =
      calcCheckedKeys(props.checkedKeys, props) || {};
      newState.checkedKeys = checkedKeys;
      newState.halfCheckedKeys = halfCheckedKeys;
    }
    return null;
  };

  /**
   * Only update the value which is not in props
   */
  setUncontrolledState = (state) => {
    let needSync = false;
    const newState = {};

    Object.keys(state).forEach(name => {
      if (name in this.props) return;

      needSync = true;
      newState[name] = state[name];
    });

    if (needSync) {
      this.setState(newState);
    }
  };

  isKeyChecked = (key) => {
    const { checkedKeys = [] } = this.state;
    return checkedKeys.indexOf(key) !== -1;
  };

  /**
   * [Legacy] Original logic use `key` as tracking clue.
   * We have to use `cloneElement` to pass `key`.
   */
  renderTreeNode = (child, index, level = 0) => {
    const {
      expandedKeys = [], halfCheckedKeys = [],
    } = this.state;
    const {} = this.props;
    const pos = getPosition(level, index);
    const key = child.key || pos;

    return React.cloneElement(child, {
      eventKey: key,
      expanded: expandedKeys.indexOf(key) !== -1,
      checked: this.isKeyChecked(key),
      halfChecked: halfCheckedKeys.indexOf(key) !== -1,
      pos,
    });
  };

  render() {
    return (
      <div
        className={classNames({
          "Tree": true,
          [this.props.className]: this.props.className
        })}
        role="tree-node"
      >
        {React.Children.map(this.props.children, this.renderTreeNode, this)}
      </div>
    );
  }
}

export default Tree;