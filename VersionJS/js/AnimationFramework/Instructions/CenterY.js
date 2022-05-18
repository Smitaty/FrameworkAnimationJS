/**
 * This instruction center verticaly the object atached to it
 */
import { Instruction } from "./Instruction.js";
import { HEIGHT } from '../animation_controller.js';
export class CenterY extends Instruction {

	constructor(object) {
		super(object);
	}

	execute() {
		if (this.object instanceof Text) {
			this.object.y = ((HEIGHT - this.object.real_height) / 2);
		} else {
			this.object.y = ((HEIGHT - this.object.height) / 2);
		}
	}

}
