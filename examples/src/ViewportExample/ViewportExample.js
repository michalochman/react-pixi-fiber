import React, { Component } from "react";
import { Stage, Viewport } from "react-pixi-fiber";
import DraggableBunny from "./DraggableBunny";

class ViewportExample extends Component {
	viewport = null;

	getChildContext() {
		return {
			app: this.context.app,
		};
	}

	componentDidMount() {
		this.viewport.drag().pinch().wheel().decelerate();
	}

	render() {
		return (
			<Stage width={800} height={600} backgroundColor={0x1099bb}>
				<Viewport
					worldWidth={1600}
					worldHeight={1200}
					screenWidth={800}
					screenHeight={600}
					ref={(viewport) => { this.viewport = viewport; }}
				>
					<DraggableBunny x={200} y={200} />
					<DraggableBunny x={400} y={400} />
				</Viewport>
			</Stage>
		);
	}
}

export default ViewportExample;
