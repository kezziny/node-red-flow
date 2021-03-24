let RED;
const state = module.exports = function(red) {
	RED = red;
	red.nodes.registerType("flow-for", FlowFor);
}

let parts = [{hour: 'numeric', hour12: false}, {minute: 'numeric'}, {second: 'numeric'}];
function join(t, a, s) {
	function format(m) {
	   let f = new Intl.DateTimeFormat('en', m);
	   return f.format(t);
	}
	return a.map(format).join(s);
 }

class FlowFor {

	constructor(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		this.timer = null;
		
		this.status({
			fill: "red",
			shape: "ring",
			text: join(new Date, parts, ':')
		});

		this.on("input", (msg) => {
			if (msg.payload === null) {
				if (this.timer !== null) {
					clearTimeout(this.timer);
					this.timer = null;

					this.status({
						fill: "red",
						shape: "ring",
						text: join(new Date, parts, ':')
					});
					
					this.send({payload: null});
				}
			} else {
				if (this.timer === null || config.reset) {
					this.timer = setTimeout(() => { 
						this.send({payload: true}); 
						this.status({
							fill: "green",
							shape: "dot",
							text: join(new Date, parts, ':')
						});
					}, config.timeout * 1000);


					this.status({
						fill: "yellow",
						shape: "ring",
						text: join(new Date, parts, ':')
					});
				}
			}
		});
	}
}

