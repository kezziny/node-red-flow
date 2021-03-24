let RED;
const state = module.exports = function(red) {
	RED = red;
	red.nodes.registerType("flow-and", FlowAnd);
}


class FlowAnd {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;

		this.State = null;
		this.debounceTimer = null;
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
				let sourceId = data.source.id;
				if (!this.sources.hasOwnProperty(data.source.id) && this.sources.hasOwnProperty(data.source.node.z)) {
					sourceId = data.source.node.z;
				}

				this.sources[sourceId] = data.msg.payload;

				if (this.debounceTimer !== null) clearTimeout(this.debounceTimer);
				this.debounceTimer = setTimeout(() => {
					let numOfNull = 0;
					this.keys.forEach( (key) => {
						if (this.sources[key] === null) {
							numOfNull++;
						}
					});
	
					let payload = null;
					if (numOfNull === 0)
					{
						payload = this.sources;
					}
	
					this.status({
						fill: (payload === null) ? "red" : "green",
						shape: (payload === null) ? "ring" : "dot",
						text: ""
					});
	
					
					this.send({payload: payload });
				}, 50);
			}

		});
	}
}

