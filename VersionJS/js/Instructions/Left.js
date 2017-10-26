/**
 * This instruction move the object left of x by interval of interval_x at a speed of LOOP_DELAY
 */

class Left extends Instruction {

	constructor(object, distance, interval) {
		super(object);
		this.distance = distance;
		this.interval = interval;
	}

	execute() {
		this.object.setState(MOVING_STATE);

		left(this);
		function left(instruction) {
			if (instruction.distance > 0) {
				
				instruction.object.setX(instruction.object.getX() - instruction.interval);
				instruction.distance -= instruction.interval;

				setTimeout(function() {
					left(instruction);
				}, LOOP_DELAY);
			} else {
				instruction.object.setState(DEFAULT_STATE);
			}
		}

	}
	
}
