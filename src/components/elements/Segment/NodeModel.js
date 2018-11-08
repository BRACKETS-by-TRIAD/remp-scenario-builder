import { NodeModel as BaseNodeModel } from "storm-react-diagrams";
import { PortModel } from "./PortModel";

export class NodeModel extends BaseNodeModel {
	constructor(element: object) {
		super("segment");

		this.name = element.title || 'Segment';
		this.segment_id = 1;
		
		// this.addPort(new PortModel("top"));
		this.addPort(new PortModel("left"));
		this.addPort(new PortModel("bottom"));
		this.addPort(new PortModel("right"));
	}
}
