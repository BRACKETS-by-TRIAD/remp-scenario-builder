import {
	DiagramEngine,
	DiagramModel,
	DefaultNodeModel,
	// LinkModel,
	// DefaultPortModel,
	// DiagramWidget
} from "storm-react-diagrams";

// import the custom models
import { 
	DiamondNodeModel, 
	DiamondNodeFactory, 
	SimplePortFactory, 
	DiamondPortModel 
} from "./elements/DiamondNode";

import "./sass/main.scss";

export class Application {
	activeModel: DiagramModel;
	diagramEngine: DiagramEngine;

	constructor() {
		this.diagramEngine = new DiagramEngine();
		this.diagramEngine.installDefaultFactories();

		this.activeModel = new DiagramModel();
		this.diagramEngine.setDiagramModel(this.activeModel);

		this.newModel();
		this.newDiamondModel();

		this.diagramEngine.setDiagramModel(this.activeModel);
	}

	newModel() {
		//3-A) create a default node
		const node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
		let port = node1.addOutPort("Out");
		node1.setPosition(100, 100);

		//3-B) create another default node
		const node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
		let port2 = node2.addInPort("In");
		node2.setPosition(400, 100);

		// link the ports
		let link1 = port.link(port2);
		this.activeModel.addAll(node1, node2, link1);
	}

	newDiamondModel() {
		// register some other factories as well
		this.diagramEngine.registerPortFactory(new SimplePortFactory("diamond", config => new DiamondPortModel()));
		this.diagramEngine.registerNodeFactory(new DiamondNodeFactory());


		//3-A) create a default node
		const node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
		const port1 = node1.addOutPort("Out");
		node1.setPosition(100, 150);

		//3-B) create our new custom node
		const node2 = new DiamondNodeModel();
		node2.setPosition(250, 108);

		const node3 = new DefaultNodeModel("Node 3", "red");
		const port3 = node3.addInPort("In");
		node3.setPosition(500, 150);

		//3-C) link the 2 nodes together
		const link1 = port1.link(node2.getPort("left"));
		const link2 = port3.link(node2.getPort("right"));

		//4) add the models to the root graph
		this.activeModel.addAll(node1, node2, node3, link1, link2);
	}

	getActiveDiagram(): DiagramModel {
		return this.activeModel;
	}

	getDiagramEngine(): DiagramEngine {
		return this.diagramEngine;
	}
}
