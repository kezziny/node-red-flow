let RED;
const state = module.exports = function(red) {
	RED = red;
	console.log("register js");
	red.nodes.registerType("flow-or", FlowOr);
}


class FlowOr {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;

		this.State = null;
		this.sources = {};
		RED.nodes.eachNode(node => {
			if (node.hasOwnProperty("wires"))
			{				
				node.wires.forEach(out => {
					if (out.indexOf(this.id) != -1)
					{
						this.sources[node.id] = null;
					}
				});
			}
		});

		this.keys = Object.keys(this.sources);
		this.report = () => {
			let data = {};
			this.keys.forEach( (key) => {
				data[key] = this.sources[key] !== null;
			});
			return JSON.stringify(data);
		};
		
		
		this.status({
			fill: "red",
			shape: "ring",
			text: ""
		});
		
		RED.hooks.add("preDeliver", (data)=>{
			if (data.destination.id === this.id) {
				this.sources[data.source.id] = data.msg.payload;
				let numOfNull = 0;
				this.keys.forEach( (key) => {
					if (this.sources[key] === null) {
						numOfNull++;
					}
				});

				let payload = null;
				if (numOfNull < this.keys.length)
				{
					payload = this.sources;
				}

				this.status({
					fill: (payload === null) ? "red" : "green",
					shape: (payload === null) ? "ring" : "dot",
					text: ""
				});

				if (this.State !== payload || payload !== null) {
					this.State = payload;
					this.send({payload: payload });
				}
			}

		});
	}
}

