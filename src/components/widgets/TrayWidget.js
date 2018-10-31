import * as React from "react";

export interface TrayWidgetProps {}
export interface TrayWidgetState {}


export class TrayWidget extends React.Component<TrayWidgetProps, TrayWidgetState> {
	static defaultProps: TrayWidgetProps = {};

	constructor(props: TrayWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return <div className="tray">{this.props.children}</div>;
	}
}
