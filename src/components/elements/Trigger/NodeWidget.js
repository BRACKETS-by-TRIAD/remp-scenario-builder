import * as React from "react";
import { PortWidget } from "./../../widgets/PortWidget";
import TriggerIcon from '@material-ui/icons/Notifications';
import { NodeModel } from "./NodeModel";


export interface NodeWidgetProps {
	node: NodeModel;
	className: string;
	classBaseName: string;
}

export interface NodeWidgetState {}

export class NodeWidget extends React.Component<NodeWidgetProps, NodeWidgetState> {
	static defaultProps: NodeWidgetProps = {
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
				<div className="node-container">
					<div className={this.bem("__icon")}>
						<TriggerIcon />
					</div>

					<div className={this.bem("__ports")}>
						<div className={this.bem("__right")}>
							<PortWidget name="right" node={this.props.node} />
						</div>
					</div>
				</div>

				<div className={this.bem("__title")}>
					<div className={this.bem("__name")}>{this.props.node.name}</div>
				</div>
			</div>
		);
	}
}
