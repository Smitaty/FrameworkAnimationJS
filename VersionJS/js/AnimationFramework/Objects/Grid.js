import { AnimatedObject } from "./AnimatedObject.js";
/**
 * 
 */

export class Grid extends AnimatedObject {

    /**
     * The number of rows
     * @type number
     */
    _rows;
    get rows () {
        return this._rows;
    }
  
    set rows (value) {
        this._rows = value;
    }

    /**
     * The number of columns
     * @type number
     */
    _columns;
    get columns () {
        return this._columns;
    }
    set columns (value) {
        this._columns = value;
    }

    /**
     * The line height
     * @type number
     */
    _row_height;
    get row_height () {
        return this._row_height;
    }
  
    set row_height (value) {
        this._row_height = value;
    }

    /** 
     * The column width
     * @type number
     */
    _column_width;
    get column_width () {
        return this._column_width;
    }
    set column_width (value) {
        this._column_width = value;
    }

    constructor (id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, state, layer, visible, opacity, angle, rows, columns, row_height, column_width) {
        super(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, state, layer, visible, opacity, angle);
        this._rows = rows;
        this._columns = columns;
        this._row_height = row_height;
        this._column_width = column_width;
    }

    draw (drawing) {
      drawing.push();
        super.draw(drawing);
        drawing.rect(this._x, this._y, this._column_width * this._columns, this._row_height * this._rows);
        for (let i = 1; i < this._rows; ++i) {
            drawing.line(this._x, this._y + i * this._row_height, this._x + this._column_width * this._columns, this._y + i * this._row_height);
        }
        for (let i = 1; i < this._columns; ++i) {
            drawing.line(this._x + i * this._column_width, this._y, this._x + i * this._column_width, this._y + this._row_height * this._rows);
        }
        drawing.pop();
    }

    isClicked (x, y, drawing) {
        return (x >= this._x) && (x <= this._columns * this._column_width) && (y >= this._y) && (y <= this._rows * this._row_height);
    }

    toXml () {
        let grid = document.createElement("object_grid");
        grid.innerHTML = this._id;
        grid.setAttribute("x", this._x);
        grid.setAttribute("y", this._y);
        grid.setAttribute("background_color", this._background_color); // r, g, b
        grid.setAttribute("background_transparency", this._background_transparency);
        grid.setAttribute("border_color", this._border_color); // r, g, b
        grid.setAttribute("border_transparency", this._border_transparency);
        grid.setAttribute("border_size", this._border_size);
        grid.setAttribute("layer", this._layer);
        grid.setAttribute("visible", this._visible);
        grid.setAttribute("opacity", this._opacity);
        // grid.setAttribute("angle", this._angle); // degrees
        grid.setAttribute("rows", this._rows);
        grid.setAttribute("columns", this._columns);
        grid.setAttribute("row_height", this._row_height);
        grid.setAttribute("column_width", this._column_width);
        return grid;
    }

    clone () {
        return new Grid(this._id, this._x, this._y, this._background_color, this._background_transparency, this._border_color, this._border_transparency, this._border_size, this._state, this._layer, this._visible, this._opacity, this._angle, this._lines, this._columns, this._row_height, this._column_width);
    }
}
