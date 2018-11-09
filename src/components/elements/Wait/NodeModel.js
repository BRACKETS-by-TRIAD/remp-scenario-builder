import * as _ from "lodash";
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

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.name = ob.name;
		this.wait_minutes = ob.wait_minutes;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			wait_minutes: this.wait_minutes,
		});
	}
}
