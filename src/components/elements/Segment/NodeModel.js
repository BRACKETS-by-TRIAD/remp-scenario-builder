import { NodeModel as BaseNodeModel } from "storm-react-diagrams";
import { PortModel } from "./PortModel";

export class NodeModel extends BaseNodeModel {
	constructor() {
		super("segment");
		// this.addPort(new PortModel("top"));
		this.addPort(new PortModel("left"));
		this.addPort(new PortModel("bottom"));
		this.addPort(new PortModel("right"));
	}
}
