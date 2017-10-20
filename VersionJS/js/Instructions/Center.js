/*
 *  This instruction center horizontaly and verticaly the object atached to it  
 */
class Center extends Instruction {

    constructor(object) {
        super(object);
    }
    
    execute() {
        this.object.setX((WIDTH-this.object.getWidth())/2);
        this.object.setY((HEIGHT-this.object.getHeight())/2);  
    }
}
