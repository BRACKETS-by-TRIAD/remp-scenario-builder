import * as _ from "lodash";
import { 
	LinkModel as BaseLinkModel, 
	DiagramEngine, 
	PortModel as BasePortModel, 
	// DefaultLinkModel 
} from "storm-react-diagrams";

import { LinkModel } from './../Link';

export class LeftRightBottomPort extends BasePortModel {
	position: string  | "bottom" | "left" | "right";

	constructor(pos: string = "left", type: string) {
		super(pos, type);

		this.position = pos;
		this.in = this.position ===  "left";
	}

	serialize() {
		return _.merge(super.serialize(), {
			position: this.position
		});
	}

	canLinkToPort(port: BasePortModel): boolean {
		return this.in !== port.in;
	}

	deSerialize(data: any, engine: DiagramEngine) {
		super.deSerialize(data, engine);
		this.position = data.position;
	}

	createLinkModel(): BaseLinkModel {
		return new LinkModel();
	}
}
