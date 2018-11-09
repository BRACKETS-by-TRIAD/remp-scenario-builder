import {
	DiagramEngine,
	DiagramModel,
	// DefaultNodeModel,
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
import { LinkFactory } from "./elements/Link";

export class Application {
	activeModel: DiagramModel;
	diagramEngine: DiagramEngine;

	constructor() {
		this.diagramEngine = new DiagramEngine();
		this.diagramEngine.installDefaultFactories();
		this.activeModel = new DiagramModel();

		// this.activeModel.setGridSize(50);

		//deserialize
		// this.activeModel.deSerializeDiagram(JSON.parse(str), engine);
		// this.diagramEngine.setDiagramModel(this.activeModel);

		this.payload = {
			triggers: [
				{	
					id: 'abcd',
					name: 'On event registration',
					type: 'event',
					event: {
						name: 'registration'
					},
					elements: [
						{
							id: 'abcd1',
							name: 'Wait',
							type: 'wait',
							wait: {
								minutes: 5,
								descendants: [
									'abcd12', //FIXME: uuids or element objects? 
									'abcd12'
								]
							}
						},
						{
							id: 'abcd2',
							type: 'segment',
							segment: {
								id: 1,
								name: 'Default group',
								code: 'segment1',
								descendants_positive: [
									'abcd21', //FIXME: uuids or element objects? 
									'abcd22'
								],
								descendants_negative: [
									'abcd23', //FIXME: uuids or element objects? 
									'abcd24'
								]
							}
						},
						{
							id: 'abcd3',
							name: 'Send registration email',
							type: 'action',
							action: {
								type: 'email',
								email: {
									code: 'mail_template_123'
								},
								descendants:  [
									'abcd31', //FIXME: uuids or element objects? 
									'abcd32'
								]
							}
						}
					],
				}
			],
			// FIXME: other elements?
			visual: {
				'abcd': {
					x: 100,
					y: 150
				},
				'abcd1': {
					x: 400,
					y: 150
				},
				'abcd2': {
					x: 400,
					y: 300
				},
				'abcd3': {
					x: 400,
					y: 25
				},
			}
		};

		if(!localStorage.getItem('payload')) {
			localStorage.setItem('payload', JSON.stringify(this.payload));
		}

		this.payload = JSON.parse(localStorage.getItem('payload'));
		console.log(this.payload);

		this.registerModels();
		this.renderPayload(this.payload);

		this.diagramEngine.setDiagramModel(this.activeModel);
	}

	registerModels() {
		this.diagramEngine.registerLinkFactory(new LinkFactory());
		this.diagramEngine.registerPortFactory(new SimplePortFactory("action", config => new Action.PortModel()));
		this.diagramEngine.registerNodeFactory(new Action.NodeFactory());
		
		this.diagramEngine.registerPortFactory(new SimplePortFactory("segment", config => new Segment.PortModel()));
		this.diagramEngine.registerNodeFactory(new Segment.NodeFactory());

		this.diagramEngine.registerPortFactory(new SimplePortFactory("trigger", config => new Trigger.PortModel()));
		this.diagramEngine.registerNodeFactory(new Trigger.NodeFactory());

		this.diagramEngine.registerPortFactory(new SimplePortFactory("wait", config => new Wait.PortModel()));
		this.diagramEngine.registerNodeFactory(new Wait.NodeFactory());
	}

	renderPayload(payload) {
		const nodes = _.flatMap(payload.triggers, ((trigger) => {
			const triggerVisual = payload.visual[trigger.id];
			trigger.type = "trigger";

			return this.renderElements(trigger, triggerVisual);
		}));


		// nodes.forEach(model => {
		// 	if (model instanceof LinkModel) {
		// 		this.activeModel.addLink(model);
		// 	} else if (model instanceof NodeModel) {
		// 		this.activeModel.addNode(model);
		// 	}
		// });
	}

	renderElements(element, visual) {
		let nodes = [];
		let node = null;

		if(element.type === 'trigger') {
			node = new Trigger.NodeModel(element);
			
			nodes = element.elements.flatMap((elementId) => {
				const element = this.payload.elements[elementId];
				const visual  = this.payload.visual[element.id];

				const nextNodes = this.renderElements(element, visual);
				const link = node.getPort("right").link(nextNodes[0].getPort("left")); //FIXME/REFACTOR: nextNodes[0] is the last added node, it works, but it's messy

				this.activeModel.addLink(link);

				return nextNodes;
			});
		} else if(element.type === 'action') {
			node = new Action.NodeModel(element);
			
			nodes = element.action.descendants.flatMap((elementId) => {
				const element = this.payload.elements[elementId];
				const visual  = this.payload.visual[element.id];

				const nextNodes = this.renderElements(element, visual);
				const link = node.getPort("right").link(nextNodes[0].getPort("left"));

				this.activeModel.addLink(link);

				return nextNodes;
			});

		} else if(element.type === 'segment') {
			node = new Segment.NodeModel(element);

			const nodes_positive = element.segment.descendants_positive.flatMap((elementId) => {
				const element = this.payload.elements[elementId];
				const visual  = this.payload.visual[element.id];

				const nextNodes = this.renderElements(element, visual);
				const link = node.getPort("right").link(nextNodes[0].getPort("left"));
				this.activeModel.addLink(link);
				
				return nextNodes;
			});

			const nodes_negative = element.segment.descendants_negative.flatMap((elementId) => {
				const element = this.payload.elements[elementId];
				const visual  = this.payload.visual[element.id];

				const nextNodes = this.renderElements(element, visual);
				const link = node.getPort("bottom").link(nextNodes[0].getPort("left"));
				
				this.activeModel.addLink(link);

				return nextNodes;
			});

			nodes = [...nodes_positive, ...nodes_negative];

		} else if(element.type === 'wait') {
			node = new Wait.NodeModel(element);

			nodes = element.wait.descendants.flatMap((elementId) => {
				const element = this.payload.elements[elementId];
				const visual  = this.payload.visual[element.id];

				const nextNodes = this.renderElements(element, visual);
				const link = node.getPort("right").link(nextNodes[0].getPort("left"));
				this.activeModel.addLink(link);

				return nextNodes;
			});
		}

		this.activeModel.addNode(node);
		node.setPosition(visual.x, visual.y);

		return [node, ...nodes];
	}

	getActiveDiagram(): DiagramModel {
		return this.activeModel;
	}

	getDiagramEngine(): DiagramEngine {
		return this.diagramEngine;
	}
}
