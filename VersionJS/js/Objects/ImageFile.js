/**
 * 
 */

class ImageFile extends AnimatedObject {
    
    constructor(id, x, y, bgcolor, bgtransparent, bocolor, botransparent, state, layer, visible, opacity, width, height, image) {
        super(id, x, y, bgcolor, bgtransparent, bocolor, botransparent, state, layer, visible, opacity);
        this.width = width;
        this.height = height;
        this.image = image;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getImage() {
        return this.image;
    }

    setImage(image) {
        this.image = image;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    draw() {
        super.draw();
        image(this.image, this.x, this.y);
    }

    isCliked(x, y) {
		if((x >= this.x) && (x <= this.x + this.width) && (y >= this.y) && (y <= this.y + this.height))
            return true;
        return false;
    }
    
}
