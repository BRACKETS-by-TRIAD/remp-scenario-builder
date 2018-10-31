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
					id: 'abcd',
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
									'abcd12', //FIXME: uuids or element objects? 
									'abcd12'
								]
							}
						},
						{
							id: 'abcd2',
							title: 'Segment 1',
							type: 'segment',
							segment: {
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
							title: 'Action 1',
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
					x: 200,
					y: 150
				},
				'abcd2': {
					x: 200,
					y: 300
				},
				'abcd3': {
					x: 200,
					y: 25
				},
			}
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
			const triggerVisual = this.payload.visual[trigger.id];

			const triggerNode = new Trigger.NodeModel(); //trigger.title, trigger.event.name
			triggerNode.setPosition(triggerVisual.x, triggerVisual.y);


			const elementNodes = trigger.elements.map((element) => {
				let node = null;
				const visual = this.payload.visual[element.id];

				if(element.type == 'action') {
					node = new Action.NodeModel();
				} else if(element.type == 'segment') {
					node = new Segment.NodeModel();
				} else if(element.type == 'wait') {
					node = new Wait.NodeModel();
				}

				node.setPosition(visual.x, visual.y);

				return node;
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
