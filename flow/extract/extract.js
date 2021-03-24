let RED;
const state = module.exports = function (red) {
	RED = red;
	red.nodes.registerType("flow-extract", FlowExtract);
}


class FlowExtract {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;

		this.status({
			fill: "red",
			shape: "ring",
			text: ""
		});

		this.on("input", (msg) => {
			if (msg.payload && msg.payload.hasOwnProperty(config.attribute)) {
				this.status({
					fill: "green",
					shape: "dot",
					text: ""
				});
				this.send({ payload: msg.payload[config.attribute] });
			} else {
				this.status({
					fill: "red",
					shape: "ring",
					text: ""
				});
				this.send({ payload: null });
			}

		});
	}
}

