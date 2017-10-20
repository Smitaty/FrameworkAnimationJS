/*
*   This instruction set the object to a waiting state for a certain number of frame cycle 
*/
class Sleep extends Instruction {

    constructor(object, value) {
        super(object);
        this.value = value;
    }

    execute() {
        this.object.setState("sleeping");
        setTimeout(function() {
            this.object.setState(DEFAULT_STATE);
        }, (FRAME_RATE/60)*this.value);
    }
}
