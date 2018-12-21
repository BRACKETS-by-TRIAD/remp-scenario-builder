export class ExportService {
  constructor(model) {
    this.model = model;
  }

  exportPayload() {
    const payload = {};
    const serializedModel = this.model.serializeDiagram();

    payload.triggers = {};
    payload.elements = {};
    payload.visual = {};

    serializedModel.nodes
      .filter(node => node.type === 'trigger')
      .map(node => (payload.triggers[node.id] = this.formatNode(node)));

    // TODO: map -> forEach
    Object.entries(this.model.getNodes()).forEach(node => {
      payload.visual[node[0]] = {
        x: node[1].x,
        y: node[1].y
      };
    });

    // TODO: map -> forEach
    Object.entries(this.model.getNodes()).forEach(node => {
      if (node[1].type !== 'trigger') {
        payload.elements[node[0]] = this.formatNode(node[1].serialize());
      }
    });

    return payload;
  }

  getAllChildrenNodes(node, portName = 'right') {
    const port = node.ports.find(port => port.name === portName);

    return port.links.map(link => {
      let nextNode = null;

      if (this.model.links[link].targetPort.parent.id !== node.id) {
        nextNode = this.model.links[link].targetPort.parent;
      } else {
        nextNode = this.model.links[link].sourcePort.parent;
      }

      // return this.formatNode(nextNode.serialize(), model);
      return { ...nextNode.serialize(), portName };
    });
  }

  //FIXME: hardcoded data
  formatNode(node) {
    if (node.type === 'action') {
      return {
        id: node.id,
        name: node.name,
        type: 'action',
        action: {
          type: 'email',
          email: {
            code: 'mail_template_123'
          },
          descendants: this.getAllChildrenNodes(node).map(descendantNode =>
            this.formatDescendant(descendantNode, node)
          )
        }
      };
    } else if (node.type === 'segment') {
      const descendantsPositive = this.getAllChildrenNodes(node, 'right').map(
        descendantNode => this.formatDescendant(descendantNode, node)
      );
      const descendantsNegative = this.getAllChildrenNodes(node, 'bottom').map(
        descendantNode => this.formatDescendant(descendantNode, node)
      );
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'segment',
        segment: {
          code: node.selectedSegment ? node.selectedSegment : 'all_users',
          descendants: [...descendantsPositive, ...descendantsNegative]
        }
      };
    } else if (node.type === 'trigger') {
      return {
        id: node.id,
        name: node.name ? node.name : '',
        type: 'event',
        event: {
          code: node.selectedTrigger ? node.selectedTrigger : 'user_created'
        },
        // elements: this.getAllChildrenNodes(node).map((descendantNode) => this.formatDescendant(descendantNode, node))
        elements: this.getAllChildrenNodes(node).map(
          descendantNode => descendantNode.id
        )
      };
    } else if (node.type === 'wait') {
      return {
        id: node.id,
        name: node.name,
        type: 'wait',
        wait: {
          minutes: node.wait_minutes,
          descendants: this.getAllChildrenNodes(node).map(descendantNode =>
            this.formatDescendant(descendantNode, node)
          )
        }
      };
    }
  }

  formatDescendant = (node, parentNode) => {
    let descendant = {
      uuid: node.id
    };

    if (parentNode.type === 'segment') {
      descendant.segment = {
        direction: node.portName === 'right' ? 'positive' : 'negative'
      };
    }

    return descendant;
  };
}
