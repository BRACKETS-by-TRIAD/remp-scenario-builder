import * as React from 'react';
import * as _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import {
  DiagramWidget,
  // DiagramProps,
  LinkModel,
  NodeModel
} from 'storm-react-diagrams';

import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import ActionIcon from '@material-ui/icons/Mail';
import TriggerIcon from '@material-ui/icons/Notifications';
import WaitIcon from '@material-ui/icons/AccessAlarmsOutlined';
import SegmentIcon from '@material-ui/icons/SubdirectoryArrowRight';

import * as config from './../../config';

import { Application } from './../Application';
import { TrayItemWidget } from './TrayItemWidget';

import { ExportService } from './../../services/ExportService';

import { Action, Segment, Trigger, Wait } from './../elements';

export interface BodyWidgetProps {
  app: Application;
  segments: Array;
}

export interface BodyWidgetState {}

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: 0
  },
  toolbar: theme.mixins.toolbar
});

class BodyWidget extends React.Component<BodyWidgetProps, BodyWidgetState> {
  constructor(props: BodyWidgetProps) {
    super(props);
    this.state = {
      editingName: false,
      name: 'Diagram',
      editedName: ''
    };

    axios.defaults.headers.common['Authorization'] = config.AUTH_TOKEN;
  }

  // cloneSelected = () => {
  //   const engine = this.props.app.getDiagramEngine();
  //   let offset = { x: 0, y: 100 };
  //   let model = engine.getDiagramModel();

  //   let itemMap = {};
  //   _.forEach(model.getSelectedItems(), (item: BaseModel<any>) => {
  //     let newItem = item.clone(itemMap);

  //     // offset the nodes slightly
  //     if (newItem instanceof NodeModel) {
  //       newItem.setPosition(newItem.x + offset.x, newItem.y + offset.y);
  //       model.addNode(newItem);
  //     } else if (newItem instanceof LinkModel) {
  //       // offset the link points
  //       newItem.getPoints().forEach(p => {
  //         p.updateLocation({ x: p.getX() + offset.x, y: p.getY() + offset.y });
  //       });
  //       model.addLink(newItem);
  //     }
  //     newItem.selected = false;
  //   });

  //   this.forceUpdate();
  // };

  saveChanges = () => {
    const exportService = new ExportService(
      this.props.app.getDiagramEngine().getDiagramModel()
    );

    const payload = {
      id: 1, //FIXME: hardcoded
      name: 'Test Scenario', //FIXME: hardcoded
      ...exportService.exportPayload()
    };

    // localStorage.setItem('payload', JSON.stringify(payload));
    console.log(payload);

    axios
      .post(`${config.URL_SCENARIO_CREATE}`, payload)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  // discardChanges = () => {
  //   const model = this.props.app.getDiagramEngine().getDiagramModel();

  //   // TODO: map->forEach
  //   Object.entries(model.nodes).forEach(node => {
  //     node[1].remove();
  //   });

  //   this.props.app.renderPayloadFromApi();
  //   this.props.app.getDiagramEngine().repaintCanvas();
  // };

  startEditingName = () => {
    this.setState({
      editedName: this.state.name,
      editingName: true
    });
  };

  cancelEditingName = () => {
    this.setState({
      editedName: '',
      editingName: false
    });
  };

  submitEditingName = () => {
    this.setState({
      name: this.state.editedName,
      editedName: '',
      editingName: false
    });
  };

  handleCloseAndSaveDuringChangingName = event => {
    if (event.keyCode === 27) {
      this.cancelEditingName();
    } else if (event.keyCode === 13) {
      this.submitEditingName();
    }
  };

  handleNameTyping = event => {
    this.setState({
      editedName: event.target.value
    });
  };

  render() {
    const { classes, canvas } = this.props;

    const diagramProps = {
      className: 'srd-demo-canvas',
      diagramEngine: this.props.app.getDiagramEngine(),
      maxNumberPointsPerLink: 0,
      allowLooseLinks: false,
      allowCanvasTranslation: canvas.pannable,
      allowCanvasZoom: canvas.zoomable
    }; // as DiagramProps;

    return (
      <div className='body'>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position='fixed' className={classes.appBar}>
            <Toolbar>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant='h6' color='inherit' noWrap>
                    {this.state.editingName ? (
                      <input
                        autoFocus
                        type='text'
                        value={this.state.editedName}
                        onChange={this.handleNameTyping}
                        onKeyDown={this.handleCloseAndSaveDuringChangingName}
                        onBlur={this.cancelEditingName}
                        className='changing-name-input'
                      />
                    ) : (
                      <span
                        onClick={this.startEditingName}
                        className='scenario-name'
                      >
                        {this.state.name}
                      </span>
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={8}>
                  <Grid container direction='row' justify='flex-end'>
                    {/* <Button 
										size="small"
										variant="contained" 
										color="default"
										onClick={() => this.props.app.getDiagramEngine().zoomToFit()}
									>
										Zoom to fit
									</Button> */}

                    <Button
                      size='small'
                      variant='contained'
                      color='secondary'
                      onClick={() => this.saveChanges()}
                    >
                      Save
                    </Button>
                    {/* &nbsp;
									<Button 
										size="small"
										variant="contained" 
										color="default"
										onClick={() => this.discardChanges()}
									>
										Discard changes
									</Button> */}
                    {/* &nbsp;
									<Button 
										size="small"
										variant="contained" 
										color="secondary"
										onClick={this.cloneSelected}
									>
										Clone Selected
									</Button> */}
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant='permanent'
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.toolbar} />
            <List
              component='nav'
              subheader={
                <ListSubheader component='div'>Triggers</ListSubheader>
              }
            >
              <TrayItemWidget
                model={{ type: 'trigger' }}
                name='Event'
                icon={<TriggerIcon />}
              />
            </List>

            <List
              component='nav'
              subheader={<ListSubheader component='div'>Actions</ListSubheader>}
            >
              <TrayItemWidget
                model={{ type: 'action' }}
                name='Send email'
                icon={<ActionIcon />}
              />
            </List>

            <List
              component='nav'
              subheader={
                <ListSubheader component='div'>Operations</ListSubheader>
              }
            >
              <TrayItemWidget
                model={{ type: 'segment' }}
                name='Segment'
                icon={<SegmentIcon />}
              />

              <TrayItemWidget
                model={{ type: 'wait' }}
                name='Wait'
                icon={<WaitIcon />}
              />
            </List>
          </Drawer>

          <main className={classes.content}>
            <div className={classes.toolbar} />

            <div
              className='diagram-layer'
              onDrop={event => {
                const stormDiagramNode = event.dataTransfer.getData(
                  'storm-diagram-node'
                );
                if (!stormDiagramNode) return;
                var data = JSON.parse(stormDiagramNode);
                // var nodesCount = _.keys(
                //   this.props.app
                //     .getDiagramEngine()
                //     .getDiagramModel()
                //     .getNodes()
                // ).length;

                var node = null;
                if (data.type === 'action') {
                  node = new Action.NodeModel({});
                } else if (data.type === 'segment') {
                  node = new Segment.NodeModel({
                    segment: this.props.segments[0]
                  });
                } else if (data.type === 'trigger') {
                  node = new Trigger.NodeModel({});
                } else if (data.type === 'wait') {
                  node = new Wait.NodeModel({});
                }
                var points = this.props.app
                  .getDiagramEngine()
                  .getRelativeMousePoint(event);
                node.x = points.x;
                node.y = points.y;
                this.props.app
                  .getDiagramEngine()
                  .getDiagramModel()
                  .addNode(node);
                this.forceUpdate();
              }}
              onDragOver={event => {
                event.preventDefault();
              }}
            >
              <DiagramWidget {...diagramProps} />
            </div>
          </main>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    canvas: state.canvas,
    scenario: state.scenario
  };
}

export default compose(
  withStyles(styles, { name: 'BodyWidget' }),
  connect(
    mapStateToProps,
    null
  )
)(BodyWidget);
