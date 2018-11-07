import {
	AbstractNodeFactory,
	DiagramEngine,
	NodeModel as BaseNodeModel
} from "storm-react-diagrams";

import { NodeWidget } from "./NodeWidget";
import { NodeModel } from "./NodeModel";
import * as React from "react";

export class NodeFactory extends AbstractNodeFactory {
	constructor() {
		super("segment");
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: BaseNodeModel): JSX.Element {
		return <NodeWidget diagramEngine={diagramEngine}  node={node} classBaseName="diamond-node" className="segment-node" />;
	}

	getNewInstance() {
		return new NodeModel();
	}
}
