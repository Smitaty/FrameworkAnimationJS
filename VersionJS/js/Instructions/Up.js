class Up extends Instruction {
	
	constructor(object, y, interval_y) {
		this.object = object;
		this.type = "Up";
		this.y = y;
		this.interval_y = interval_y;
	}

	execute() {
		if (this.object.getY() < this.y) {
			
			this.object.setY(this.object.getY()+this.interval_y);
		
			setTimeout(function() {
		
				this.execute();
		
			}, FRAME_RATE/60);
		}
	}
}