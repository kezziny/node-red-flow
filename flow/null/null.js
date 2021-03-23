let RED;
const state = module.exports = function(red) {
	RED = red;
	red.nodes.registerType("flow-set-null", FlowNull);
}


class FlowNull {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		
		this.on("input", (msg) => {
			this.send({payload: null});
		});
	}
}

