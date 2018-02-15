/**
 * 
 */

class Text extends AnimatedObject {
	
	constructor(id, x, y, bgcolor, bgtransparent, bocolor, botransparent, state, layer, visible, opacity, angle, text, font, color, border, width, height, halignment, valignment) {
        super(id, x, y, bgcolor, bgtransparent, bocolor, botransparent, state, layer, visible, opacity, angle);
		this.text = text;
		this.font = font; // FontName, FontSize, FontWeight
		this.color = color; // r, g, b
		this.border = border;
		this.width = width;
		this.height = height;
		this.halignment = halignment;
		this.valignment = valignment;

		this.real_width;
		this.real_height;
		this.computeRealDimension();
	}

	getWidth() {
        return this.real_width;
    }

    getHeight() {
        return this.real_height;
	}
	
	getText() {
		return this.text;
	}

	getFont() {
		return this.font;
	}

	getColor () {
		return this.color;
	}

	getBorder() {
		return this.border;
	}

	getHalignment() {
		return this.halignment;
	}

	getValignment() {
		return this.valignment;
	}

	setText(text) {
		this.text = text;
		this.computeRealDimension();
	}

	setFont(font) {
		this.font = font;
	}

	setColor(color) {
		this.color = color;
	}

	setBorder(border) {
		this.border = border;
	}

	setWidth(width) {
        this.width = width;
		this.computeRealDimension();
    }

    setHeight(height) {
        this.height = height;
		this.computeRealDimension();
	}

	setHalignment(halignment) {
		this.halignment = halignment;
	}

	setValignment(valignment) {
		this.valignment = valignment;
	}

	computeRealDimension() {
		this.real_width = (this.width == undefined) ? this.text.length * (parseInt(this.font[1])/2 + 1) + 2 : this.width;
		this.real_height = (this.height == undefined) ? parseInt(this.font[1]) + 8 : this.height;
	}
	
	draw(drawing) {
		super.draw(drawing);
		// Background
		drawing.rect(this.x, this.y, this.real_width, this.real_height);
		// this.text.
		// Remplacer les @ par \n TODO p-ê utiliser textLeading (https://p5js.org/reference/#/p5/textLeading)
		// Text's color, font, size and style
		if (this.border == 0) drawing.noStroke();
		else drawing.stroke(this.border);
		drawing.fill(this.color[0], this.color[1], this.color[2], this.opacity * 255);
		drawing.textFont(this.font[0]);
		drawing.textSize(parseInt(this.font[1]));
		drawing.textStyle(this.font[2] == "bold" ? drawing.BOLD : this.font[2] == "italic" ? drawing.ITALIC : drawing.NORMAL);
		// Text alignment
		drawing.textAlign(this.halignment == "right" ? drawing.RIGHT : this.halignment == "center" ? drawing.CENTER : drawing.LEFT,
		this.valignment == "center" ? drawing.CENTER : this.valignment == "bottom" ? drawing.BOTTOM : this.valignment == "baseline" ? drawing.BASELINE : drawing.TOP);
		// Display
		drawing.text(this.text, this.x + 2, this.y + 4);
	}
	
	isClicked(x, y) {
		if((x >= this.x) && (x <= this.x + this.real_width) && (y >= this.y) && (y <= this.y + this.real_height))
            return true;
        return false;
	}
	
	toXml() {
        var text = document.createElement("object_text");
        text.setAttribute("id", this.id); 
        text.setAttribute("x", this.x);
        text.setAttribute("y",this.y);
        text.setAttribute("bgcolor", this.bgcolor); // r, g, b
        text.setAttribute("bgtransparent", this.bgtransparent);
        text.setAttribute("bocolor", this.bocolor); // r, g, b
        text.setAttribute("botransparent", this.botransparent);
        text.setAttribute("state", this.state);
        text.setAttribute("layer", this.layer);
        text.setAttribute("visible", this.visible);
        text.setAttribute("opacity", this.opacity);
        text.setAttribute("angle", this.angle); // degrees
        text.setAttribute("text", this.text);
		text.setAttribute("font", this.font); // FontName, FontSize, FontWeight
		text.setAttribute("color", this.color); // r, g, b
		text.setAttribute("border", this.border);
		text.setAttribute("width", this.width);
		text.setAttribute("height", this.height);
		text.setAttribute("halignment",this.halignment); 
		text.setAttribute("valignment", this.valignment);
        return text;
    }

    clone() {
		return new Text(this.id, this.x, this.y, this.bgcolor, this.bgtransparent, this.bocolor, this.botransparent, this.state, this.layer, this.visible, this.opacity, this.angle, this.text, this.font, this.color, this.border, this.width, this.height, this.halignment, this.valignment);
	}
	
}
