import { AnimatedObject } from "./AnimatedObject.js";
/**
 * 
 */

export class Grid extends AnimatedObject {
    
    constructor(id, x, y, bgcolor, bgtransparent, border_color, border_transparency, border_size, state, layer, visible, opacity, angle, lines, columns, line_height, column_width) {
        super(id, x, y, bgcolor, bgtransparent, border_color, border_transparency, border_size, state, layer, visible, opacity, angle);
        this.lines = lines;
        this.columns = columns;
        this.line_height = line_height;
        this.column_width = column_width;
    }

    getLines() {
        return this.lines;
    }

    getLine_height() {
        return this.line_height;
    }

    getColumns() {
        return this.columns;
    }

    getColumn_width() {
        return this.column_width;
    }

    setLines(lines) {
        this.lines = lines;
    }

    setLine_height(line_height) {
        return this.line_height = line_height;
    }

    setColumns(columns) {
        this.columns = columns;
    }

    setColumn_width(column_width) {
        this.column_width = column_width;
    }

    draw(drawing) {
        super.draw(drawing);
        drawing.rect(this.x, this.y, this.column_width * this.columns, this.line_height * this.lines);
        for (let i = 1; i < this.lines; ++i) {
            drawing.line(this.x, this.y + i * this.line_height, this.x + this.column_width * this.columns, this.y + i * this.line_height);
        }
        for (let i = 1; i < this.columns; ++i) {
            drawing.line(this.x + i * this.column_width, this.y, this.x + i * this.column_width, this.y + this.line_height * this.lines);
        }
    }

    isClicked(x, y) {
        return (x >= this.x) && (x <= this.columns * this.column_width) && (y >= this.y) && (y <= this.lines * this.line_height);
    }

    toXml() {
        let grid = document.createElement("object_grid");
        grid.innerHTML = this.id;
        grid.setAttribute("x", this.x);
        grid.setAttribute("y",this.y);
        grid.setAttribute("bgcolor", this.bgcolor); // r, g, b
        grid.setAttribute("bgtransparent", this.bgtransparent);
        grid.setAttribute("border_color", this.border_color); // r, g, b
        grid.setAttribute("border_transparency", this.border_transparency);
        grid.setAttribute("border_size", this.border_size);
        grid.setAttribute("layer", this.layer);
        grid.setAttribute("visible", this.visible);
        grid.setAttribute("opacity", this.opacity);
        // grid.setAttribute("angle", this.angle); // degrees
        grid.setAttribute("lines", this.lines);
        grid.setAttribute("columns", this.columns);
        grid.setAttribute("line_height", this.line_height);
        grid.setAttribute("column_width", this.column_width);
        return grid;
    }

    clone() {
        return new Grid(this.id, this.x, this.y, this.bgcolor, this.bgtransparent, this.border_color, this.border_transparency, this.state, this.layer, this.visible, this.opacity, this.angle, this.lines, this.columns, this.line_height, this.column_width);
    }

}
