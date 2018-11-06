import * as React from "react";

import SegmentIcon from '@material-ui/icons/SubdirectoryArrowRight';
import OkIcon from '@material-ui/icons/Check';
import NopeIcon from '@material-ui/icons/Close';

import { PortWidget } from "./../../widgets/PortWidget";
import { NodeModel } from "./NodeModel";


export interface NodeWidgetProps {
	node: NodeModel;
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
				<div className={this.bem("__title")}>
					<div className={this.bem("__name")}>{this.props.node.name}</div>
				</div>

				<div className="node-container">
					<div className={this.bem("__icon")}>
						<SegmentIcon />
					</div>

					<div className={this.bem("__ports")}>
						<div className={this.bem("__left")}>
							<PortWidget name="left" node={this.props.node} />
								
						</div>
						
						<div className={this.bem("__right")}>
							<PortWidget name="right" node={this.props.node} >
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

						<div className={this.bem("__bottom")}>
							<PortWidget name="bottom" node={this.props.node} >
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
			</div>
		);
	}
}
