import * as React from "react";
import * as _ from "lodash";

import { 
	DiagramWidget,
	DiagramProps,
	LinkModel,
	NodeModel
} from "storm-react-diagrams";

import { TrayWidget } from "./TrayWidget";
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
}

export interface BodyWidgetState {}

export class BodyWidget extends React.Component<BodyWidgetProps, BodyWidgetState> {
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

	render() {

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
				<div className="header">
					<div className="title">Storm React Diagrams - Demo 5</div>&nbsp;
					<button onClick={() => this.props.app.getDiagramEngine().zoomToFit()}>Zoom to fit</button>&nbsp;
					<button onClick={this.cloneSelected}>Clone Selected</button>
				</div>
				<div className="content">
					<TrayWidget>

						<TrayItemWidget 
							model={{ type: "trigger" }} 
							name="Trigger" 
							color="rgb(0,192,255)" 
						/>

						<TrayItemWidget 
							model={{ type: "segment" }} 
							name="Segment" 
							color="rgb(0,192,255)" 
						/>

						<TrayItemWidget 
							model={{ type: "wait" }} 
							name="Wait" 
							color="rgb(0,192,255)" 
						/>

						<TrayItemWidget 
							model={{ type: "action" }} 
							name="Action" 
							color="rgb(192,255,0)" 
						/>
					</TrayWidget>
					
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
								node = new Segment.NodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)");
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
				</div>
			</div>
		);
	}
}
