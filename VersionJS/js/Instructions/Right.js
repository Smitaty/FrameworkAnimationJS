/**
 * This instruction move the object right of x by interval of interval_x at a rate of FRAME_RATE
 */

class Right extends Instruction {

	constructor(object, x, interval_x) {
		super(object);
		this.x = x;
		this.interval_x = interval_x;
		this.destination = x + object.getX();
	}
	
	execute() {
		this.object.setState(MOVING_STATE);

		right(this);
		function right(instruction) {
			if (instruction.object.getX() < instruction.destination) {

				instruction.object.setX(instruction.object.getX() + instruction.interval_x);

				setTimeout(function() {
					right(instruction);
				}, FRAME_RATE);
			}
		}

		this.object.setState(DEFAULT_STATE);		
	}

}
