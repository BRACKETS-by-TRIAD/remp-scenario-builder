import { NodeModel as BaseNodeModel } from "storm-react-diagrams";
import * as _ from "lodash";
import { PortModel } from "./PortModel";

export class NodeModel extends BaseNodeModel {
	constructor(element: object) {
		super("action");
		
		this.name = element.title || 'Send email';
		this.addPort(new PortModel("left"));
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
