import * as React from 'react';
import { connect } from 'react-redux';
import TriggerIcon from '@material-ui/icons/Notifications';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { PortWidget } from './../../widgets/PortWidget';
import MaterialSelect from '../../MaterialSelect';
import StatisticsTooltip from '../../StatisticTooltip';
import { setCanvasZoomingAndPanning } from '../../../actions';

class NodeWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nodeFormName: this.props.node.name,
      selectedTrigger: this.props.node.selectedTrigger,
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
      anchorElementForTooltip: null
    });
    this.props.dispatch(setCanvasZoomingAndPanning(false));
  };

  closeDialog = () => {
    this.setState({ dialogOpened: false });
    this.props.dispatch(setCanvasZoomingAndPanning(true));
  };

  handleNodeMouseEnter = event => {
    if (!this.state.dialogOpened) {
      this.setState({ anchorElementForTooltip: event.currentTarget });
    }
  };

  handleNodeMouseLeave = () => {
    this.setState({ anchorElementForTooltip: null });
  };

  getTriggersInSelectableFormat = () => {
    return this.props.triggers.map(trigger => {
      return {
        value: trigger.code,
        label: trigger.name
      };
    });
  };

  getSelectedTriggerValue = () => {
    const selected = this.getTriggersInSelectableFormat().find(
      trigger => trigger.value === this.props.node.selectedTrigger
    );

    return selected ? ` - ${selected.label}` : '';
  };

  render() {
    return (
      <div
        className={this.getClassName()}
        style={{ background: this.props.node.color }}
        onDoubleClick={() => {
          this.openDialog();
        }}
        onMouseEnter={this.handleNodeMouseEnter}
        onMouseLeave={this.handleNodeMouseLeave}
      >
        <div className='node-container'>
          <div className={this.bem('__icon')}>
            <TriggerIcon />
          </div>

          <div className={this.bem('__ports')}>
            <div className={this.bem('__right')}>
              <PortWidget name='right' node={this.props.node} />
            </div>
          </div>
        </div>

        <div className={this.bem('__title')}>
          <div className={this.bem('__name')}>
            {this.props.node.name
              ? this.props.node.name
              : `Event ${this.getSelectedTriggerValue()}`}
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
          <DialogTitle id='form-dialog-title'>Trigger node</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Events are emitted on any change related to user. We recommend to
              combine "before" events with "Wait" operations to achieve
              execution at any desired time.
            </DialogContentText>

            <Grid container spacing={32}>
              <Grid item xs={6}>
                <TextField
                  margin='normal'
                  id='trigger-name'
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
                  options={this.getTriggersInSelectableFormat()}
                  value={this.getTriggersInSelectableFormat().find(
                    option => option.value === this.state.selectedTrigger
                  )}
                  onChange={event => {
                    this.setState({
                      selectedTrigger: event.value
                    });
                  }}
                  placeholder='Pick one'
                  label='Selected Trigger'
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
                this.props.node.selectedTrigger = this.state.selectedTrigger;

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
  const { triggers } = state;

  return {
    triggers: triggers.avalaibleTriggers
  };
}

export default connect(mapStateToProps)(NodeWidget);
