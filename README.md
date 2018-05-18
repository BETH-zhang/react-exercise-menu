## 职位招聘的菜单UI交互组件
-----

#### 截屏（Screenshots）
TODO

#### 功能点（Feature）
* 点击清空:清空所有选项(所有选项都变成unchecked)
* 点击部门左侧checkbox:toggle所有子目录下checkbox以及部门的checkbox
* 点击单个岗位checkbox:toggle点击的checkbox

#### 要求（Requirement）
* 像素级实现
* 使用 React.js 的 jsx（不需要工程化、不需要数据层依赖库 如flux，redux等）
* 注意state和props的用法
* 使用git，规范git commit的提交纪录
* 设计代码结构应尽量idiomatic
* 代码尽可能地简洁，规范，模块化，保持代码风格的一致性
* 可以使用ES6

#### 需要做（TODO）
* 完成项目的基础页面，react、react-dom、babel-standalone(或babel-core)
* 模拟定义mock接口的数据格式
* 定义前端的state对象数据结构
* 拆分组件
  * Menu组件（业务组件）
  * Tree组件（基础组件）
  * TreeNode组件（基础组件）
* 像素级UI样式
* 打印git commit日志

#### Example
TODO

#### 组件API（Component API）
-----
##### Menu props

name | description | type | default |
:-------|:------|:-----|:------|
title | 菜单名称 | String | '我是默认名字' |
data | 菜单的远程接口数据 | Array | [] |

##### Tree props
name | description | type | default |
:-------|:------|:-----|:------|
className | 添加到dom节点上的自定义样式 | String | '' |
checkedKeys | 所有被选择的treeNode | String[] | [] |
onCheck | 点击当前界点或checkbox的事件监听 | function(checkedKeys, e: {}) | - |

##### TreeNode props
name | description | type | default |
:-------|:------|:-----|:------|
className | 添加到dom节点上的自定义样式 | String | '' |
title | 节点的title | String/element | - |
key | 节点的唯一标示 | String | 0、1、2... |
isLeaf | 是否是叶子节点 | bool |  false |

#### Commit日志
TODO

#### 扩展性
TODO
