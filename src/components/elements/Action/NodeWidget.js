import * as React from "react";
import * as _ from "lodash";
import { PortWidget, DefaultPortLabel } from "storm-react-diagrams";
import { NodeModel } from "./NodeModel";


export interface NodeWidgetProps {
	node: NodeModel;
	className: string;
	classBaseName: string;
	size?: number;
}

export interface NodeWidgetState {}

export class NodeWidget extends React.Component<NodeWidgetProps, NodeWidgetState> {
	static defaultProps: NodeWidgetProps = {
		size: 150,
		node: null
	};

	constructor(props: NodeWidgetProps) {
		super(props);
		this.state = {};
	}

	bem(selector: string): string {
		return this.props.classBaseName + selector + " " + this.props.className + selector + " ";
	}

	getClassName() {
		return this.props.classBaseName + " " +this.props.className;
	}

	render() {
		return (
			<div className={this.getClassName()} 
				style={{ background: this.props.node.color }}>
				
				<div className={this.bem("__title")}>
					<div className={this.bem("__name")}>{this.props.node.name}</div>
				</div>
				<div className={this.bem("__ports")}>
					<div className={this.bem("__in")}>

						<PortWidget name="left" node={this.props.node} />
					</div>
					<div className={this.bem("__out")}>
						<PortWidget name="right" node={this.props.node} />
					</div>
				</div>
			</div>
		);
	}
}
