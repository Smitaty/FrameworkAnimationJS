/**
 * 
 */

// File-shared object's states
var DEFAULT_STATE = "normal";
var WAITING_CLICK_STATE = "waiting_click";
var SLEEPING_STATE = "sleeping";
var MOVING_STATE = "moving";

class AnimatedObject {
   
    constructor(id, x, y, bgcolor, bgtransparent, bocolor, botransparent, state, layer, visible, opacity, angle) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.bgcolor = bgcolor; // r, g, b
        this.bgtransparent = bgtransparent;
        this.bocolor = bocolor; // r, g, b
        this.botransparent = botransparent;
        this.state = state;
        this.layer = layer;
        this.visible = visible;
        this.opacity = opacity;
        this.angle = angle; // degrees
    }

    getId() {
        return this.id;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getBgcolor() {
        return this.bgcolor;
    }

    getBgtransparent() {
        return this.bgtransparent;
    }

    getBocolor() {
        return this.bocolor;
    }

    getBotransparent() {
        return this.botransparent;
    }

    getState() {
        return this.state;
    }

    getLayer() {
        return this.layer;
    }

    getVisible() {
        return this.visible;
    }

    getOpacity() {
        return this.opacity;
    }

    getAngle() {
        return this.angle;
    }

    setId(id) {
        this.id = id;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setBgcolor(bgcolor) {
        this.bgcolor = bgcolor;
    }
    
    setBgtransparent(bgtransparent) {
        this.bgtransparent = bgtransparent;
    }

    setBocolor(bocolor) {
        this.bocolor = bocolor;
    }

    setBotransparent(botransparent) {
        this.botransparent = botransparent;
    }

    setState(state) {
        this.state = state;
    }

    setLayer(layer) {
        this.layer = layer;
    }

    setVisible(visible) {
        this.visible = visible;
    }

    setOpacity(opacity) {
        this.opacity = opacity;
    }

    setAngle(angle) {
        this.angle = angle;
    }

    draw() {
        // Fill the object
        if (this.bgtransparent) fill(0, 0);
        else fill(this.bgcolor, this.opacity * 255);
        // Border
        if (this.botransparent) noStroke();
        else stroke(this.bocolor, this.opacity * 255);
        // Rotation
        // todo, si la rotation est possible (tests en cours)
    }

}
