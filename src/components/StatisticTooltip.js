import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import CircularProgress from '@material-ui/core/CircularProgress';

class StatisticsTooltip extends React.Component {
  state = {
    html: `<p style="padding: 10px">lorem ipsum dolor sit amet</p>`,
    loading: false
  };

  componentDidMount() {
    // TODO: finish fetching logic when the specification is finished
  }

  render() {
    const { anchorElement } = this.props;

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
          // dangerouslySetInnerHTML={{ __html: this.state.html }}
        >
          {this.props.id}
        </div>
      </Popover>
    );
  }
}

StatisticsTooltip.propTypes = {
  id: PropTypes.string.isRequired,
  anchorElement: PropTypes.instanceOf(Element)
};

export default StatisticsTooltip;
