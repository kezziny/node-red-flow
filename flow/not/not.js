let RED;
const state = module.exports = function(red) {
	RED = red;
	red.nodes.registerType("flow-invert", FlowNot);
}

let parts = [{hour: 'numeric', hour12: false}, {minute: 'numeric'}, {second: 'numeric'}];
function join(t, a, s) {
	function format(m) {
	   let f = new Intl.DateTimeFormat('en', m);
	   return f.format(t);
	}
	return a.map(format).join(s);
 }

class FlowNot {

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
			let data = msg.payload === null ? true : null;
			
			if (data !== null) {
				this.status({
					fill: "green",
					shape: "dot",
					text: join(new Date, parts, ':')
				});
			} else {
				this.status({
					fill: "red",
					shape: "ring",
					text: join(new Date, parts, ':')
				});
			}

			if (data !== this.State) {
				this.State = data;
				this.send({payload: data});
			}
		});
	}
}

