import {
	DiagramEngine,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	NodeModel
	// LinkModel,
	// DefaultPortModel,
	// DiagramWidget
} from "storm-react-diagrams";

import * as _ from "lodash";

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

		this.payload = {
			triggers: [
				{	
					title: 'Trigger 1',
					type: 'event',
					event: {
						name: 'registration'
					},
					elements: [
						{
							id: 'abcd1',
							title: 'Wait 1',
							type: 'wait',
							wait: {
								minutes: 5,
								descendants: [
									'abcd2', //FIXME: uuids or element objects? 
									'abcd3'
								]
							}
						}
					],
				}
			]
		};

		this.registerModels();
		this.renderPayload();

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

	renderPayload() {
		const nodes = _.flatMap(this.payload.triggers, ((trigger) => {
			const nodes = [];

			const triggerNode = new Trigger.NodeModel(); //trigger.title, trigger.event.name
			triggerNode.setPosition(100, 150);


			const elementNodes = trigger.elements.map(function(element, index) {
				if(element.type == 'wait') {
					const node  =  new Wait.NodeModel();
					const order = index+2;

					node.setPosition(order*100, 150);

					return node;
				}
			});

			const links = elementNodes.map(function(element) {
				return triggerNode.getPort("right").link(element.getPort("left"));
			})


			return [ triggerNode, ...elementNodes, ...links ];
		}));

		//FIXME?
		// console.log(nodes);
		// const models = this.activeModel.addAll(nodes);


		nodes.forEach(model => {
			if (model instanceof LinkModel) {
				this.activeModel.addLink(model);
			} else if (model instanceof NodeModel) {
				this.activeModel.addNode(model);
			}
		});

		// nodes.forEach(item => {
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
