import React, { Component } from 'react';
import logo from './image/2018beth.jpeg';
import Menu from './component/Menu';
import menuData from './data/menu.json';
import './App.css';

console.log(menuData, 'menuData');
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="layout-left">
           <Menu title={menuData.title} data={menuData.jobs} />
        </div>
        <div className="layout-left" style={{ float: "right" }}>
           <Menu title={menuData.title1} data={menuData.jobs1} />
        </div>
        <div className="layout-right">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            带你玩React吧，嘿嘿嘿
          </p>
        </div>
      </div>
    );
  }
}

export default App;
