/**
 * 
 */
import { Ellipse } from "./Ellipse.js";
export class Circle extends Ellipse {
       
    constructor(id, x, y, bgcolor, bgtransparent, border_color, border_transparency, border_size, state, layer, visible, opacity, angle, radius) {
        super(id, x, y, bgcolor, bgtransparent, border_color, border_transparency, border_size, state, layer, visible, opacity, angle, radius * 2, radius * 2);
        this.radius = radius;
    }

    getRadius() {
        return this.radius;
    }

    setRadius(radius) {
        this.radius = radius;
    }

    draw(drawing) {
        super.draw(drawing);
    }

    isClicked(x, y) {
        // Compute the distance between the circle center and the mouse position
        let delta_x = this.x + this.radius - x;
        let delta_y = this.y + this.radius - y;
        let distance = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));
        return distance <= this.radius;
    }

    toXml() {
        let circle = document.createElement("object_circle");
        circle.innerHTML = this.id; 
        circle.setAttribute("x", this.x);
        circle.setAttribute("y",this.y);
        circle.setAttribute("bgcolor", this.bgcolor); // r, g, b
        circle.setAttribute("bgtransparent", this.bgtransparent);
        circle.setAttribute("border_color", this.border_color); // r, g, b
        circle.setAttribute("border_transparency", this.border_transparency);
        circle.setAttribute("border_size", this.border_size);
        circle.setAttribute("layer", this.layer);
        circle.setAttribute("visible", this.visible);
        circle.setAttribute("opacity", this.opacity);
        // circle.setAttribute("angle", this.angle); // degrees
        circle.setAttribute("radius", this.radius);
        return circle;
    }

    clone() {
        return new Circle(this.id, this.x, this.y, this.bgcolor, this.bgtransparent, this.border_color, this.border_transparency, this.state, this.layer, this.visible, this.opacity, this.angle, this.radius);
    }

}
