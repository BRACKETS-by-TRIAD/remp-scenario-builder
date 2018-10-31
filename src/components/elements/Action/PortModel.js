import * as _ from "lodash";
import { 
	LinkModel, 
	DiagramEngine, 
	PortModel as BasePortModel, 
	DefaultLinkModel 
} from "storm-react-diagrams";

export class PortModel extends BasePortModel {
	in: boolean;
	position: string | "left" | "right";

	constructor(pos: string = "top") {
		super(pos, "action");
		this.position = pos;
		this.in = this.position ==  "left";
	}

	//FIXME: extract to baseSquarePortModel, kuk pre inspiraciu do storm-react-diagrams/src/defaults
	
	link(port: BasePortModel): LinkModel {
		let link = this.createLinkModel();

		link.setSourcePort(this);
		link.setTargetPort(port);

		return link;
	}

	canLinkToPort(port: BasePortModel): boolean {
		return this.in !== port.in;
	}

	serialize() {
		return _.merge(super.serialize(), {
			position: this.position
		});
	}

	deSerialize(data: any, engine: DiagramEngine) {
		super.deSerialize(data, engine);
		this.position = data.position;
	}

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}
