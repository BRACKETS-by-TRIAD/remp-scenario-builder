import * as React from 'react';
import { connect } from 'react-redux';
import SegmentIcon from '@material-ui/icons/SubdirectoryArrowRight';
import OkIcon from '@material-ui/icons/Check';
import NopeIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import groupBy from 'lodash/groupBy';

import StatisticsTooltip from '../../StatisticTooltip';
import { PortWidget } from './../../widgets/PortWidget';
import MaterialSelect from '../../MaterialSelect';
import { setCanvasZoomingAndPanning } from '../../../actions';

class NodeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeFormName: this.props.node.name,
      selectedSegment: this.props.node.selectedSegment,
      dialogOpened: false,
      anchorElementForTooltip: null
    };
  }

  bem(selector) {
    return (
      this.props.classBaseName +
      selector +
      ' ' +
      this.props.className +
      selector +
      ' '
    );
  }

  getClassName() {
    return this.props.classBaseName + ' ' + this.props.className;
  }

  openDialog = () => {
    this.setState({
      dialogOpened: true,
      nodeFormName: this.props.node.name,
      selectedSegment: this.props.node.selectedSegment,
      anchorElementForTooltip: null
    });
    this.props.dispatch(setCanvasZoomingAndPanning(false));
  };

  closeDialog = () => {
    this.setState({ dialogOpened: false });
    this.props.dispatch(setCanvasZoomingAndPanning(true));
  };

  // maybe refactor to more effective way if is a problem
  transformOptionsForSelect = () => {
    const lodashGrouped = groupBy(
      this.props.segments,
      segment => segment.group.name
    );

    const properlyGrouped = [];

    Object.keys(lodashGrouped).forEach(key => {
      properlyGrouped.push({
        label: key,
        sorting: lodashGrouped[key][0].group.sorting,
        options: lodashGrouped[key].map(segment => ({
          value: segment.code,
          label: segment.name
        }))
      });
    });

    const properlyGroupedSorted = properlyGrouped.sort((a, b) => {
      return a.sorting - b.sorting;
    });

    return properlyGroupedSorted;
  };

  handleNodeMouseEnter = event => {
    if (!this.state.dialogOpened) {
      this.setState({ anchorElementForTooltip: event.currentTarget });
    }
  };

  handleNodeMouseLeave = () => {
    this.setState({ anchorElementForTooltip: null });
  };

  getFormatedValue = () => {
    const match = this.props.segments.find(segment => {
      return segment.code === this.state.selectedSegment;
    });

    return match
      ? {
          value: match.code,
          label: match.name
        }
      : {};
  };

  getSelectedSegmentValue = () => {
    const selected = this.props.segments.find(
      segment => segment.code === this.props.node.selectedSegment
    );

    return selected ? ` - ${selected.name}` : '';
  };

  render() {
    return (
      <div
        className={this.getClassName()}
        onDoubleClick={() => {
          this.openDialog();
        }}
        onMouseEnter={this.handleNodeMouseEnter}
        onMouseLeave={this.handleNodeMouseLeave}
      >
        <div className={this.bem('__title')}>
          <div className={this.bem('__name')}>
            {this.props.node.name
              ? this.props.node.name
              : `Segment ${this.getSelectedSegmentValue()}`}
          </div>
        </div>

        <div className='node-container'>
          <div className={this.bem('__icon')}>
            <SegmentIcon />
          </div>

          <div className={this.bem('__ports')}>
            <div className={this.bem('__left')}>
              <PortWidget name='left' node={this.props.node} />
            </div>

            <div className={this.bem('__right')}>
              <PortWidget name='right' node={this.props.node}>
                <OkIcon
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    color: '#2ECC40'
                  }}
                />
              </PortWidget>
            </div>

            <div className={this.bem('__bottom')}>
              <PortWidget name='bottom' node={this.props.node}>
                <NopeIcon
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '-22px',
                    color: '#FF695E'
                  }}
                />
              </PortWidget>
            </div>
          </div>
        </div>

        <StatisticsTooltip
          id={this.props.node.id}
          anchorElement={this.state.anchorElementForTooltip}
        />

        <Dialog
          open={this.state.dialogOpened}
          onClose={this.closeDialog}
          aria-labelledby='form-dialog-title'
          onKeyUp={event => {
            if (event.keyCode === 46 || event.keyCode === 8) {
              event.preventDefault();
              event.stopPropagation();
              return false;
            }
          }}
        >
          <DialogTitle id='form-dialog-title'>Segment node</DialogTitle>

          <DialogContent>
            <DialogContentText>
              TODO: popis To subscribe to this website, please enter your email
              address here. We will send updates occasionally.
            </DialogContentText>

            <Grid container spacing={32}>
              <Grid item xs={6}>
                <TextField
                  margin='normal'
                  id='segment-name'
                  label='Node name'
                  fullWidth
                  value={this.state.nodeFormName}
                  onChange={event => {
                    this.setState({
                      nodeFormName: event.target.value
                    });
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={32}>
              <Grid item xs={12}>
                <MaterialSelect
                  options={this.transformOptionsForSelect()}
                  value={this.getFormatedValue()}
                  onChange={event => {
                    this.setState({
                      selectedSegment: event.value
                    });
                  }}
                  placeholder='Pick one'
                  label='Selected Segment'
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              color='secondary'
              onClick={() => {
                this.closeDialog();
              }}
            >
              Cancel
            </Button>

            <Button
              color='primary'
              onClick={() => {
                // https://github.com/projectstorm/react-diagrams/issues/50 huh

                this.props.node.name = this.state.nodeFormName;
                this.props.node.selectedSegment = this.state.selectedSegment;

                this.props.diagramEngine.repaintCanvas();
                this.closeDialog();
              }}
            >
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { segments } = state;

  return {
    segments: segments.avalaibleSegments
  };
}

export default connect(mapStateToProps)(NodeWidget);
