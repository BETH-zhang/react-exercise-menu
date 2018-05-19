import React, { PropTypes, Component } from 'react';
import './index.css';

class Head extends Component {
  // static propTypes = {
  //   title: PropTypes.string,
  //   clearHandle: PropTypes.func,
  // }

  static defaultProps = {
    title: '我是默认名字'
  }

  constructor() {
    super();
    this.state = {
    }
  }

  render() {
    return (
      <div className="Head">
        <h1>{this.props.title}</h1>
        <a onClick={this.props.clearHandle}>清除</a>
      </div>
    );
  }
}

export default Head;
