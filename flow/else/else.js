let RED;
const state = module.exports = function(red) {
	RED = red;
	red.nodes.registerType("flow-else", FlowElse);
}

let parts = [{hour: 'numeric', hour12: false}, {minute: 'numeric'}, {second: 'numeric'}];
function join(t, a, s) {
	function format(m) {
	   let f = new Intl.DateTimeFormat('en', m);
	   return f.format(t);
	}
	return a.map(format).join(s);
 }

class FlowElse {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		
		this.State = null;

		this.status({
			fill: "red",
			shape: "ring",
			text: join(new Date, parts, ':')
		});

		this.on("input", (msg) => {
			if (msg.payload === null)
			{
				this.status({
					fill: "green",
					shape: "dot",
					text: join(new Date, parts, ':')
				});

				if (config.output_value !== "") {
					switch(config.value_type)
					{
						case "str": msg.payload = config.output_value; break;
						case "num": msg.payload = parseInt(config.output_value); break;
						case "bool": msg.payload = config.output_value === "true"; break;
						case "json": msg.payload = JSON.parse(config.output_value); break;
						case "flow": msg.payload = flow.get(config.output_value); break;
						case "global": msg.payload = global.get(config.output_value); break;
					}
				}

				this.send(msg);
			} else {
				this.status({
					fill: "red",
					shape: "ring",
					text: join(new Date, parts, ':')
				});
			}
		});
	}
}

