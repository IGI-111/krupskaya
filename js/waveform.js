// container is a canvas, data is a floating point array
function Waveform(container, data) {
	this.container = container;
	this.data = data;
	this.draw = function(){
		for (var i = 0, len = data.length; i < len; i++) {
			var increment = this.container.width/len;
			this.container.fillRect(0, 0, this.container.width, this.container.height);
		}
	}
}
