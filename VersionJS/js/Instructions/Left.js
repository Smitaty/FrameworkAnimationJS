class Left extends Instruction{
    
    constructor(object, x, interval_x) {
        this.object = object;
        this.type = "Left";
        this.x = x;
        this.interval_x = interval_x;
    }
    execute() {
        if (this.object.getX() > this.x) {
            
                this.object.setX(this.object.getX()-this.interval_x);
            
                setTimeout(function() {
            
                  this.execute();
            
                }, FRAME_RATE/60);
        }
    }
}