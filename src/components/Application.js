import {
  DiagramEngine,
  DiagramModel
  // DefaultNodeModel,
  // LinkModel,
  // NodeModel
  // LinkModel,
  // DefaultPortModel,
  // DiagramWidget
} from 'storm-react-diagrams';

// import the custom models
import { SimplePortFactory, Action, Segment, Trigger, Wait } from './elements';

import './sass/main.scss';
import { LinkFactory } from './elements/Link';
import { RenderService } from './../services/RenderService';

export class Application {
  activeModel: DiagramModel;
  diagramEngine: DiagramEngine;

  constructor(payload) {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.activeModel = new DiagramModel();
    this.renderService = new RenderService(this.activeModel);
    this.payload = payload;

    if (payload) {
      this.renderPaylod();
    } else {
      this.registerCustomModels();
    }
  }

  renderPaylod() {
    this.registerCustomModels();
    this.renderService.renderPayload(this.payload);
    this.diagramEngine.setDiagramModel(this.activeModel);
    this.diagramEngine.repaintCanvas();
  }

  registerCustomModels() {
    this.diagramEngine.registerLinkFactory(new LinkFactory());
    this.diagramEngine.registerPortFactory(
      new SimplePortFactory('action', config => new Action.PortModel())
    );
    this.diagramEngine.registerNodeFactory(new Action.NodeFactory());

    this.diagramEngine.registerPortFactory(
      new SimplePortFactory('segment', config => new Segment.PortModel())
    );
    this.diagramEngine.registerNodeFactory(new Segment.NodeFactory());

    this.diagramEngine.registerPortFactory(
      new SimplePortFactory('trigger', config => new Trigger.PortModel())
    );
    this.diagramEngine.registerNodeFactory(new Trigger.NodeFactory());

    this.diagramEngine.registerPortFactory(
      new SimplePortFactory('wait', config => new Wait.PortModel())
    );
    this.diagramEngine.registerNodeFactory(new Wait.NodeFactory());
  }

  getActiveDiagram(): DiagramModel {
    return this.activeModel;
  }

  getDiagramEngine(): DiagramEngine {
    return this.diagramEngine;
  }
}
