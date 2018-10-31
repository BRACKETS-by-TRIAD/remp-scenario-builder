import { NodeModel as BaseNodeModel } from "storm-react-diagrams";
import { PortModel } from "./PortModel";

export class NodeModel extends BaseNodeModel {
	constructor() {
		super("wait");
		
		this.name = "Wait";
		this.addPort(new PortModel("left"));
		this.addPort(new PortModel("right"));
	}
}
