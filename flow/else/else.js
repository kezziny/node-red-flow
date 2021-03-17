let RED;
const state = module.exports = function(red) {
	RED = red;
	console.log("register js");
	red.nodes.registerType("flow-else", FlowElse);
}


class FlowElse {

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
			if (msg.payload === null)
			{
				this.status({
					fill: "green",
					shape: "dot",
					text: ""
				});
				this.send(msg);
			} else {
				this.status({
					fill: "red",
					shape: "ring",
					text: ""
				});
			}
		});
	}
}

