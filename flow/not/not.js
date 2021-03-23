let RED;
const state = module.exports = function(red) {
	RED = red;
	red.nodes.registerType("flow-invert", FlowNot);
}


class FlowNot {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		
		this.State = null;

		this.status({
			fill: "red",
			shape: "ring",
			text: ""
		});

		this.on("input", (msg) => {
			let data = msg.payload === null ? true : null;
			
			if (data !== null) {
				this.status({
					fill: "green",
					shape: "dot",
					text: ""
				});
			} else {
				this.status({
					fill: "red",
					shape: "ring",
					text: ""
				});
			}

			if (data !== this.State) {
				this.State = data;
				this.send({payload: data});
			}
		});
	}
}

