/**
 * 
 */

class Landmark extends AnimatedObject {
    
	constructor(id, x, y, fgcolor, bgcolor, bgtransparent, bocolor, botransparent, state, layer, visible, opacity, height, width, scaleX, scaleY, unitX, unitY) {
        super(id, x, y, fgcolor, bgcolor, bgtransparent, bocolor, botransparent, state, layer, visible, opacity);
        this.height = height;
        this.width = width;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.unitX = unitX;
        this.unitY = unitY;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getScaleX() {
        return this.scaleX;
    }

    getScaleY() {
        return this.scaleY;
    }

    getUnitX() {
        return this.unitX;
    }

    getUnitY() {
        return this.unitY;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    setScaleX(scaleX) {
        this.scaleX = scaleX;
    }

    setScaleY(scaleY) {
        this.scaleY = scaleY;
    }

    setUnitX(unitX) {
        this.unitX = unitX;
    }

    setUnitY(unitY) {
        this.unitY = unitY;
    }

    draw() {
        super.draw()
        line(this.x, this.y, this.x + this.width, this.y);
        line(this.x, this.y, this.x, this.y + this.height); 
        if(this.heigth > 0 && this.width > 0) {
            //texte x
            text(this.unitX, this.x + this.width/2, this.y - 1);
            //texte y (Ca serait bien d'orienter le texte)
            text(this.unitY, this.x - 1, this.y + this.height/2 );
        }
        else if(this.height < 0 && this.width > 0) { 
            //texte x
            text(this.unitX, this.x + this.width/2, this.y + 1);
            //texte y (Ca serait bien d'orienter le texte)
            text(this.unitY, this.x - 1, this.y - this.height/2 );
        }
        else if(this.height > 0 && this.width < 0) {
            //texte x
            text(this.unitX, this.x + this.width/2, this.y - 1);
            //texte y (Ca serait bien d'orienter le texte)
            text(this.unitY, this.x + this.width + 1, this.y + this.height/2 );
        }
        else if(this.height < 0 && this.width < 0) {
            //texte x
            text(this.unitX, this.x + this.width/2, this.y + 1);
            //texte y (Ca serait bien d'orienter le texte)
            text(this.unitY, this.x + this.width + 1, this.y + this.height/2 );
        }
    }
    
}
