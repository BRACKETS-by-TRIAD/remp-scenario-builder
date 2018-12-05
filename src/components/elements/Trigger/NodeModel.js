import * as _ from "lodash";
import { NodeModel as BaseNodeModel } from "storm-react-diagrams";
import { PortModel } from "./PortModel";

export class NodeModel extends BaseNodeModel {
	constructor(element: object) {
		super("trigger");
		
		this.name = element.name || 'Event';
		this.addPort(new PortModel("right"));
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.name = ob.name;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
		});
	}
}
