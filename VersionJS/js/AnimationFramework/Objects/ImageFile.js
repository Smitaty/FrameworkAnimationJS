import { AnimatedObject } from "./AnimatedObject.js";
/**
 * 
 */

export class ImageFile extends AnimatedObject {
    
    constructor(id, x, y, background_color, background_transparent, border_color, border_transparency, border_size, state, layer, visible, opacity, angle, width, height, image_path) {
        super(id, x, y, background_color, background_transparent, border_color, border_transparency, border_size, state, layer, visible, opacity, angle);
        this.width = width;
        this.height = height;
        this.image_path = image_path;
        this.loaded_image;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getImagePath() {
        return this.image_path;
    }

    setImagePath(image_path) {
        this.image_path = image_path;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    loadImage(drawing) {
        this.loaded_image = drawing.loadImage(this.image_path);
    }

    draw(drawing) {
        drawing.push();
        super.draw(drawing);
        if (this.width == undefined || this.height == undefined) {
            drawing.image(this.loaded_image, this.x, this.y);
        } else {
            drawing.image(this.loaded_image, this.x, this.y, this.width, this.height);
        }
        drawing.pop();
    }

    isClicked(x, y, drawing) {
		return (x >= this.x) && (x <= this.x + this.width) && (y >= this.y) && (y <= this.y + this.height);
    }
    
    toXml() {
        let image = document.createElement("object_image");
        image.innerHTML = this.id;
        image.setAttribute("x", this.x);
        image.setAttribute("y",this.y);
        image.setAttribute("background_color", this.background_color); // r, g, b
        image.setAttribute("background_transparent", this.background_transparent);
        image.setAttribute("border_color", this.border_color); // r, g, b
        image.setAttribute("border_transparency", this.border_transparency);
        image.setAttribute("border_size", this.border_size);
        image.setAttribute("layer", this.layer);
        image.setAttribute("visible", this.visible);
        image.setAttribute("opacity", this.opacity);
        // image.setAttribute("angle", this.angle); // degrees
        image.setAttribute("width", this.width);
        image.setAttribute("height", this.height);
        image.setAttribute("image", this.image_path);
        return image;
    }

    clone() {
        return new ImageFile(this.id, this.x, this.y, this.background_color, this.background_transparent, this.border_color, this.border_transparency, this.state, this.layer, this.visible, this.opacity, this.angle, this.width, this.height, this.image_path);
    }

}
