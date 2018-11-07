import * as React from "react";

import SegmentIcon from '@material-ui/icons/SubdirectoryArrowRight';
import OkIcon from '@material-ui/icons/Check';
import NopeIcon from '@material-ui/icons/Close';

import { PortWidget } from "./../../widgets/PortWidget";
import { NodeModel } from "./NodeModel";

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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
		this.state = {
			nodeFormName: this.props.node.name,
			dialogOpened: false
		};
	}

	bem(selector: string): string {
		return this.props.classBaseName + selector + " " + this.props.className + selector + " ";
	}

	getClassName() {
		return this.props.classBaseName + " " +this.props.className;
	}

	openDialog = () => {
		this.setState({ 
			dialogOpened: true,
			nodeFormName: this.props.node.name,
		});
	};
	
	closeDialog = () => {
		this.setState({ dialogOpened: false });
	};

	render() {
		return (
			<div 
				className={this.getClassName()} 
				style={{ background: this.props.node.color }}
				onDoubleClick={() => {
					this.openDialog();
				}}
			>
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

				<Dialog
					open={this.state.dialogOpened}
					onClose={this.closeDialog}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Segment node</DialogTitle>

					<DialogContent>
						<DialogContentText>
							TODO: popis 
							To subscribe to this website, please enter your email address here. We will send
							updates occasionally.
						</DialogContentText>

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
					</DialogContent>

					<DialogActions>
						<Button 
							color="secondary"
							onClick={() => {
								this.closeDialog();
							}} 
						>
							Cancel
						</Button>

						<Button 
							color="primary"
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
