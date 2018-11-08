import {
	DefaultLinkModel
} from "storm-react-diagrams";

export class LinkModel extends DefaultLinkModel {
	constructor() {
		super("custom");

		this.width = 3;
		this.curvyness = 50;
		this.color = "rgba(0,0,0,0.3)";
	}
}
