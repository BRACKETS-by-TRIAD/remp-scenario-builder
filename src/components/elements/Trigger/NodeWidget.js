import * as React from 'react';
import { connect } from 'react-redux';
import { PortWidget } from './../../widgets/PortWidget';
import TriggerIcon from '@material-ui/icons/Notifications';
import { NodeModel } from './NodeModel';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MaterialSelect from '../../MaterialSelect';
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
      nodeFormName: this.props.node.name,
      // TODO: toto treba dat asi niekde do tej factory/modelu
      selectedTrigger: {},
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
          <div className={this.bem('__name')}>{this.props.node.name}</div>
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
              TODO: popis To subscribe to this website, please enter your email
              address here. We will send updates occasionally.
            </DialogContentText>

            <Grid container spacing={32}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
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
                  options={this.props.triggers.map(trigger => {
                    return {
                      value: trigger.code,
                      label: trigger.name
                    };
                  })}
                  value={this.state.selectedTrigger}
                  onChange={event => {
                    this.setState({
                      selectedTrigger: event,
                      nodeFormName: event.label
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
