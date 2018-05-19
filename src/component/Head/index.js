import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';

class Head extends Component {
  static propTypes = {
    title: PropTypes.string,
    clearHandle: PropTypes.func,
  }

  static defaultProps = {
    title: '我是默认名字'
  }

  constructor(props) {
    super(props);
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
