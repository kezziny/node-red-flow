let RED;
const state = module.exports = function (red) {
	RED = red;
	red.nodes.registerType("flow-extract", FlowExtract);
}

let parts = [{hour: 'numeric', hour12: false}, {minute: 'numeric'}, {second: 'numeric'}];
function join(t, a, s) {
	function format(m) {
	   let f = new Intl.DateTimeFormat('en', m);
	   return f.format(t);
	}
	return a.map(format).join(s);
 }

class FlowExtract {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;

		this.status({
			fill: "red",
			shape: "ring",
			text: join(new Date, parts, ':')
		});

		this.on("input", (msg) => {
			if (msg.payload && msg.payload.hasOwnProperty(config.attribute)) {
				this.status({
					fill: "green",
					shape: "dot",
					text: join(new Date, parts, ':')
				});
				this.send({ payload: msg.payload[config.attribute] });
			} else {
				this.status({
					fill: "red",
					shape: "ring",
					text: join(new Date, parts, ':')
				});
				this.send({ payload: null });
			}

		});
	}
}

