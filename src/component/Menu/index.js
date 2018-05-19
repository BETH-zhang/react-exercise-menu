import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
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
      data: [],
      statistics: {}
    }
  }

  componentWillMount() {
    const initData = this.props.data.slice(); // 复制一份接口数据
    const statistics = this.initStatistics(initData, 0);

    this.setState({
      data: initData,
      statistics,
    });
  }

  initStatistics = (data, parentIndex) => {
    let obj = {};
    if (data.length) {
      data.forEach((item, index) => {
        if (item.children) {
          const currentIndex = `${parentIndex}-${index}`;
          obj[`${currentIndex}`] = 0;
          const objTmp = this.initStatistics(item.children, currentIndex);
          obj = Object.assign({}, obj, objTmp);
        }
      })
    }
    return obj;
  }

  clearHandle = () => {
    console.log('清除');
    const statistics = this.state.statistics;
    Object.keys(statistics).map((key) => {
      statistics[key] = 0;
    })

    this.setState({
      statistics,
      checkedKeys: []
    });
  }

  onCheck = () => {
    console.log('点击菜单列表中的checkbox');
  }

  renderTitle = (item, currentIndex) => (<div className="job-title">
    {item.title}
    <span
      className={classNames({
        'tag': true,
        'tag-bg': item.children,
      })}
    >
      {
        item.children ? this.state.statistics[currentIndex]
          : item.personCount
      }
    </span>
  </div>)

  loop = (data, parentIndex) => data.length && data.map((item, index) => {
    const currentIndex = `${parentIndex}-${index}`;
    return (<TreeNode
      currentIndex={currentIndex}
      className={classNames({
        [`parentIndex-${parentIndex}`]: true,
        [`node-${currentIndex}`]: true
      })}
      title={this.renderTitle(item, currentIndex)}
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
