import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import { BodyWidget } from "./components/widgets/BodyWidget";
import { Application } from "./components/Application";

class App extends Component {
  

  render() {
    var app = new Application();

    return <BodyWidget app={app} />;
  }
}

export default App;
