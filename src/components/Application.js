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
import axios from 'axios';

// import the custom models
import {
    SimplePortFactory,
    Action,
    Segment,
    Trigger,
    Wait
} from "./elements";

import * as config from './../config';

import "./sass/main.scss";
import { LinkFactory } from "./elements/Link";

export class Application {
	activeModel: DiagramModel;
	diagramEngine: DiagramEngine;

	constructor() {
		this.diagramEngine = new DiagramEngine();
		this.diagramEngine.installDefaultFactories();
		this.activeModel = new DiagramModel();
		
		axios.defaults.headers.common['Authorization'] = config.AUTH_TOKEN; 
		this.renderPayloadFromApi();
	}

	renderPayloadFromApi() {
		axios.get(`${config.URL_SCENARIOS}`)
			.then(response => {
				this.payload = response.data;
				console.log(this.payload);
				console.log(JSON.parse(localStorage.getItem('payload')));

				this.renderPaylod();
			})
			.catch(error => {
				console.log(error);
			});
	}

	renderPaylod() {
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
			
			nodes = element.action.descendants.flatMap((descendantObj) => {
				const element = this.payload.elements[descendantObj.uuid];
				const visual  = this.payload.visual[element.id];

				const nextNodes = this.renderElements(element, visual);
				const link = node.getPort("right").link(nextNodes[0].getPort("left"));

				this.activeModel.addLink(link);

				return nextNodes;
			});

		} else if(element.type === 'segment') {
			node = new Segment.NodeModel(element);

			nodes = element.segment.descendants.flatMap((descendantObj) => {
				const element = this.payload.elements[descendantObj.uuid];
				const visual  = this.payload.visual[element.id];

				const nextNodes = this.renderElements(element, visual);

				if (descendantObj.segment && descendantObj.segment.direction === 'positive') {			
					const link = node.getPort("right").link(nextNodes[0].getPort("left"));
					this.activeModel.addLink(link);
				} else if (descendantObj.segment && descendantObj.segment.direction === 'negative') {
					const link = node.getPort("bottom").link(nextNodes[0].getPort("left"));
					this.activeModel.addLink(link);
				}
				
				return nextNodes;
			});

		} else if(element.type === 'wait') {
			node = new Wait.NodeModel(element);

			nodes = element.wait.descendants.flatMap((descendantObj) => {
				const element = this.payload.elements[descendantObj.uuid];
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
