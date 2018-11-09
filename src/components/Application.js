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
			"triggers": [
			  {
				"id": "0ff4d8a1-9432-4394-8e6d-ec41b73023bd",
				"title": "Event",
				"type": "event",
				"event": {
				  "name": "registration"
				},
				"elements": [
				  "2ebc3599-974a-43bc-8fc6-c2e02176a77a"
				]
			  }
			],
			"elements": {
			  "cecee803-d8c1-4460-8835-7cdc749fc1bb": {
				"id": "cecee803-d8c1-4460-8835-7cdc749fc1bb",
				"title": "Send email",
				"type": "action",
				"action": {
				  "type": "email",
				  "email": {
					"code": "mail_template_123"
				  },
				  "descendants": []
				}
			  },
			  "266876c2-6f8d-4391-97d2-9a539825083e": {
				"id": "266876c2-6f8d-4391-97d2-9a539825083e",
				"title": "Send email",
				"type": "action",
				"action": {
				  "type": "email",
				  "email": {
					"code": "mail_template_123"
				  },
				  "descendants": []
				}
			  },
			  "82deb3f0-f412-4e8d-83ff-f756356f1b95": {
				"id": "82deb3f0-f412-4e8d-83ff-f756356f1b95",
				"type": "segment",
				"segment": {
				  "id": 6,
				  "name": "Koniec fica",
				  "code": "segment1",
				  "descendants_positive": [
					"266876c2-6f8d-4391-97d2-9a539825083e"
				  ],
				  "descendants_negative": []
				}
			  },
			  "844d7857-662a-44d7-bd74-cfaa242330b8": {
				"id": "844d7857-662a-44d7-bd74-cfaa242330b8",
				"title": "Wait",
				"type": "wait",
				"wait": {
				  "minutes": "10",
				  "descendants": [
					"82deb3f0-f412-4e8d-83ff-f756356f1b95"
				  ]
				}
			  },
			  "2ebc3599-974a-43bc-8fc6-c2e02176a77a": {
				"id": "2ebc3599-974a-43bc-8fc6-c2e02176a77a",
				"type": "segment",
				"segment": {
				  "id": 6,
				  "name": "Koniec fica",
				  "code": "segment1",
				  "descendants_positive": [
					"cecee803-d8c1-4460-8835-7cdc749fc1bb"
				  ],
				  "descendants_negative": [
					"844d7857-662a-44d7-bd74-cfaa242330b8"
				  ]
				}
			  },
			  "0ff4d8a1-9432-4394-8e6d-ec41b73023bd": {
				"id": "0ff4d8a1-9432-4394-8e6d-ec41b73023bd",
				"title": "Event",
				"type": "event",
				"event": {
				  "name": "registration"
				},
				"elements": [
				  "2ebc3599-974a-43bc-8fc6-c2e02176a77a"
				]
			  }
			},
			"visual": {
			  "cecee803-d8c1-4460-8835-7cdc749fc1bb": {
				"x": 595,
				"y": 152
			  },
			  "266876c2-6f8d-4391-97d2-9a539825083e": {
				"x": 779,
				"y": 326
			  },
			  "82deb3f0-f412-4e8d-83ff-f756356f1b95": {
				"x": 615,
				"y": 299
			  },
			  "844d7857-662a-44d7-bd74-cfaa242330b8": {
				"x": 423,
				"y": 326
			  },
			  "2ebc3599-974a-43bc-8fc6-c2e02176a77a": {
				"x": 311,
				"y": 123
			  },
			  "0ff4d8a1-9432-4394-8e6d-ec41b73023bd": {
				"x": 100,
				"y": 150
			  }
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
