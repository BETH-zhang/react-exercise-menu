import React, { PropTypes, Component } from 'react';
import Head from '../Head';
import Tree from '../Tree';
import TreeNode from '../Tree/treeNode';
import './index.css';

class Menu extends Component {
  // static propTypes = {
  //   title: PropTypes.string,
  //   data: PropTypes.ary,
  // }

  constructor(props) {
    super();
    this.state = {
      checkedKeys: [],
      data: props.data.slice() // 复制一份接口数据
    }
  }

  clearHandle = () => {
    console.log('清除');
  }

  onCheck = () => {
    console.log('点击菜单列表中的checkbox');
  }

  loop = (data, parentIndex) => data.length && data.map((item, index) => {
    console.log(item, index);
    const currentIndex = `${parentIndex}-${index}`;
    return (<TreeNode
      key={currentIndex}
      className={`node-${currentIndex}`}
      title={item.title}
    >
      {item.children && this.loop(item.children, currentIndex)}
    </TreeNode>);
  })

  render() {
    console.log(this.props.data);
    return (
      <div className="Menu">
        <Head
          title={this.props.title}
          clearHandle={this.clearHandle}
        />

        <Tree
          className="menu-tree"
          checkedKeys={this.state.checkedKeys}
          onCheck={this.onCheck}
        >
          {this.loop(this.state.data, 0)}
        </Tree>
      </div>
    );
  }
}

export default Menu;
