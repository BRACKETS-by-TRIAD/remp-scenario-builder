import { NodeModel as BaseNodeModel } from "storm-react-diagrams";
import { PortModel } from "./PortModel";

export class NodeModel extends BaseNodeModel {
	constructor(element: object) {
		super("trigger");
		
		this.name = element.title || 'Trigger';
		this.addPort(new PortModel("right"));
	}
}
