import React, { Component } from "react";
import PropTypes from "prop-types";
import Bunny from "../Bunny/Bunny";

class DraggableBunny extends Component {
	isDragging = false;

	clientX = -1;
	clientY = -1;

	constructor(props) {
		super(props);

		this.state = {
			x: this.props.x,
			y: this.props.y
		};
	}

	get viewport() {
		return this.context.app.stage.children[0];
	}

	pointerdown = (e) => {
		this.isDragging = true;
		this.viewport.pausePlugin("drag");
		let p = e.data.getLocalPosition(this.context.app.stage);
		p = this.viewport.toWorld(p.x, p.y);
		this.clientX = p.x;
		this.clientY = p.y;
	}

	pointerup = (e) => {
		this.isDragging = false;
		this.viewport.resumePlugin("drag");
	}

	pointerupoutside = (e) => {
		this.isDragging = false;
	}

	pointermove = (e) => {
		if (!this.isDragging) return;

		let p = e.data.getLocalPosition(this.context.app.stage);
		p = this.viewport.toWorld(p.x, p.y);

		if (this.clientX === -1 && this.clientY === -1) {
			this.clientX = p.x;
			this.clientY = p.y;
		}

		let xPos = 0;
		if (p.x < this.clientX) {
			xPos = -Math.abs(p.x - this.clientX);
		} else if (p.x > this.clientX) {
			xPos = Math.abs(p.x - this.clientX);
		}

		let yPos = 0;
		if (p.y < this.clientY) {
			yPos = -Math.abs(p.y - this.clientY);
		} else if (p.y > this.clientY) {
			yPos = Math.abs(p.y - this.clientY);
		}

		this.clientX = p.x;
		this.clientY = p.y;

		const x = this.state.x + xPos;
		const y = this.state.y + yPos;
		this.setState({ x, y });
	}

	render() {
		const { x, y } = this.state;

		return <Bunny
			{...this.props}
			x={x}
			y={y}
			interactive
			buttonMode
			pointerdown={this.pointerdown}
			pointerup={this.pointerup}
			pointerupoutside={this.pointerupoutside}
			pointermove={this.pointermove}
		/>;
	}
}

DraggableBunny.contextTypes = {
	app: PropTypes.object
};

export default DraggableBunny;
