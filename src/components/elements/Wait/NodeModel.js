import { NodeModel as BaseNodeModel } from "storm-react-diagrams";
import { PortModel } from "./PortModel";

export class NodeModel extends BaseNodeModel {
	constructor(element: object) {
		super("wait");
		
		// this.data = element;
		
		this.name = element.title || 'Wait';
		this.wait_minutes = (element.wait && element.wait.minutes) ? element.wait.minutes : '5';

		this.addPort(new PortModel("left"));
		this.addPort(new PortModel("right"));
	}
}
