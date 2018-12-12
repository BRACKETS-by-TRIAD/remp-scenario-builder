import * as React from 'react';
import { connect } from 'react-redux';

import SegmentIcon from '@material-ui/icons/SubdirectoryArrowRight';
import OkIcon from '@material-ui/icons/Check';
import NopeIcon from '@material-ui/icons/Close';

import { PortWidget } from './../../widgets/PortWidget';
import { NodeModel } from './NodeModel';

// import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select';

export interface NodeWidgetProps {
  node: NodeModel;
}

export interface NodeWidgetState {}

class NodeWidget extends React.Component<NodeWidgetProps, NodeWidgetState> {
  static defaultProps: NodeWidgetProps = {
    node: null
  };

  constructor(props: NodeWidgetProps) {
    super(props);
    this.state = {
      nodeFormName: this.props.node.segment.name,
      nodeSegmentId: this.props.node.segment.id,
      dialogOpened: false
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
      nodeFormName: this.props.node.segment.name,
      nodeSegmentId: this.props.node.segment.id
    });
  };

  closeDialog = () => {
    this.setState({ dialogOpened: false });
  };

  render() {
    return (
      <div
        className={this.getClassName()}
        onDoubleClick={() => {
          this.openDialog();
        }}
      >
        <div className={this.bem('__title')}>
          <div className={this.bem('__name')}>
            {this.props.node.segment.name}
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

            {/* <Grid container spacing={32}>
							<Grid item xs={6}>
								<TextField
									autoFocus
									margin="normal"
									id="segment-name"
									label="Node name"
									fullWidth
									value={this.state.nodeFormName}
									onChange={(event) => {
										this.setState({
											nodeFormName: event.target.value,
										});
									}}
								/>	
							</Grid> */}

            {/* <Grid item xs={6}> */}

            <Select
              value={this.state.nodeSegmentId}
              onChange={event => {
                this.setState({
                  nodeSegmentId: event.value,
                  nodeFormName: event.label
                });
              }}
              options={this.props.segments.map(segment => {
                return {
                  value: segment.code,
                  label: segment.name
                };
              })}
              menuPosition={'fixed'} // absolute
              menuPlacement={'bottom'}
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
            {/* <TextField
              id='select-segment'
              select
              label='Select segment'
              value={this.state.nodeSegmentId}
              onChange={event => {
                this.setState({
                  nodeSegmentId: event.target.value,
                  nodeFormName: this.props.segments.find(function(segment) {
                    return segment.code === event.target.value;
                  }).name
                });
              }}
              helperText='Please select your segment'
              margin='normal'
            >
              {this.props.segments &&
                this.props.segments.map(option => (
                  <MenuItem
                    key={`segment-code-${option.code}`}
                    value={option.code}
                  >
                    {option.name}
                  </MenuItem>
                ))}
            </TextField> */}
            {/* </Grid>
						</Grid> */}
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

                this.props.node.segment.name = this.state.nodeFormName;
                this.props.node.segment.id = this.state.nodeSegmentId;

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
