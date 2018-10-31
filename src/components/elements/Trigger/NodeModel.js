import { NodeModel as BaseNodeModel } from "storm-react-diagrams";
import { PortModel } from "./PortModel";

export class NodeModel extends BaseNodeModel {
	constructor() {
		super("trigger");
		
		this.name = "Trigger";
		this.addPort(new PortModel("right"));
	}
}
