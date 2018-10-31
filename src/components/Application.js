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
    SimplePortFactory,
    Action,
    Segment,
    Trigger,
    Wait
} from "./elements";

import "./sass/main.scss";

export class Application {
	activeModel: DiagramModel;
	diagramEngine: DiagramEngine;

	constructor() {
		this.diagramEngine = new DiagramEngine();
		this.diagramEngine.installDefaultFactories();
		this.activeModel = new DiagramModel();

		// this.activeModel.setGridSize(50);

		this.registerModels();
		this.renderDefault();

		this.diagramEngine.setDiagramModel(this.activeModel);
	}

	registerModels() {
		this.diagramEngine.registerPortFactory(new SimplePortFactory("action", config => new Action.PortModel()));
		this.diagramEngine.registerNodeFactory(new Action.NodeFactory());
		
		this.diagramEngine.registerPortFactory(new SimplePortFactory("segment", config => new Segment.PortModel()));
		this.diagramEngine.registerNodeFactory(new Segment.NodeFactory());

		this.diagramEngine.registerPortFactory(new SimplePortFactory("trigger", config => new Trigger.PortModel()));
		this.diagramEngine.registerNodeFactory(new Trigger.NodeFactory());

		this.diagramEngine.registerPortFactory(new SimplePortFactory("wait", config => new Wait.PortModel()));
		this.diagramEngine.registerNodeFactory(new Wait.NodeFactory());
	}

	renderDefault() {

		const node1 = new Trigger.NodeModel();
		node1.setPosition(100, 150);

		const node2 = new Action.NodeModel();
		node2.setPosition(300, 150);

		const node3 = new Action.NodeModel();
		node3.setPosition(500, 150);

		const link1 = node1.getPort("right").link(node2.getPort("left"));
		const link2 = node3.getPort("left").link(node2.getPort("right"));

		link1.addLabel("Label 1");
		link2.addLabel("Label 2");

		const models = this.activeModel.addAll(node1, node2, node3, link1, link2);

		// models.forEach(item => {
		// 	item.addListener({
		// 		selectionChanged: console.log('selectionChanged')
		// 	});
		// });
	}

	getActiveDiagram(): DiagramModel {
		return this.activeModel;
	}

	getDiagramEngine(): DiagramEngine {
		return this.diagramEngine;
	}
}
