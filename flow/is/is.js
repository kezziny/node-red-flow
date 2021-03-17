let RED;
const state = module.exports = function(red) {
	RED = red;
	console.log("register js");
	red.nodes.registerType("flow-is", FlowIs);
}


class FlowIs {

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
			let data = null;

			switch(config.value_type)
			{
				default:
				case "num": {
					if (""+msg.payload === config.compare_value)
					{
						data = msg.payload;
					}
				}
			}
			
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

