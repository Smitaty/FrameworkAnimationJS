/*
 *  This instruction make the object blink at each Delay*frame rate, for Times iteration
 */

class Blink extends Instruction {

	constructor(object, times, delay) {
		super(object);
		this.times = times;
		this.delay = delay;

		this.initial_opacity;
		this.visible_opacity;
	}

	execute() {
		this.initial_opacity = this.object.getOpacity();
		this.visible_opacity = this.object.getOpacity() == 0 ? 1 : this.object.getOpacity();

		blink(this, 0);
		function blink(instruction, blinked_times) {

			if (instruction.object.getOpacity() == 0) instruction.object.setOpacity(instruction.visible_opacity);
			else instruction.object.setOpacity(0);

			if (blinked_times < instruction.times && (instruction.object.getState() == DEFAULT_STATE || instruction.object.getState() == WAITING_CLICK_STATE)) {
				setTimeout(function() {
					blink(instruction, ++blinked_times);
				}, instruction.delay * 20);
			} else {
				instruction.object.setOpacity(instruction.initial_opacity);
			}
		}
	}
	
}
