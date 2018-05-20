import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { contextTypes } from './index';
import { toArray, getPosition, getNodeChildren, traverseTreeNodes } from './util';
import './index.css';

import checkbox1Img from '../../image/checkbox1.png';
import checkbox2Img from '../../image/checkbox2.png';
import checkbox3Img from '../../image/checkbox3.png';

const LOAD_STATUS_NONE = 0;

const defaultTitle = '---';

export const nodeContextTypes = {
  ...contextTypes,
  bTreeNode: PropTypes.shape({
    onUpCheckConduct: PropTypes.func,
  }),
};

class TreeNode extends React.Component {
  static propTypes = {
    eventKey: PropTypes.string, // Pass by parent `cloneElement`
    className: PropTypes.string,
    root: PropTypes.object,
    onSelect: PropTypes.func,

    // By parent
    selected: PropTypes.bool,
    checked: PropTypes.bool,
    halfChecked: PropTypes.bool,
    children: PropTypes.node,
    title: PropTypes.node,
    pos: PropTypes.string,
  };

  static contextTypes = nodeContextTypes;

  static childContextTypes = nodeContextTypes;

  static defaultProps = {
    title: defaultTitle,
  };

  constructor(props) {
    super(props);

    this.state = {
      loadStatus: LOAD_STATUS_NONE,
    };
  }

  getChildContext() {
    return {
      ...this.context,
      bTreeNode: {
        onUpCheckConduct: this.onUpCheckConduct,
      },
    };
  }

  onUpCheckConduct = (treeNode, nodeChecked, nodeHalfChecked, e) => {
    const { pos: nodePos } = treeNode.props;
    const { eventKey, pos, checked, halfChecked } = this.props;
    const {
      bTree: { isKeyChecked, onBatchNodeCheck, onCheckConductFinished },
      bTreeNode: { onUpCheckConduct } = {},
    } = this.context;

    const children = this.getNodeChildren();

    let checkedCount = nodeChecked ? 1 : 0;

    // Statistic checked count
    children.forEach((node, index) => {
      const childPos = getPosition(pos, index);

      if (nodePos === childPos) {
        return;
      }

      if (isKeyChecked(node.key || childPos)) {
        checkedCount += 1;
      }
    });

    // Static enabled children count
    const enabledChildrenCount = children
      .filter(node => node)
      .length;

    // checkStrictly will not conduct check status
    const nextChecked = enabledChildrenCount === checkedCount;
    const nextHalfChecked = (nodeHalfChecked || (checkedCount > 0 && !nextChecked));

    // Add into batch update
    if (checked !== nextChecked || halfChecked !== nextHalfChecked) {
      onBatchNodeCheck(eventKey, nextChecked, nextHalfChecked);

      if (onUpCheckConduct) {
        onUpCheckConduct(this, nextChecked, nextHalfChecked, e);
      } else {
        // Flush all the update
        onCheckConductFinished(e);
      }
    } else {
      // Flush all the update
      onCheckConductFinished(e);
    }
  };

  onDownCheckConduct = (nodeChecked) => {
    const { children } = this.props;
    const { bTree: { isKeyChecked, onBatchNodeCheck } } = this.context;

    traverseTreeNodes(children, ({ node, key }) => {
      if (nodeChecked !== isKeyChecked(key)) {
        onBatchNodeCheck(key, nodeChecked, false);
      }
    });
  };

  onCheck = (e) => {
    const { checked, eventKey } = this.props;
    const {
      bTree: { onBatchNodeCheck, onCheckConductFinished },
      bTreeNode: { onUpCheckConduct } = {},
    } = this.context;

    // e.preventDefault(); // 阻止事件默认动作
    const targetChecked = !checked;
    onBatchNodeCheck(eventKey, targetChecked, false, this);

    // Children conduct
    this.onDownCheckConduct(targetChecked);

    // Parent conduct
    if (onUpCheckConduct) {
      onUpCheckConduct(this, targetChecked, false, e);
    } else {
      onCheckConductFinished(e);
    }
  };

  getNodeChildren = () => {
    const { children } = this.props;
    let targetList = [];
    if (children) {
      const originList = toArray(children).filter(node => node);
      targetList = getNodeChildren(originList);
    }

    return targetList;
  };

  // Checkbox
  renderCheckbox = () => {
    const { checked, halfChecked } = this.props;

    let $checked = null;
    if (halfChecked) {
      $checked = (<img src={checkbox3Img} />);
    } else if (checked) {
      $checked = (<img src={checkbox2Img} />);
    } else {
      $checked = (<img src={checkbox1Img} />);
    }

    return (
      <span className="checkbox" onClick={this.onCheck}>
        {$checked}
        {/*
          checked ?
          <input type="checkbox" checked onClick={this.onCheck} />
          : <input type="checkbox" checked={false} onClick={this.onCheck} />
        */}
      </span>
    );
  };

  // Title
  renderSelector = () => {
    return (<div className="title-children">
      {this.props.title}
    </div>);
  }

  renderChildren = () => {
    const { pos } = this.props;
    const { bTree: { renderTreeNode } } = this.context;

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
          {this.renderCheckbox()}
          {this.renderSelector()}
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}

TreeNode.isTreeNode = 1;

export default TreeNode;