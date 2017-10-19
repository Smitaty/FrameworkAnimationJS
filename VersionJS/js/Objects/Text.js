class Text extends AnimatedObject {
	constructor(id, x, y, text, font, fgcolor, bgcolor, bocolor, state, border, bgtransparent, layer, opacity) {
		super(id, x, y, fgcolor, bgcolor, state, layer, opacity);
		this.text = text;
		this.bocolor = bocolor;
		this.font = font;
		this.border = border;
		this.bgtransparent = bgtransparent;
	}

	getText() {
		return this.text;
	}

	getBocolor() {
		return this.bocolor;
	}

	getFont() {
		return this.font;
	}

	getBorder() {
		return this.border;
	}

	getTransparency() {
		return this.transparency;
	}

	setText(text) {
		this.text = text;
	}

	setBocolor(bocolor) {
		this.bocolor = bocolor;
	}

	setFont(font) {
		this.font = font;
	}

	setBorder(border) {
		this.border = border;
	}

	setTransparency(transparency) {
		this.transparency = transparency;
	}

	draw() {
		text(this.text, this.x, this.y)
	}
}