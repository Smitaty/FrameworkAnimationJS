import { Animation } from './Animation.js';


/**********************
* Classes (to modify)
*/

export let OBJECT_CLASSES = ["AnimatedObject", "Ellipse", "Circle", "Grid", "ImageFile", "Landmark", "Polygon", "Rectangle", "StartButton", "Text"];
export let INSTRUCTION_CLASSES = ["Instruction", "SimpleMovement", "Blink", "Center", "CenterX", "CenterY", "Click",
	"Down", "GoTo", "Label", "Left", "MoveTo", "Right", "SetProperty", "Sleep", "State", "Stop", "Trigger", "Up", "Wait"];

/**********************
 * Global variables
 */

export let ANIMATION_FILES_INCLUDED = false;
let ANIMATIONS = new Array();
export let FRAME_RATE = 60; // frames displayed per second
export let LOOP_DELAY_MAX = 60; // lowest speed of the animation, one frame's duration (ms)
export let LOOP_DELAY_MIN = 0; // highest speed of the animation, one frame's duration (ms)

export let ANIMATION_PATH;
export let WIDTH;
export let HEIGHT;


/**********************
 * Loading and execution functions
 */

export function load_animation (source_file, target_id, width, height) {
	// Check if animation files are included
	if (!ANIMATION_FILES_INCLUDED) {
		console.log("Animation files are not included. Include them by this way :\n<script>include_animation_files(\"path/of/AnimationFramework/\");</script>");
	}

	// Loop with delay until animation classes are not loaded
	if (typeof (p5) === "undefined" || typeof (Animation) === "undefined") {
		setTimeout(function () {
			load_animation(source_file, target_id, width, height);
		}, 150);
	}
	// Create the animation object when animation files are included
	else {
		let parent = document.getElementById(target_id);

		// Check if the parent node exists
		if (parent == undefined) {
			console.log("[animation_controller.js] Le noeud parent n'existe pas ; vérifier qu'une balise HTML possède l'id donné (" + target_id + ")");
			return;
		}

		// Create the animation object
		let animation = new Animation(source_file, parent, width, height);
		ANIMATIONS.push(animation);
		WIDTH = width;
		HEIGHT = height;

		// Read the animation's XML file using AJAX
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
				animation.displayLoadingMessage();
				animation.readXmlFile(xhr.responseText);
				draw_animation(animation);
			} else if (xhr.readyState == 4 && !(xhr.status == 200 || xhr.status == 0)) {
				animation.displayErrorMessage(source_file, target_id);
			}
		};
		xhr.open("GET", source_file, true);
		xhr.send();
	}
}

function draw_animation (animation_obj) {
	new p5(function (draw_ref) {

		draw_ref.preload = function () { // preload function runs once
			animation_obj.preload(draw_ref);
		};

		draw_ref.setup = function () { // setup function waits until preload one is done
			animation_obj.setup(draw_ref);
		};

		draw_ref.draw = function () {
			if (!animation_obj.stopAnimation()) {
				animation_obj.draw(draw_ref);
			}
		};

		draw_ref.mouseClicked = function () {
			// Get the visible objects that are under the cursor position
			animation_obj.canvasClicked(draw_ref);
			// Prevent default
			return false;
		};

		draw_ref.mousePressed = function () {
			if (draw_ref.mouseButton === draw_ref.LEFT) {
				animation_obj.markerStart();
			}
		};

		draw_ref.mouseDragged = function () {
			if (draw_ref.mouseButton === draw_ref.LEFT) {
				animation_obj.markerInUse(draw_ref);
			}
		};

	});
}


/**********************
 * Others functions 
 */

export function speed_animation (speed) {
	let loop_delay = 30;

	switch (speed) {
		case "very_slow":
			loop_delay = LOOP_DELAY_MAX;
			break;
		case "slow":
			loop_delay = LOOP_DELAY_MAX * 0.75 + LOOP_DELAY_MIN * 0.25;
			break;
		case "normal":
			loop_delay = LOOP_DELAY_MAX * 0.50 + LOOP_DELAY_MIN * 0.50;
			break;
		case "fast":
			loop_delay = LOOP_DELAY_MAX * 0.25 + LOOP_DELAY_MIN * 0.75;
			break;
		case "very_fast":
			loop_delay = LOOP_DELAY_MIN;
			break;
		default:
			console.log(`Unrecognized speed '${speed}', availables values are 'very_slow', 'slow', 'normal', 'fast', 'very_fast'.`);
	}

	// Changer la valeur du select
	if (document.getElementById('speed'))
		document.getElementById('speed').value = speed;

	return loop_delay;
}

export function include_animation_files (path) {
	let script = document.createElement("script");
	script.src = path + 'p5.min.js';
	document.lastChild.appendChild(script);

	ANIMATION_FILES_INCLUDED = true;
	ANIMATION_PATH = path;
}

/**
 * Parse a a string into an int array, splitting on commas
 */
export function parseIntArray (string) {
	if (string == "") return [0, 0, 0];

	let array = string.split(",");

	for (let i in array) {
		array[i] = parseInt(array[i]);
	}

	return array;
}
