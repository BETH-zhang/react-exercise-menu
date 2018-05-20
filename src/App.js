import React, { Component } from 'react';
import logo from './logo.svg';
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
        <div className="layout-right">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </div>
    );
  }
}

export default App;
