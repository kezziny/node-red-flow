var jsonata = require("jsonata");

let RED;
const state = module.exports = function(red) {
	RED = red;
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

		this.compare = (data) => {
			let msg = data;
			if (config.attribute !== "") {
				if (!data.hasOwnProperty(config.attribute)) return null;
				data = data[config.attribute];
			}

			switch(config.value_type)
			{
				case "jsonata": {
					let expression = jsonata(config.compare_value);
					if (expression.evaluate(data)) return msg;
					else return null;
				}
				case "bool": {
					if (data && "true" === config.compare_value) return msg;
					else if (!data && "false" === config.compare_value) return msg;
					else return null;
				}
				default: {
					let compare = config.compare_value;
					if (config.value_type === "flow")
					{
						compare = flow.get(compare);
					}
					
					if (config.value_type === "global")
					{
						compare = global.get(compare);
					}
	
					if (data === compare) return msg;
					else return null;
				}
			}

			return null;
		};

		this.on("input", (msg) => {
			let data = this.compare(msg.payload);
			
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

