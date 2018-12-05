import flatMap from "lodash/flatMap";

// import the custom models
import {
    Action,
    Segment,
    Trigger,
    Wait
} from "./../components/elements";

export class ExportService {
	constructor(model) {
        this.model = model;
    }
    
    export() {
        const payload  = {};
        const serializedModel = this.model.serializeDiagram();
        
		payload.triggers = serializedModel.nodes.filter((node) => node.type == 'trigger')
											    .map((node) => this.formatNode(node));
		
		payload.elements = {};
		payload.visual = {};

		Object.entries(this.model.getNodes()).map((node) => {
			payload.visual[node[0]] = {
				x: node[1].x,
				y: node[1].y
			}
		});

		Object.entries(this.model.getNodes()).map((node) => {
			if(node[1].type !== 'trigger') {
				payload.elements[node[0]] = this.formatNode(node[1].serialize());
			}
		});

        return payload;
    }

    getAllChildrenNodes(node, portName = "right") {
		const port = node.ports.find((port) => port.name == portName);

		return port.links.map((link) => {
			let nextNode = null;

			if(this.model.links[link].targetPort.parent.id !== node.id) {
				nextNode = this.model.links[link].targetPort.parent;
			} else {
				nextNode = this.model.links[link].sourcePort.parent;
			}

			// return this.formatNode(nextNode.serialize(), model);
			return { ...nextNode.serialize(), portName };
		});
	}

	formatNode(node) {
		if (node.type === "action") {
			return 					{
				uuid: node.id,
				title: node.name,
				type: 'action',
				action: {
					type: 'email',
					email: {
						code: 'mail_template_123'
					},
					descendants: this.getAllChildrenNodes(node).map((descendantNode) => this.formatDescendant(descendantNode, node))
				}
			}
		} else if(node.type === "segment") {
			const descendantsPositive = this.getAllChildrenNodes(node, "right").map((descendantNode) => this.formatDescendant(descendantNode, node));
			const descendantsNegative = this.getAllChildrenNodes(node, "bottom").map((descendantNode) => this.formatDescendant(descendantNode, node))

			return {
				uuid: node.id,
				name: 'nieco',
				segment: {
					code: 'segment1',
					descendants: [...descendantsPositive, ...descendantsNegative]
				},
				type: 'segment',
			}
		} else if(node.type === "trigger") {
			return {
				uuid: node.id,
				title: node.name,
				type: 'event',
				event: {
					name: 'registration'
				},
				elements: this.getAllChildrenNodes(node).map((descendantNode) => this.formatDescendant(descendantNode, node))
			}
		} else if(node.type === "wait") {
			return {
				uuid: node.id,
				title: node.name,
				type: 'wait',
				wait: { 
					minutes: node.wait_minutes,
					descendants: this.getAllChildrenNodes(node).map((descendantNode) => this.formatDescendant(descendantNode, node))
				}
			}
		}
	}

	formatDescendant = (node, parentNode) => {
		let descendant= {
			uuid: node.id
		};

		if(parentNode.type === "segment") {
			descendant.segment = {
				direction: node.portName === 'right' ? 'positive' : 'negative'
			};
		}

		return descendant;
	}
}
