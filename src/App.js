import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { fetchSegments, fetchTriggers } from './actions';

// import logo from './logo.svg';
import './App.css';

import BodyWidget from './components/widgets/BodyWidget';
import { Application } from './components/Application';
import * as config from './config';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchSegments());
    dispatch(fetchTriggers());
  }

  render() {
    var app = new Application();
    axios.defaults.headers.common['Authorization'] = config.AUTH_TOKEN;

    return <BodyWidget app={app} segments={this.props.segments} />;
  }
}

function mapStateToProps(state) {
  const { segments } = state;

  return {
    segments: segments.avalaibleSegments
  };
}

export default connect(mapStateToProps)(App);
