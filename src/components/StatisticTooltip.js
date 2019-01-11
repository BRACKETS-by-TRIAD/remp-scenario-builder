import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { connect } from 'react-redux';

import * as config from '../config';
import { setCanvasNotification } from '../actions';

class StatisticsTooltip extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    anchorElement: PropTypes.instanceOf(Element)
  };

  state = {
    html: null,
    loading: true
  };

  componentDidUpdate(oldProps) {
    if (
      this.props.scenarioID &&
      this.props.scenarioID !== oldProps.scenarioID
    ) {
      this.fetchStatistics();
    }
  }

  fetchStatistics() {
    const { dispatch, id, scenarioID } = this.props;
    if (!scenarioID) return;

    this.setState({ loading: true });
    axios
      .get(
        `${config.URL_TOOLTIPS}?scenario_id=${scenarioID}&element_uuid=${id}`
      )
      .then(({ data }) => {
        this.setState({ html: data.html });
      })
      .catch(error => {
        console.log(error);
        dispatch(
          setCanvasNotification({
            open: true,
            variant: 'error',
            text: 'Tooltip fetching failed.'
          })
        );
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { anchorElement, scenarioID } = this.props;
    const { html } = this.state;
    if (!html) return null;

    return (
      <Popover
        open={Boolean(anchorElement)}
        anchorEl={anchorElement}
        // onEnter={() => console.log('opened?')}
        style={{ pointerEvents: 'none' }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        {this.state.loading && (
          <div className='node-tooltip-loader'>
            <CircularProgress size={30} />
          </div>
        )}

        <div
          className='node-tooltip-wrapper'
          dangerouslySetInnerHTML={{ __html: this.state.html }}
        />
      </Popover>
    );
  }
}

function mapStateToProps(state) {
  const { scenario } = state;

  return {
    scenarioID: scenario.id
  };
}

export default connect(mapStateToProps)(StatisticsTooltip);
