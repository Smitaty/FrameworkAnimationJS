import { speed_animation, parseIntArray, ANIMATION_PATH } from './animation_controller.js';

import { DEFAULT_STATE, WAITING_CLICK_STATE } from './Objects/AnimatedObject.js';

import { Blink } from './Instructions/Blink.js';
import { Center } from './Instructions/Center.js';
import { CenterX } from './Instructions/CenterX.js';
import { CenterY } from './Instructions/CenterY.js';
import { Click } from './Instructions/Click.js';
import { Down } from './Instructions/Down.js';
import { GoTo } from './Instructions/GoTo.js';
import { Label } from './Instructions/Label.js';
import { Left } from './Instructions/Left.js';
import { MoveTo } from './Instructions/MoveTo.js';
import { Right } from './Instructions/Right.js';
import { SetProperty } from './Instructions/SetProperty.js';
import { Sleep } from './Instructions/Sleep.js';
import { State } from './Instructions/State.js';
import { Stop } from './Instructions/Stop.js';
import { Trigger } from './Instructions/Trigger.js';
import { Up } from './Instructions/Up.js';
import { Wait } from './Instructions/Wait.js';

import { Ellipse } from './Objects/Ellipse.js';
import { Circle } from './Objects/Circle.js';
import { Grid } from './Objects/Grid.js';
import { ImageFile } from './Objects/ImageFile.js';
import { Landmark } from './Objects/Landmark.js';
import { Polygon } from './Objects/Polygon.js';
import { Rectangle } from './Objects/Rectangle.js';
import { StartButton } from './Objects/StartButton.js';
import { Table } from './Objects/Table.js';
import { Text } from './Objects/Text.js';
import { Graph } from './Objects/Graph.js';
import { Arrow } from './Objects/Arrow.js';

/**
 * Animation class
 * Parse and read a given XML file andlaunch objects program
 * Preload, setup and draw according to animation_controller.js
 */

export class Animation {

    constructor (source_file, parent, width, height) {
        this.source_file = source_file; // path of the XML source file

        this.parent = parent; // HTML node containing the canevas
        this.width = width; // width of the canevas, in px
        this.height = height; // height of the canevas, in px

        this.objects = new Map(); // associative array containing drawing's objects, as object_identifier : Object
        this.programs = new Map(); // associative array containing instructions' programs, as object_identifier : array of Instruction elements
        this.layers = new Set(); // set containing the differents objects' layers
        this.objects_image = new Array(); // array containing image objects

        this.canvas = null;
        this.background = null; // path of the background image (can be "" if there isn't background image)
        this.loop_delay = speed_animation("normal"); // delay between two intruction's move

        this.start_button = new StartButton(this.width / 2, this.height / 2, "Click me to start", true);
        new Blink(this.start_button, 6, 20, this.loop_delay).execute();

        this.stop_animation = false;

        this.marker_shape = new Array();
        this.marker_enabled = true;
        this.marker_stroke_weight = 3;
        this.marker_color = [0,0,0];

        // Resize the target node if given
        if (this.parent != null) {
            this.parent.style.width = this.width + "px";
            this.parent.style.height = this.height + "px";
            this.parent.style.display = "flex";
            this.parent.style.flexDirection = "row";
            this.parent.style.alignItems = "center";
            this.parent.style.padding = "0";
        }
    }

    getBackground () {
        return this.background;
    }

    getObjects () {
        return this.objects;
    }

    /**
     * Display an error message because the XML file can't be
     */
    displayErrorMessage (source_file, target_id) {
        let error = document.createElement("div");
        error.innerHTML = "The XML file " + source_file + " of the animation " + target_id + " can't be read";
        error.style.flex = "1";
        error.style.textAlign = "center";
        error.style.color = "gray";
        this.parent.appendChild(error);
    }

    /**
     * Display a loading message while the objects are beeing created
     */
    displayLoadingMessage () {
        let loading = document.createElement("div");
        loading.className = "loading";
        loading.innerHTML = "loading...";
        loading.style.flex = "1";
        loading.style.textAlign = "center";
        loading.style.color = "gray";
        this.parent.appendChild(loading);
    }

    stopAnimation () {
        return this.stop_animation;
    }

    isValidColor (strColor) {
        try {
            var s = new Option().style;
            s.color = strColor;
            // return 'false' if color wasn't assigned
            return s.color == strColor.toLowerCase();
        } catch (_) {
            return false;
        }
    }

    isHexColor (strColor) {
        try {
            let RegExp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
            return RegExp.test(strColor);
        } catch (_) {
            return false;
        }
    }

    isRgbColor (strColor) {
        let result;
        strColor.includes(",") ? result = true : result = false;
        return result;
    }

    readXmlFile (contents) {
        let parser = new DOMParser();
        let root = parser.parseFromString(contents, "text/xml");

        // Retrieve speed, init, background, objects and programs nodes
        let animation_node = root.getElementsByTagName("animation")[0];
        let init_node = root.getElementsByTagName("init")[0];
        let background_node = root.getElementsByTagName("background")[0];
        let objects_node = root.getElementsByTagName("objects")[0];
        let programs_node = root.getElementsByTagName("programs")[0];

        // If the speed attribute exists
        if (animation_node.hasAttribute("speed")) {
            this.loop_delay = speed_animation(animation_node.getAttribute("speed"));
        }

        // If the marker attribute exists
        if (animation_node.hasAttribute("marker_enabled")) {
            this.marker_enabled = animation_node.getAttribute("marker_enabled") == "true";
        }

        this.marker_stroke_weight = animation_node.hasAttribute("marker_stroke_weight") ? parseInt(animation_node.getAttribute("marker_stroke_weight")) : 3;
        this.marker_color = animation_node.hasAttribute("marker_color") ? parseIntArray(animation_node.getAttribute("marker_color")) : [0, 0, 0];

        // If the init's node exists
        if (init_node) {
            let start_node = init_node.getElementsByTagName("start_button")[0];
            if (start_node) {
                if (start_node.hasAttribute("text")) this.start_button.text = start_node.getAttribute("text");
                if (start_node.hasAttribute("x")) this.start_button.x = start_node.getAttribute("x");
                if (start_node.hasAttribute("y")) this.start_button.y = start_node.getAttribute("y");
                if (start_node.hasAttribute("present") && start_node.getAttribute("present") == "false") this.start_button.present = false;
            }
        }

        // If the background's node exists
        if (background_node) {
            this.background = background_node.textContent;
            if (!this.isValidColor(this.background.trim()) && !this.isHexColor(this.background.trim()) && !this.isRgbColor(this.background.trim())) {
                // The image path is relative to the source file's one
                let source_file_path = this.source_file.substr(0, this.source_file.lastIndexOf("/") + 1);
                this.background = source_file_path + this.background;
            }
            else {
                if (this.isRgbColor(this.background.trim()))
                    this.background = parseIntArray(this.background);
            }
        } else {
            this.background = "white";
        }

        // If the objects' node exists
        if (objects_node) {
            // Create and push each object in the objects' array
            for (let read_object of objects_node.children) {
                let new_object = null;
                // Retrieve the AnimatedObjects' attributes
                let type = read_object.nodeName;
                let id = read_object.textContent;
                if (this.objects.has(id))
                    console.log("[Animation.js] L'identifiant '" + id + "' a déjà été utilisé par un objet, ce dernier va être écrasé par le nouvel objet");

                let x = parseInt(read_object.getAttribute("x")) | 0;
                let y = parseInt(read_object.getAttribute("y")) | 0;

                let background_color = read_object.hasAttribute("background_color") ? parseIntArray(read_object.getAttribute("background_color")) : [0, 0, 0];
                let background_transparency = read_object.hasAttribute("background_transparency") ? read_object.getAttribute("background_transparency") == "true" || read_object.getAttribute("background_transparency") == "1" : true;

                let border_color = read_object.hasAttribute("border_color") ? parseIntArray(read_object.getAttribute("border_color")) : [0, 0, 0];
                let border_transparency = read_object.hasAttribute("border_transparency") ? read_object.getAttribute("border_transparency") == "true" || read_object.getAttribute("border_transparency") == "1" : true;
                let border_size = parseInt(read_object.getAttribute("border_size")) | 1;

                let layer = parseInt(read_object.getAttribute("layer")) | 0;
                this.layers.add(layer);

                let visible = read_object.hasAttribute("visible") ? read_object.getAttribute("visible") == "true" || read_object.getAttribute("visible") == "1" : false;
                let opacity = read_object.hasAttribute("opacity") ? parseInt(read_object.getAttribute("opacity")) : 255;
                let angle = parseFloat(read_object.getAttribute("angle")) | 0;

                let width;
                let height;
                let font;
                let color;
                let padding;
                let halignment;
                let valignment;
                let row_height;
                let column_width;
                let round;

                // Retrieve the others specific attributes of the object and create the associated animated object
                switch (type) {
                    case 'object_text':
                        let text = read_object.getAttribute("text");
                        font = read_object.getAttribute("font").split(",");
                        color = read_object.hasAttribute("color") ? parseIntArray(read_object.getAttribute("color")) : [255, 255, 255];
                        padding = read_object.hasAttribute("padding") ? parseIntArray(read_object.getAttribute("padding")) : [];
                        width = read_object.hasAttribute("width") ? parseInt(read_object.getAttribute("width")) : undefined;
                        height = read_object.hasAttribute("height") ? parseInt(read_object.getAttribute("height")) : undefined;
                        halignment = read_object.hasAttribute("halignment") ? read_object.getAttribute("halignment") : "center";
                        valignment = read_object.hasAttribute("valignment") ? read_object.getAttribute("valignment") : "center";
                        round = read_object.hasAttribute("round") ? parseIntArray(read_object.getAttribute("round")) : [0, 0, 0, 0];
                        new_object = new Text(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, text, font, color, padding, width, height, halignment, valignment, round);
                        break;
                    case 'object_image':
                        width = read_object.hasAttribute("width") ? parseInt(read_object.getAttribute("width")) : undefined;
                        height = read_object.hasAttribute("height") ? parseInt(read_object.getAttribute("height")) : undefined;
                        let image = read_object.getAttribute("image");
                        this.objects_image.push(id);
                        new_object = new ImageFile(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, width, height, image);
                        break;
                    case 'object_rectangle':
                        width = parseInt(read_object.getAttribute("width"));
                        height = parseInt(read_object.getAttribute("height"));
                        round = read_object.hasAttribute("round") ? parseIntArray(read_object.getAttribute("round")) : [0, 0, 0, 0];
                        new_object = new Rectangle(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, width, height, round);
                        break;
                    case 'object_polygon':
                        let coord_x = parseIntArray(read_object.getAttribute("coord_x"));
                        let coord_y = parseIntArray(read_object.getAttribute("coord_y"));
                        new_object = new Polygon(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, coord_x, coord_y);
                        break;
                    case 'object_circle':
                        let radius = parseInt(read_object.getAttribute("radius"));
                        new_object = new Circle(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, radius);
                        break;
                    case 'object_ellipse':
                        width = parseInt(read_object.getAttribute("width"));
                        height = parseInt(read_object.getAttribute("height"));
                        new_object = new Ellipse(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, width, height);
                        break;
                    case 'object_landmark':
                        width = parseInt(read_object.getAttribute("width"));
                        height = parseInt(read_object.getAttribute("height"));
                        let scale_x = parseInt(read_object.getAttribute("scale_x"));
                        let scale_y = parseInt(read_object.getAttribute("scale_y"));
                        let unit_x = read_object.getAttribute("unit_x");
                        let unit_y = read_object.getAttribute("unit_y");
                        let max_x = parseInt(read_object.getAttribute("max_x"));
                        let max_y = parseInt(read_object.getAttribute("max_y"));
                        let min_x = parseInt(read_object.getAttribute("min_x"));
                        let min_y = parseInt(read_object.getAttribute("min_y"));
                        new_object = new Landmark(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, height, width, scale_x, scale_y, unit_x, unit_y, max_x, max_y, min_x, min_y);
                        break;
                    case 'object_grid':
                        let rows = parseInt(read_object.getAttribute("rows"));
                        let columns = parseInt(read_object.getAttribute("columns"));
                        row_height = parseInt(read_object.getAttribute("row_height"));
                        column_width = parseInt(read_object.getAttribute("column_width"));
                        new_object = new Grid(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, rows, columns, row_height, column_width);
                        break;
                    case 'object_table':
                        let values = read_object.getAttribute("values");
                        let has_header_columns = read_object.hasAttribute("has_header_columns") ? read_object.getAttribute("has_header_columns") == "true" || read_object.getAttribute("has_header_columns") == "1" : false;
                        let has_header_rows = read_object.hasAttribute("has_header_rows") ? read_object.getAttribute("has_header_rows") == "true" || read_object.getAttribute("has_header_rows") == "1" : false;
                        let header_background_color = read_object.hasAttribute("header_background_color") ? parseIntArray(read_object.getAttribute("header_background_color")) : background_color;
                        font = read_object.getAttribute("font").split(",");
                        let header_font = read_object.hasAttribute("header_font") ? read_object.getAttribute("header_font").split(",") : font;
                        color = read_object.hasAttribute("color") ? parseIntArray(read_object.getAttribute("color")) : [0, 0, 0];
                        let header_color = read_object.hasAttribute("header_color") ? parseIntArray(read_object.getAttribute("header_color")) : color;
                        padding = read_object.hasAttribute("padding") ? parseIntArray(read_object.getAttribute("padding")) : [];
                        halignment = read_object.hasAttribute("halignment") ? read_object.getAttribute("halignment") : "left";
                        valignment = read_object.hasAttribute("valignment") ? read_object.getAttribute("valignment") : "top";
                        row_height = parseInt(read_object.getAttribute("row_height"));
                        column_width = parseInt(read_object.getAttribute("column_width"));
                        let header_row_width = read_object.hasAttribute("header_row_width") ? parseInt(read_object.getAttribute("header_row_width")) : column_width;
                        let header_column_height = read_object.hasAttribute("header_column_height") ? parseInt(read_object.getAttribute("header_column_height")) : row_height;
                        new_object = new Table(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, values, row_height, column_width, font, color, padding, halignment, valignment, has_header_columns, has_header_rows, header_font, header_color, header_background_color, header_column_height, header_row_width);
                        break;
                    case 'object_graph':
                        let algorithmic_function = read_object.getAttribute("function");
                        let graph_width = parseInt(read_object.getAttribute("width"));
                        let graph_height = parseInt(read_object.getAttribute("height"));
                        let graph_scale_x = parseInt(read_object.getAttribute("scale_x"));
                        let graph_scale_y = parseInt(read_object.getAttribute("scale_y"));
                        let graph_unit_x = read_object.getAttribute("unit_x");
                        let graph_unit_y = read_object.getAttribute("unit_y");
                        let graph_max_x = parseInt(read_object.getAttribute("max_x"));
                        let graph_max_y = parseInt(read_object.getAttribute("max_y"));
                        let graph_min_x = parseInt(read_object.getAttribute("min_x"));
                        let graph_min_y = parseInt(read_object.getAttribute("min_y"));
                        let draw_point = read_object.hasAttribute("draw_point") ? (read_object.getAttribute("draw_point") === "true" ? true : false) : false;
                        new_object = new Graph(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, graph_height, graph_width, graph_scale_x, graph_scale_y, graph_unit_x, graph_unit_y, algorithmic_function, graph_max_x, graph_max_y, draw_point, graph_min_x, graph_min_y);
                        break;
                    case 'object_arrow':
                        let width_line = parseInt(read_object.getAttribute("width_line"));
                        let hegiht_line = parseInt(read_object.getAttribute("height_line"));
                        let width_triangle = parseInt(read_object.getAttribute("width_triangle"));
                        let height_triangle = parseInt(read_object.getAttribute("height_triangle"));
                        let rotation = read_object.hasAttribute("rotation") ? parseInt(read_object.getAttribute("rotation")) : 0;
                        new_object = new Arrow(id, x, y, background_color, background_transparency, border_color, border_transparency, border_size, DEFAULT_STATE, layer, visible, opacity, angle, width_line, hegiht_line, width_triangle, height_triangle, rotation);
                        break;
                    case 'object_copy':
                        let idcopy = read_object.getAttribute("idcopy");
                        let initial_object = this.objects.get(idcopy);
                        if (initial_object == null) {
                            console.log("[Animation.js] L'objet '" + idcopy + "' à copier n'existe pas (le définir avec l'attribut idcopy)");
                        } else {
                            new_object = initial_object.clone();
                            new_object.id = id;
                            for (let i = 1; i < read_object.attributes.length; ++i) { // i = 1 in order to avoid the first attribute (which is "object")
                                new SetProperty(null, new_object, read_object.attributes[i].name, read_object.attributes[i].value).execute();
                            }
                        }
                        break;
                }
                this.objects.set(id, new_object);
            }
        }

        // If the programs' node exists
        if (programs_node) {
            // Create and push each instruction's program in the programs' array
            for (let read_program of programs_node.children) {
                let object_id = read_program.getAttribute("assigned_to");
                let program = new Array();
                for (let read_instruction of read_program.children) {
                    let new_instruction = null;
                    // Retrieve the instruction's type
                    let type = read_instruction.nodeName;
                    // Retrieve the others specific attributes of the instruction and create the associated instruction
                    switch (type) {
                        case 'setx':
                            var x = read_instruction.getAttribute("x"); // don't parse to an int, already did in SetProperty.execution()
                            new_instruction = new SetProperty(this.objects.get(object_id), this.objects.get(object_id), "x", x);
                            break;
                        case 'sety':
                            var y = read_instruction.getAttribute("y");
                            new_instruction = new SetProperty(this.objects.get(object_id), this.objects.get(object_id), "y", y);
                            break;
                        case 'setxy':
                            var x = read_instruction.getAttribute("x");
                            var y = read_instruction.getAttribute("y");
                            new_instruction = new SetProperty(this.objects.get(object_id), this.objects.get(object_id), "x", x);
                            program.push(new_instruction);
                            new_instruction = new SetProperty(this.objects.get(object_id), this.objects.get(object_id), "y", y);
                            break;
                        case 'visible':
                            var value = read_instruction.getAttribute("value"); // don't parse to a boolean, already did in SetProperty.execution()
                            new_instruction = new SetProperty(this.objects.get(object_id), this.objects.get(object_id), "visible", value);
                            break;
                        case 'click':
                            new_instruction = new Click(this.objects.get(object_id));
                            break;
                        case 'label':
                            var value = read_instruction.getAttribute("value");
                            new_instruction = new Label(null, value);
                            break;
                        case 'moveto':
                            var x = parseInt(read_instruction.getAttribute("x"));
                            var y = parseInt(read_instruction.getAttribute("y"));
                            var dx = parseInt(read_instruction.getAttribute("dx"));
                            var dy = parseInt(read_instruction.getAttribute("dy"));
                            var delay = parseInt(read_instruction.getAttribute("delay"));
                            new_instruction = new MoveTo(this.objects.get(object_id), x, y, dx, dy, delay, this.loop_delay);
                            break;
                        case 'wait':
                            var value = read_instruction.getAttribute("value");
                            new_instruction = new Wait(this.objects.get(object_id), value);
                            break;
                        case 'sleep':
                            var value = parseInt(read_instruction.getAttribute("value"));
                            new_instruction = new Sleep(this.objects.get(object_id), value, this.loop_delay);
                            break;
                        case 'state':
                            console.log("[Animation.js] Attention, instruction state dépréciée");
                            var value = read_instruction.getAttribute("value");
                            new_instruction = new State(this.objects.get(object_id), value);
                            break;
                        case 'trigger':
                            var object = read_instruction.getAttribute("object");
                            var value = read_instruction.getAttribute("value");
                            new_instruction = new Trigger(this.objects.get(object_id), this.objects.get(object), value);
                            break;
                        case 'goto':
                            var value = read_instruction.getAttribute("value");
                            new_instruction = new GoTo(null, value);
                            break;
                        case 'up':
                            var y = parseInt(read_instruction.getAttribute("y"));
                            var dy = parseInt(read_instruction.getAttribute("dy"));
                            new_instruction = new Up(this.objects.get(object_id), y, dy, this.loop_delay);
                            break;
                        case 'down':
                            var y = parseInt(read_instruction.getAttribute("y"));
                            var dy = parseInt(read_instruction.getAttribute("dy"));
                            new_instruction = new Down(this.objects.get(object_id), y, dy, this.loop_delay);
                            break;
                        case 'left':
                            var x = parseInt(read_instruction.getAttribute("x"));
                            var dx = parseInt(read_instruction.getAttribute("dx"));
                            new_instruction = new Left(this.objects.get(object_id), x, dx, this.loop_delay);
                            break;
                        case 'right':
                            var x = parseInt(read_instruction.getAttribute("x"));
                            var dx = parseInt(read_instruction.getAttribute("dx"));
                            new_instruction = new Right(this.objects.get(object_id), x, dx, this.loop_delay);
                            break;
                        case 'angle':
                            var degrees = parseInt(read_instruction.getAttribute("degrees"));
                            new_instruction = new SetProperty(this.objects.get(object_id), this.objects.get(object_id), "angle", degrees);
                            break;
                        case 'setproperty':
                            var object = read_instruction.getAttribute("object");
                            var property = read_instruction.getAttribute("property");
                            var value = read_instruction.getAttribute("value");
                            new_instruction = new SetProperty(this.objects.get(object_id), this.objects.get(object), property, value);
                            break;
                        case 'blink':
                            var times = parseInt(read_instruction.getAttribute("times"));
                            var delay = parseInt(read_instruction.getAttribute("delay"));
                            new_instruction = new Blink(this.objects.get(object_id), times, delay, this.loop_delay);
                            break;
                        case 'stop':
                            new_instruction = new Stop(this);
                            break;
                        case 'center':
                            new_instruction = new Center(this.objects.get(object_id));
                            break;
                        case 'centerx':
                            new_instruction = new CenterX(this.objects.get(object_id));
                            break;
                        case 'centery':
                            new_instruction = new CenterY(this.objects.get(object_id));
                            break;
                    }
                    program.push(new_instruction);
                }
                this.programs.set(object_id, program);
            }
        }

        // Execute programs of the programs array, as max 1 program per object
        for (let object_id of this.objects.keys()) {
            if (this.programs.get(object_id)) {
                this.execute_instructions(object_id, 0, new Map());
            }
        }
    }

    execute_instructions (object_id, instruction_number, labels) {
        // Retrieve the program and the current instruction of the program
        let program = this.programs.get(object_id);

        // In case of the program does not contain any instruction, stop its execution right now
        if (this.stop_animation || program.length == 0) {
            return;
        }

        let instruction = program[instruction_number];

        let next_instruction = instruction_number; // the next instruction is by default the current one
        let continue_execution = true; // this program will by default continue

        // Execute the instruction if the state of the object is the default one
        if (!this.start_button.present && this.objects.get(object_id).state == DEFAULT_STATE) {
            let instruction_type = instruction.constructor.name;
            if (instruction_type == "Label") {
                labels.set(instruction.getValue(), instruction_number + 1);
                next_instruction = instruction_number + 1;
            } else if (instruction_type == "GoTo") {
                next_instruction = labels.get(instruction.getValue());
            } else if (instruction_type == "Stop") {
                let continue_execution = false;
                this.stop_animation = true;
            } else {
                instruction.execute();
                next_instruction = instruction_number + 1;
                continue_execution = next_instruction < program.length;
            }
        }

        if (continue_execution) {
            re_execute(this);
            function re_execute (animation) {
                setTimeout(function () {
                    animation.execute_instructions(object_id, next_instruction, labels);
                }, 1);
            }
        }
    }

    preload (drawing) {
        // Load the backround image
        if (this.background != "" && !this.isValidColor(this.background.trim()) && !this.isHexColor(this.background.trim()) && !this.isRgbColor(this.background)) {
            this.background = drawing.loadImage(this.background);
        }

        // Load animation's images
        for (let object_id of this.objects_image) {
            this.objects.get(object_id).loadImage(drawing);
        }

        // Convert and sort the layers set
        this.layers = Array.from(this.layers);
        this.layers.sort();

        if (this.marker_enabled) {
            this.clearButton = new ImageFile('Clear button', this.width - 20, 0, [0, 0, 0], true, [255, 255, 255], false,
                2, DEFAULT_STATE, 5, true, 255, null, 20, 20, ANIMATION_PATH + '../../img/supprimer.png');
            this.clearButton.loadImage(drawing);
        }
    }

    setup (drawing) {
        this.canvas = drawing.createCanvas(this.width, this.height);
        this.canvas.parent(this.parent);
        this.stop = false;

        //drawing.frameRate(1);

        // Remove the loading message
        this.parent.removeChild(this.parent.getElementsByClassName("loading")[0]);
    }

    draw (drawing) {
        // Display the background image
        if (this.background != null) {
            drawing.background(this.background);
        }

        // Display the start button if it has to
        if (this.start_button.present) {
            this.start_button.draw(drawing);
        } else {
            // Display objects of each layer, if they're set as visible
            for (let layer of this.layers) {
                for (let object of this.objects.values()) {
                    if (object.layer == layer && object.visible) {
                        object.draw(drawing);
                    }
                }
            }
        }

        // Marker
        if (this.marker_enabled) {
            drawing.push();

            drawing.strokeWeight(this.marker_stroke_weight);
            drawing.stroke(this.marker_color);

            for (let arr of this.marker_shape) {
                for (let i = 0; i < arr.length; i++) {
                    if (i + 1 < arr.length) {
                        drawing.line(arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y);
                    }
                }
            }

            drawing.pop();

            this.clearButton.draw(drawing);
        }

        if (this.stop === true) {
            console.log('est');
            drawing.noLoop();
        }
    }

    canvasClicked (drawing) {
        // Get the visible objects that are under the cursor position
        for (let object of this.objects.values()) {
            if (object.visible) {
                if (object.isClicked(drawing.mouseX, drawing.mouseY, drawing)) {
                    new Trigger(null, object, WAITING_CLICK_STATE).execute();
                }
            }
        }

        if (this.start_button.present && this.start_button.isClicked(drawing.mouseX, drawing.mouseY, drawing)) {
            this.start_button.present = (false);
        }

        if (this.marker_enabled && this.clearButton.isClicked(drawing.mouseX, drawing.mouseY, drawing)) {
            this.marker_shape = [];
        }
    }

    markerStart () {
        if (this.marker_enabled) {
            this.marker_shape.push([]);
        }
    }

    markerInUse (drawing) {
        if (this.marker_enabled) {
            this.marker_shape[this.marker_shape.length - 1].push(drawing.createVector(drawing.mouseX, drawing.mouseY));
        }
    }
}
