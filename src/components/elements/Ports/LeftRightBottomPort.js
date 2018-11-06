import * as _ from "lodash";
import { 
	LinkModel as BaseLinkModel, 
	DiagramEngine, 
	PortModel as BasePortModel, 
	// DefaultLinkModel 
} from "storm-react-diagrams";

import { LinkModel } from './../Link';

export class LeftRightBottomPort extends BasePortModel {
	position: string | "top" | "bottom" | "left" | "right";

	constructor(pos: string = "top", type: string) {
		super(pos, type);
		this.position = pos;
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

	createLinkModel(): BaseLinkModel {
		return new LinkModel();
	}
}
