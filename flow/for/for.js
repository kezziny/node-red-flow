let RED;
const state = module.exports = function(red) {
	RED = red;
	red.nodes.registerType("flow-for", FlowFor);
}


class FlowFor {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		this.timer = null;
		
		this.status({
			fill: "red",
			shape: "ring",
			text: ""
		});

		this.on("input", (msg) => {
			if (msg.payload === null) {
				if (this.timer !== null) {
					clearTimeout(this.timer);
					this.timer = null;

					this.status({
						fill: "red",
						shape: "ring",
						text: ""
					});
					
					this.send({payload: null});
				}
			} else {
				if (this.timer === null) {
					this.timer = setTimeout(() => { 
						this.send({payload: true}); 
						this.status({
							fill: "green",
							shape: "dot",
							text: ""
						});
					}, config.timeout * 1000);
					this.status({
						fill: "yellow",
						shape: "ring",
						text: ""
					});
				}
			}
		});
	}
}

