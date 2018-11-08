import { LeftRightBottomPort} from './../Ports';

export class PortModel extends LeftRightBottomPort {
	constructor(position: string = "top") {
		super(position, 'segment');
	}
}
