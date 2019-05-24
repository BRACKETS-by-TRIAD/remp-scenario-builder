import flatMap from 'lodash/flatMap';

// import the custom models
import { Email, Segment, Trigger, Wait } from './../components/elements';

export class RenderService {
  constructor(activeModel, payload = {}) {
    this.activeModel = activeModel;
    this.payload = payload;
  }

  renderPayload(payload) {
    this.payload = payload;

    flatMap(payload.triggers, trigger => {
      const triggerVisual = payload.visual[trigger.id];
      // trigger.type = "trigger";

      return this.renderElements(trigger, triggerVisual);
    });
  }

  renderElements(element, visual) {
    let nodes = [];
    let node = null;

    if (element.type === 'event') {
      element.selectedTrigger = element.event.code;
      node = new Trigger.NodeModel(element);

      nodes = element.elements.flatMap(elementId => {
        const element = this.payload.elements[elementId];
        const visual = this.payload.visual[element.id];

        const nextNodes = this.renderElements(element, visual);
        const link = node.getPort('right').link(nextNodes[0].getPort('left')); //FIXME/REFACTOR: nextNodes[0] is the last added node, it works, but it's messy

        this.activeModel.addLink(link);

        return nextNodes;
      });
    } else if (element.type === 'email') {
      element.selectedMail = element.email.code;
      node = new Email.NodeModel(element);

      nodes = element.email.descendants.flatMap(descendantObj => {
        const element = this.payload.elements[descendantObj.uuid];
        const visual = this.payload.visual[element.id];

        const nextNodes = this.renderElements(element, visual);
        const link = node.getPort('right').link(nextNodes[0].getPort('left'));

        this.activeModel.addLink(link);

        return nextNodes;
      });
    } else if (element.type === 'segment') {
      element.selectedSegment = element.segment.code;
      node = new Segment.NodeModel(element);

      nodes = element.segment.descendants.flatMap(descendantObj => {
        const element = this.payload.elements[descendantObj.uuid];
        const visual = this.payload.visual[element.id];

        const nextNodes = this.renderElements(element, visual);

        if (
          descendantObj.segment &&
          descendantObj.segment.direction === 'positive'
        ) {
          const link = node.getPort('right').link(nextNodes[0].getPort('left'));
          this.activeModel.addLink(link);
        } else if (
          descendantObj.segment &&
          descendantObj.segment.direction === 'negative'
        ) {
          const link = node
            .getPort('bottom')
            .link(nextNodes[0].getPort('left'));
          this.activeModel.addLink(link);
        }

        return nextNodes;
      });
    } else if (element.type === 'wait') {
      if (element.wait.minutes % 1440 === 0) {
        element.waitingUnit = 'days';
        element.waitingTime = element.wait.minutes / 1440;
      } else if (element.wait.minutes % 60 === 0) {
        element.waitingUnit = 'hours';
        element.waitingTime = element.wait.minutes / 60;
      } else {
        element.waitingUnit = 'minutes';
        element.waitingTime = element.wait.minutes;
      }

      node = new Wait.NodeModel(element);

      nodes = element.wait.descendants.flatMap(descendantObj => {
        const element = this.payload.elements[descendantObj.uuid];
        const visual = this.payload.visual[element.id];

        const nextNodes = this.renderElements(element, visual);
        const link = node.getPort('right').link(nextNodes[0].getPort('left'));
        this.activeModel.addLink(link);

        return nextNodes;
      });
    }

    this.activeModel.addNode(node);
    node.setPosition(visual.x, visual.y);

    return [node, ...nodes];
  }
}
