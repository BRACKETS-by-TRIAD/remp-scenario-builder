import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  fetchSegments,
  fetchTriggers,
  fetchScenario,
  setScenarioName
} from './actions';

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

    if (config.SCENARIO_ID) {
      dispatch(fetchScenario(config.SCENARIO_ID));
    } else {
      dispatch(setScenarioName('Unnamed scenario'));
    }
  }

  render() {
    var app = new Application(this.props.scenario.payload);

    return <BodyWidget app={app} segments={this.props.segments} />;
  }
}

function mapStateToProps(state) {
  const { segments, scenario } = state;

  return {
    segments: segments.avalaibleSegments,
    scenario: scenario
  };
}

export default connect(mapStateToProps)(App);
