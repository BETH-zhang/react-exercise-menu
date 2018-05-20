/* eslint no-loop-func: 0*/
import { Children } from 'react';

export const toArray = (myObj) => {
  const array = myObj.map((value, index) => {
    return value;
  });
  return array;
}

export function getPosition(level, index) {
  return `${level}-${index}`;
}

export function getNodeChildren(children) {
  const childList = Array.isArray(children) ? children : [children];
  // return childList;
  return childList
    .filter((child) => {
      return child && child.type && child.type.isTreeNode;
    });
}

export function isCheckDisabled(node) {
  const { disabled, disableCheckbox } = node.props || {};
  return !!(disabled || disableCheckbox);
}

export function traverseTreeNodes(treeNodes, subTreeData, callback) {
  // treeNodes ? '点击父级‘ ：’点击子级‘
  if (typeof subTreeData === 'function') {
    callback = subTreeData;
    subTreeData = false;
  }

  function processNode(node, index, parent) {
    const children = node ? node.props.children : treeNodes;
    const pos = node ? getPosition(parent.pos, index) : 0;

    // Filter children
    const childList = getNodeChildren(children);

    // Process node if is not root
    if (node) {
      const data = {
        node,
        index,
        pos,
        key: node.key || pos,
        parentPos: parent.node ? parent.pos : null,
      };

      // Children data is not must have
      if (subTreeData) {
        // Statistic children
        const subNodes = [];
        Children.forEach(childList, (subNode, subIndex) => {
          // Provide limit snapshot
          const subPos = getPosition(pos, index);
          subNodes.push({
            node: subNode,
            key: subNode.key || subPos,
            pos: subPos,
            index: subIndex,
          });
        });
        data.subNodes = subNodes;
      }

      // Can break traverse by return false
      if (callback(data) === false) {
        return;
      }
    }

    // Process children node
    Children.forEach(childList, (subNode, subIndex) => {
      processNode(subNode, subIndex, { node, pos });
    });
  }

  processNode(null);
}

export function getNodesStatistic(treeNodes) {
  const statistic = {
    keyNodes: {},
    posNodes: {},
    nodeList: [],
  };

  traverseTreeNodes(treeNodes, true, ({ node, index, pos, key, subNodes, parentPos }) => {
    const data = { node, index, pos, key, subNodes, parentPos };
    statistic.keyNodes[key] = data;
    statistic.posNodes[pos] = data;
    statistic.nodeList.push(data);
  });

  return statistic;
}

export function calcCheckStateConduct(treeNodes, checkedKeys) {
  const { keyNodes, posNodes } = getNodesStatistic(treeNodes);

  const tgtCheckedKeys = {};
  const tgtHalfCheckedKeys = {};

  // Conduct up
  function conductUp(key, halfChecked) {
    if (tgtCheckedKeys[key]) return;

    const { subNodes = [], parentPos, node } = keyNodes[key];
    if (isCheckDisabled(node)) return;

    const allSubChecked = !halfChecked && subNodes
      .filter(sub => !isCheckDisabled(sub.node))
      .every(sub => tgtCheckedKeys[sub.key]);

    if (allSubChecked) {
      tgtCheckedKeys[key] = true;
    } else {
      tgtHalfCheckedKeys[key] = true;
    }

    if (parentPos !== null) {
      conductUp(posNodes[parentPos].key, !allSubChecked);
    }
  }

  // Conduct down
  function conductDown(key) {
    if (tgtCheckedKeys[key]) return;
    const { subNodes = [], node } = keyNodes[key];

    if (isCheckDisabled(node)) return;

    tgtCheckedKeys[key] = true;

    subNodes.forEach((sub) => {
      conductDown(sub.key);
    });
  }

  function conduct(key) {
    const { subNodes = [], parentPos, node } = keyNodes[key];
    tgtCheckedKeys[key] = true;

    if (isCheckDisabled(node)) return;

    // Conduct down
    subNodes
      .filter(sub => !isCheckDisabled(sub.node))
      .forEach((sub) => {
        conductDown(sub.key);
      });

    // Conduct up
    if (parentPos !== null) {
      conductUp(posNodes[parentPos].key);
    }
  }

  checkedKeys.forEach((key) => {
    conduct(key);
  });

  return {
    checkedKeys: Object.keys(tgtCheckedKeys),
    halfCheckedKeys: Object.keys(tgtHalfCheckedKeys)
      .filter(key => !tgtCheckedKeys[key]),
  };
}

export function calcCheckedKeys(keys, props) {
  const { children } = props;

  if (!keys) {
    return null;
  }

  // Convert keys to object format
  let keyProps;
  if (Array.isArray(keys)) {
    keyProps = {
      checkedKeys: keys,
      halfCheckedKeys: undefined,
    };
  } else if (typeof keys === 'object') {
    keyProps = {
      checkedKeys: keys.checked || undefined,
      halfCheckedKeys: keys.halfChecked || undefined,
    };
  } else {
    return null;
  }

  // Conduct calculate the check status
  const { checkedKeys = [] } = keyProps;
  return calcCheckStateConduct(children, checkedKeys);
}

export function getFullKeyList(treeNodes) {
  const keyList = [];
  traverseTreeNodes(treeNodes, ({ key }) => {
    keyList.push(key);
  });
  return keyList;
}