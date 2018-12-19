import { AbstractNodeFactory } from 'storm-react-diagrams';

import NodeWidget from './NodeWidget';
import { NodeModel } from './NodeModel';
import * as React from 'react';

export class NodeFactory extends AbstractNodeFactory {
  constructor() {
    super('trigger');
  }

  generateReactWidget(diagramEngine, node) {
    return (
      <NodeWidget
        diagramEngine={diagramEngine}
        node={node}
        classBaseName='square-node'
        className='trigger-node'
      />
    );
  }

  getNewInstance() {
    return new NodeModel();
  }
}
