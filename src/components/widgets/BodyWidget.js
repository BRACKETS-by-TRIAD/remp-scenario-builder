import * as React from "react";
import * as _ from "lodash";

import { 
	DiagramWidget,
	// DiagramProps,
	LinkModel,
	NodeModel
} from "storm-react-diagrams";

import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import ActionIcon from '@material-ui/icons/Star';
import TriggerIcon from '@material-ui/icons/Notifications';
import WaitIcon from '@material-ui/icons/AccessAlarmsOutlined';
import SegmentIcon from '@material-ui/icons/SubdirectoryArrowRight';

import { Application } from "./../Application";
import { TrayItemWidget } from "./TrayItemWidget";

import {
	Action,
	Segment,
	Trigger,
	Wait
} from "./../elements";

export interface BodyWidgetProps {
	app: Application;
	segments: Array
}

export interface BodyWidgetState {}

const drawerWidth = 240;

const styles = theme => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	content: {
		flexGrow: 1,
		padding: 0
	},
	toolbar: theme.mixins.toolbar,
});

class BodyWidget extends React.Component<BodyWidgetProps, BodyWidgetState> {
	constructor(props: BodyWidgetProps) {
		super(props);
		this.state = {};
	}

	cloneSelected = () => {
		const engine = this.props.app.getDiagramEngine();
		let offset = { x: 0, y: 100 };
		let model = engine.getDiagramModel();

		let itemMap = {};
		_.forEach(model.getSelectedItems(), (item: BaseModel<any>) => {
			let newItem = item.clone(itemMap);

			// offset the nodes slightly
			if (newItem instanceof NodeModel) {
				newItem.setPosition(newItem.x + offset.x, newItem.y + offset.y);
				model.addNode(newItem);
			} else if (newItem instanceof LinkModel) {
				// offset the link points
				newItem.getPoints().forEach(p => {
					p.updateLocation({ x: p.getX() + offset.x, y: p.getY() + offset.y });
				});
				model.addLink(newItem);
			}
			newItem.selected = false;
		});

		this.forceUpdate();
	}

	serialize = () => {
		const model = this.props.app.getDiagramEngine().getDiagramModel();
		const serializedModel = model.serializeDiagram();

		
	}

	render() {
		const { classes } = this.props;

		const diagramProps = {
			className: "srd-demo-canvas",
			diagramEngine: this.props.app.getDiagramEngine(),
			maxNumberPointsPerLink: 0,
			allowLooseLinks: false,

			// allowCanvasTranslation: false,
			// allowCanvasZoom: false
		}; // as DiagramProps;

		return (
			<div className="body">

			<div className={classes.root}>
				<CssBaseline />
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<Grid
							container
						>
							<Grid item xs={2}>
								<Typography variant="h6" color="inherit" noWrap>
									Diagram
								</Typography>
							</Grid>

							<Grid item xs={10}>
								<Grid 
									container 
									direction="row"
									justify="flex-end"
								>
									{/* <Button 
										size="small"
										variant="contained" 
										color="default"
										onClick={() => this.props.app.getDiagramEngine().zoomToFit()}
									>
										Zoom to fit
									</Button> */}
									
									<Button 
										size="small"
										variant="contained" 
										color="default"
										onClick={() => this.serialize()}
									>
										Serialize
									</Button>
									&nbsp;
									<Button 
										size="small"
										variant="contained" 
										color="secondary"
										onClick={this.cloneSelected}
									>
										Clone Selected
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Toolbar>
				</AppBar>
				<Drawer
					className={classes.drawer}
					variant="permanent"
					classes={{
						paper: classes.drawerPaper,
					}}
				>
					<div className={classes.toolbar} />
						<List>
							<TrayItemWidget 
								model={{ type: "trigger" }} 
								name="Trigger" 
								icon={<TriggerIcon />}
							/>

							<TrayItemWidget 
								model={{ type: "segment" }} 
								name="Segment" 
								icon={<SegmentIcon />}
							/>

							<TrayItemWidget 
								model={{ type: "wait" }} 
								name="Wait" 
								icon={<WaitIcon />}
							/>

							<TrayItemWidget 
								model={{ type: "action" }} 
								name="Action" 
								icon={<ActionIcon />} 
							/>
						</List>
					</Drawer>
					
					<main className={classes.content}>
						<div className={classes.toolbar} />

						<div
							className="diagram-layer"
							onDrop={event => {
								var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
								var nodesCount = _.keys(
									this.props.app
										.getDiagramEngine()
										.getDiagramModel()
										.getNodes()
								).length;
								
								var node = null;
								if (data.type === "action") {
									node = new Action.NodeModel("Node " + (nodesCount + 1), "rgb(192,255,0)");
								} else if(data.type === "segment") {
									node = new Segment.NodeModel({segment: this.props.segments[0]});
								} else if(data.type === "trigger") {
									node = new Trigger.NodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)");
								} else if(data.type === "wait") {
									node = new Wait.NodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)");
								}
								var points = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
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
							<DiagramWidget {...diagramProps}/>
						</div>
					</main>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(BodyWidget);
