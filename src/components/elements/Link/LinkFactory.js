import {
	DefaultLinkFactory
} from "storm-react-diagrams";

import * as React from "react";

import { LinkModel } from './LinkModel';

export class LinkFactory extends DefaultLinkFactory {
	constructor() {
		super();
		this.type = "custom";
	}

	getNewInstance(initialConfig?: any): LinkModel {
		return new LinkModel();
	}

	generateLinkSegment(model, widget, selected: boolean, path: string) {
		return (
			<path
				className={selected ? widget.bem("--path-selected") : ""}
				strokeWidth={model.width}
				stroke={model.color}
				d={path}
			/>
		);
	}
}