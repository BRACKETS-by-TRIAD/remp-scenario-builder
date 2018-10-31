import * as React from "react";
import * as _ from "lodash";

import { 
	DiagramWidget 
} from "storm-react-diagrams";

import { TrayWidget } from "./TrayWidget";
import { Application } from "./../Application";
import { TrayItemWidget } from "./TrayItemWidget";

import {
	Action,
	Event,
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

	render() {
		return (
			<div className="body">
				<div className="header">
					<div className="title">Storm React Diagrams - Demo 5</div>
				</div>
				<div className="content">
					<TrayWidget>
						<TrayItemWidget 
							model={{ type: "action" }} 
							name="Action" 
							color="rgb(192,255,0)" 
						/>

						<TrayItemWidget 
							model={{ type: "event" }} 
							name="Event" 
							color="rgb(0,192,255)" 
						/>

						<TrayItemWidget 
							model={{ type: "segment" }} 
							name="Segment" 
							color="rgb(0,192,255)" 
						/>

						<TrayItemWidget 
							model={{ type: "trigger" }} 
							name="Trigger" 
							color="rgb(0,192,255)" 
						/>

						<TrayItemWidget 
							model={{ type: "wait" }} 
							name="Wait" 
							color="rgb(0,192,255)" 
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
							} else if(data.type === "event") {
								node = new Event.NodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)");
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
						<DiagramWidget className="srd-demo-canvas" diagramEngine={this.props.app.getDiagramEngine()} />
					</div>
				</div>
			</div>
		);
	}
}
