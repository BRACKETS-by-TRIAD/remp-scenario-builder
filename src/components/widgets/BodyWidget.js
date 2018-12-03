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
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import ActionIcon from '@material-ui/icons/Mail';
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

	saveChanges = () => {
		const payload  = {};
		const model = this.props.app.getDiagramEngine().getDiagramModel();
		const serializedModel = model.serializeDiagram();	

		// console.log(model);
		// console.log(serializedModel);
		
		payload.triggers = serializedModel.nodes.filter((node) => node.type == 'trigger')
											    .map((node) => this.formatNode(node, model));
		
		payload.elements = {};
		payload.visual = {};

		Object.entries(model.getNodes()).map((node) => {
			payload.visual[node[0]] = {
				x: node[1].x,
				y: node[1].y
			}
		});

		Object.entries(model.getNodes()).map((node) => {
			if(node[1].type !== 'trigger') {
				payload.elements[node[0]] = this.formatNode(node[1].serialize(), model);
			}
		});

		console.log(payload);
		
		localStorage.setItem('payload', JSON.stringify(payload));
	}

	getAllChildrenNodes(node, model, portName = "right") {
		const port = node.ports.find((port) => port.name == portName);

		return port.links.map((link) => {
			let nextNode = null;

			if(model.links[link].targetPort.parent.id !== node.id) {
				nextNode = model.links[link].targetPort.parent;
			} else {
				nextNode = model.links[link].sourcePort.parent;
			}

			// return this.formatNode(nextNode.serialize(), model);
			return { ...nextNode.serialize(), portName };
		});
	}

	formatNode(node, model) {
		if (node.type === "action") {
			return 					{
				uuid: node.id,
				title: node.name,
				type: 'action',
				action: {
					type: 'email',
					email: {
						code: 'mail_template_123'
					},
					descendants: this.getAllChildrenNodes(node, model).map((descendantNode) => this.formatDescendant(descendantNode, node))
				}
			}
		} else if(node.type === "segment") {
			const descendantsPositive = this.getAllChildrenNodes(node, model, "right").map((descendantNode) => this.formatDescendant(descendantNode, node));
			const descendantsNegative = this.getAllChildrenNodes(node, model, "bottom").map((descendantNode) => this.formatDescendant(descendantNode, node))

			return {
				uuid: node.id,
				name: 'nieco',
				segment: {
					code: 'segment1',
					descendants: [...descendantsPositive, ...descendantsNegative]
				},
				type: 'segment',
			}
		} else if(node.type === "trigger") {
			return {
				uuid: node.id,
				title: node.name,
				type: 'event',
				event: {
					name: 'registration'
				},
				elements: this.getAllChildrenNodes(node, model).map((descendantNode) => this.formatDescendant(descendantNode, node))
			}
		} else if(node.type === "wait") {
			return {
				uuid: node.id,
				title: node.name,
				type: 'wait',
				wait: { 
					minutes: node.wait_minutes,
					descendants: this.getAllChildrenNodes(node, model).map((descendantNode) => this.formatDescendant(descendantNode, node))
				}
			}
		}
	}

	formatDescendant = (node, parentNode) => {
		let descendant= {
			uuid: node.id
		};

		if(parentNode.type === "segment") {
			descendant.segment = {
				direction: node.portName === 'right' ? 'positive' : 'negative'
			};
		}

		return descendant;
	}

	discardChanges = () => {
		const model = this.props.app.getDiagramEngine().getDiagramModel();

		Object.entries(model.nodes).map((node) => {
			node[1].remove();
		});

		this.props.app.renderPayloadFromApi();
		this.props.app.getDiagramEngine().repaintCanvas();
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
										color="secondary"
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
					variant="permanent"
					classes={{
						paper: classes.drawerPaper,
					}}
				>
					<div className={classes.toolbar} />
						<List
							component="nav"
							subheader= {
								<ListSubheader component="div">Triggers</ListSubheader>
								}
						>
							<TrayItemWidget 
								model={{ type: "trigger" }} 
								name="Event" 
								icon={<TriggerIcon />}
							/>
						</List>

						<List
							component="nav"
							subheader= {
								<ListSubheader component="div">Actions</ListSubheader>
							}
						>
							<TrayItemWidget 
								model={{ type: "action" }} 
								name="Send email" 
								icon={<ActionIcon />} 
							/>
						</List>

						<List
							component="nav"
							subheader= {
								<ListSubheader component="div">Operations</ListSubheader>
							}
						>
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
									node = new Action.NodeModel({

									});
								} else if(data.type === "segment") {
									node = new Segment.NodeModel({
										segment: this.props.segments[0]
									});
								} else if(data.type === "trigger") {
									node = new Trigger.NodeModel({

									});
								} else if(data.type === "wait") {
									node = new Wait.NodeModel({

									});
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
