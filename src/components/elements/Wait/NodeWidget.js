import * as React from 'react';
import { connect } from 'react-redux';
import { PortWidget } from './../../widgets/PortWidget';
// import WaitIcon from '@material-ui/icons/Timer';
import WaitIcon from '@material-ui/icons/AccessAlarmsOutlined';
import { NodeModel } from './NodeModel';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { setCanvasZoomingAndPanning } from '../../../actions';
import StatisticsTooltip from '../../StatisticTooltip';

export interface NodeWidgetProps {
  node: NodeModel;
  className: string;
  classBaseName: string;
}

export interface NodeWidgetState {}

class NodeWidget extends React.Component<NodeWidgetProps, NodeWidgetState> {
  static defaultProps: NodeWidgetProps = {
    node: null
  };

  constructor(props: NodeWidgetProps) {
    super(props);
    this.state = {
      nodeFormWaitingTime: this.props.node.wait_minutes,
      nodeFormName: this.props.node.name,
      dialogOpened: false,
      anchorElementForTooltip: null
    };
  }

  bem(selector: string): string {
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
      nodeFormWaitingTime: this.props.node.wait_minutes,
      nodeFormName: this.props.node.name
    });
    this.props.dispatch(setCanvasZoomingAndPanning(false));
  };

  closeDialog = () => {
    this.setState({ dialogOpened: false });
    this.props.dispatch(setCanvasZoomingAndPanning(true));
  };

  render() {
    return (
      <div
        className={this.getClassName()}
        style={{ background: this.props.node.color }}
        onDoubleClick={() => {
          this.openDialog();
        }}
        onMouseEnter={event =>
          this.setState({ anchorElementForTooltip: event.currentTarget })
        }
        onMouseLeave={() => this.setState({ anchorElementForTooltip: null })}
      >
        <div className='node-container'>
          <div className={this.bem('__icon')}>
            <WaitIcon />
          </div>
          <div className={this.bem('__ports')}>
            <div className={this.bem('__left')}>
              <PortWidget name='left' node={this.props.node} />
            </div>
            <div className={this.bem('__right')}>
              <PortWidget name='right' node={this.props.node} />
            </div>
          </div>
        </div>
        <div className={this.bem('__title')}>
          <div className={this.bem('__name')}>
            {this.props.node.name} ({this.props.node.wait_minutes} minutes)
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
          <DialogTitle id='form-dialog-title'>Wait node</DialogTitle>
          <DialogContent>
            <DialogContentText>
              TODO: popis To subscribe to this website, please enter your email
              address here. We will send updates occasionally.
            </DialogContentText>

            <Grid container spacing={32}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  margin='normal'
                  id='waiting-time'
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

              <Grid item xs={6}>
                <TextField
                  autoFocus
                  margin='normal'
                  id='waiting-time'
                  label='Waiting time'
                  type='number'
                  fullWidth
                  value={this.state.nodeFormWaitingTime}
                  onChange={event => {
                    this.setState({
                      nodeFormWaitingTime: event.target.value
                    });
                  }}
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

                this.props.node.wait_minutes = this.state.nodeFormWaitingTime;
                this.props.node.name = this.state.nodeFormName;

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
