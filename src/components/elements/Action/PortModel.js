import { LeftRightPort } from './../Ports';

export class PortModel extends LeftRightPort {	
	constructor(position: string = "left") {
		super(position, 'action');
	}
}
