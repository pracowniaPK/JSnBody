let resetButton;
let updateButton;
let wallBounceCheckbox;
let gSlider;

var bodyTable;
var dispSize = 800;
var wallBounce;
var showcom = true;
var showke = true;
var initMass = 8;
var randomMass = true;
var initVelocity = 0;
var randomVelocity = true;
var bodyColor = 100;
var comColor = 'rgba(255,0,0, 0.5)';
var initbgColor = 255;
var bgColor = 'rgba(255,255,255, 0.05)';
var n = 12;
var G = 0.1;

function setup() {
	createCanvas(dispSize, dispSize);
	noStroke();
	setupInterface();
	resetSim();
}

function draw() {
	simulationStep();
	drawBodies();
	updateAndDrawCOM();
	updateAndDrawKE();
}

class Body {
	constructor(mass, v) {
		this.rx = Math.random() * height;
		this.ry = Math.random() * width;
		this.vx = randomMass ? (Math.random() - 0.5) * v : v;
		this.vy = randomMass ? (Math.random() - 0.5) * v : v;
		this.ax = 0;
		this.ay = 0;
		this.mass = randomMass ? Math.random() * mass : mass;
	}
}

function resetSim() {
	updateSim()

	bodyTable = [];
	for (var i = 0; i < n; i++){
		bodyTable.push(new Body(initMass, initVelocity));
	}
	background(initbgColor);
}

function updateSim() {
	wallBounce = wallBounceCheckbox.checked();
	G = gSlider.value() / 100;
}

function setupInterface() {
	resetButton = createButton('Reset');
	resetButton.mouseClicked(resetSim);
	updateButton = createButton('Update');
	updateButton.mouseClicked(updateSim);
	wallBounceCheckbox = createCheckbox('Wall bounce', false);
	gSlider = createSlider(0, 100, 10); // *100
	interfaceLineUp([resetButton, updateButton, wallBounceCheckbox, gSlider], 20, 30);
}

function interfaceLineUp(iList, offsetX, offsetY) {
	for (var element in iList){
		iList[element].position(offsetX, height + element * offsetY);
}
}

function simulationStep(){
	for (var i = 0; i < bodyTable.length; i++){
		bodyTable[i].ax = 0;
		bodyTable[i].ay = 0;
		for (var j = 0; j < bodyTable.length; j++){
			if (i != j) {
				dx = bodyTable[j].rx - bodyTable[i].rx;
				dy = bodyTable[j].ry - bodyTable[i].ry;
				r = Math.sqrt(dx*dx + dy*dy);
				
                g = G * bodyTable[i].mass * bodyTable[j].mass / r;
                gx = dx * g / r;
                gy = dy * g / r;
				bodyTable[i].ax += gx / bodyTable[i].mass;
				bodyTable[i].ay += gy / bodyTable[i].mass;
			}
        }
    }
	for (i = 0; i < bodyTable.length; i++){
		bodyTable[i].vx += bodyTable[i].ax;
		bodyTable[i].vy += bodyTable[i].ay;
		bodyTable[i].rx += bodyTable[i].vx + bodyTable[i].ax ** 2;
		bodyTable[i].ry += bodyTable[i].vy + bodyTable[i].ay ** 2;
		
		if (wallBounce) {
			if (bodyTable[i].rx < 0 || bodyTable[i].rx > height)
				bodyTable[i].vx = (-1) * bodyTable[i].vx;
			if (bodyTable[i].ry < 0 || bodyTable[i].ry > height)
				bodyTable[i].vy = (-1) * bodyTable[i].vy;
		}
	}
}

function drawBodies(){
	for (i = 0; i < bodyTable.length; i++){
        fill(bodyColor);
		ellipse(bodyTable[i].rx, bodyTable[i].ry, 2 * Math.sqrt(bodyTable[i].mass));
	}
	background(bgColor);
}

function updateAndDrawCOM() {
	if (showcom) {    
		var mx = 0;
		var my = 0;
		var mm = 0;
		for (i = 0; i < bodyTable.length; i++){
			mx += bodyTable[i].rx * bodyTable[i].mass;
			my += bodyTable[i].ry * bodyTable[i].mass;
			mm += bodyTable[i].mass;
		}
		fill(comColor);
		ellipse(mx / mm, my / mm, 1);
	}
}

function updateAndDrawKE() {
	if (showke){
		stroke(comColor);
		var ke = 0;
		for (i = 0; i < bodyTable.length; i++){
			ke += bodyTable[i].mass * (bodyTable[i].vx ** 2 + bodyTable[i].vx ** 2) / 2;
			point(frameCount % width, height - (3 * ke));
		}
		ellipse(frameCount % width, height - (3 * ke), 2);
		noStroke();
	}	
}

// function mouseClicked() {
// 	noLoop();
// }