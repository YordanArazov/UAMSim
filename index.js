/** The Circle class and its attributes and methods. */
class Circle {
    constructor(x, y, radius, gridW, ax=0, vx=0) {
        this.x = x;
		this.y = y;
        this.r = radius;
        this.ax = ax;
        this.vx = vx;
		this.halfGridW = gridW/2;
		this.gridX = this.x - this.halfGridW;
    }

    move(dt) {
        this.vx += this.ax * dt;
        this.x += this.vx * dt;
		this.gridX = this.x - this.halfGridW;
    }

    draw() {
        //draw a circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
        ctx.closePath();
		ctx.fillStyle = 'black';
        ctx.fill();
		ctx.font = "12px Arial";
		ctx.textAlign = "center";
		ctx.fillText(
			'A(' +((this.x-this.halfGridW)/37.7952755906).toFixed(2).toString() +')',
			this.x,
			this.y - this.r*2,
		);
		//draw displacement vector
		const color = 'blue';
		drawVector({x:this.halfGridW,y:this.y}, {x:this.x, y:this.y}, 3, color, 
		10, -Math.sign(this.x-this.halfGridW) * Math.PI * 0.3, -Math.sign(this.x-this.halfGridW) * Math.PI * 0.7);
		ctx.fillStyle = color;
		ctx.font = "12px Arial";
		ctx.textAlign = "center";
		ctx.fillText(
			'x='+ ((this.x-this.halfGridW)/37.7952755906 - 0).toFixed(2).toString() +' cm',
			this.x - (this.x - this.halfGridW)/2,
			this.y + this.r*2,
		);
		//draw velocity vector
		if (this.vx != 0) {
			const color = 'green';
			drawVector(this, {x:this.x+this.vx, y:this.y}, 3, color, 10, -Math.sign(this.vx) * Math.PI * 0.3, -Math.sign(this.vx) * Math.PI * 0.7);
			ctx.fillStyle = color;
			ctx.fillText(
				'v='+ (this.vx/37.7952755906).toFixed(2).toString() +' cm/s',
				this.x + this.vx + Math.sign(this.vx)*this.r*2.5,
				this.y-this.r/2,
			);
		}
		//draw acceleration vector
		if (this.ax != 0) {
			const color = 'red';
			drawVector(this, {x:this.x+this.ax, y:this.y}, 3, color, 10, -Math.sign(this.ax) * Math.PI * 0.3, -Math.sign(this.ax) * Math.PI * 0.7);
			ctx.fillStyle = color;
			ctx.fillText(
				'a='+ (this.ax/37.7952755906).toFixed(2).toString() +' cm/s^2',
				this.x + this.ax + Math.sign(this.ax)*this.r*2.5,
				this.y+this.r/1.5,
			);
		}
    }
	
	distanceTo(o) {
		const dx = this.x - o.x;
		const dy = this.y - o.y;
		const d = Math.sqrt(dx * dx + dy * dy);
		return d;
	}
}

let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let yAxis = c.height * 0.75;

var img = new Image();
img.src = "UAM.svg";

const object = new Circle(c.width/2, yAxis-20, 20, c.width);
const dt = 1/60;
const vxData = {'v, cm/s': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};
const dxData = {'x, cm': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};
const axData = {'a, cm/s^2': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};

let oddFrame = true;

const inputs = {mouse: {x: 0, y: 0, vx: 0}, lclick: false, rclick: false, space: false};
let mouseTimer;
function mouseDown(e) {
	if (e.button==0) {
		inputs.lclick = true;
	} else if (e.button==2)	{
		inputs.rclick = true;
	}
}
function mouseUp(e) {
    if (e.button==0) {
		inputs.lclick = false;
	} else if (e.button==2)	{
		inputs.rclick = false;
	}
}
function onContextMenu(e) {
	e.preventDefault();
}
function onKeyUp(e) {
	switch (e.keyCode) {
		case 32: inputs.space = inputs.space == false ? true : false; break;
	}
}

window.addEventListener('mousemove', (event) => {
	window.clearTimeout(mouseTimer);
	const x = event.pageX - c.offsetLeft;
	const y = event.pageY - c.offsetTop;
	const dx = x - inputs.mouse.x;
	inputs.mouse.vx = dx / dt;
	inputs.mouse.x = x;
	inputs.mouse.y = y;
	mouseTimer = window.setTimeout(function () {inputs.mouse.vx = 0}, 50);
});
c.addEventListener("mousedown", mouseDown);
c.addEventListener("mouseup", mouseUp);
c.addEventListener('contextmenu', onContextMenu);
window.addEventListener('keyup', onKeyUp);

function drawLine(fr, to, w, color) {
	ctx.beginPath();
	ctx.moveTo(fr.x, fr.y);
	ctx.lineTo(to.x, to.y);
	ctx.lineWidth = w;
	ctx.strokeStyle = color;
	ctx.stroke();
}

function drawVector(fr, to, w, color, arrowL, arrowDir1, arrowDir2) {
	drawLine(fr, to, w, color);
	drawLine(to, {x: to.x + arrowL * Math.sin(arrowDir1), y: to.y - arrowL * Math.cos(arrowDir1)}, w, color);
	drawLine(to, {x: to.x + arrowL * Math.sin(arrowDir2), y: to.y - arrowL * Math.cos(arrowDir2)}, w, color);
}

function drawGraph(GRAPH_LEFT, GRAPH_TOP, GRAPH_RIGHT, GRAPH_BOTTOM, color, dataY, largest=0){  
    const GRAPH_HEIGHT = GRAPH_BOTTOM - GRAPH_TOP;   
    const GRAPH_WIDTH = GRAPH_RIGHT - GRAPH_LEFT;
	const dataArrY = Object.values(dataY)[0];
	
	const arrayLen = dataArrY.length;  
	if (largest == 0) {
		for(var i = 0; i < arrayLen; i++){  
			if(Math.abs(dataArrY[i]) > largest){ 
				largest = Math.abs(dataArrY[i]);  
			}  
		}  
	}
    
    // set stroke, fill and font styles
	ctx.strokeStyle = color;
	ctx.fillStyle = color;	
    ctx.font = "16px Arial";  
       
    // draw X and Y axis  
    ctx.beginPath();  
    ctx.moveTo(GRAPH_RIGHT, GRAPH_BOTTOM);    
    ctx.lineTo(GRAPH_RIGHT, GRAPH_TOP);
	ctx.stroke(); 
	ctx.beginPath(); 
	ctx.moveTo(GRAPH_LEFT, GRAPH_TOP + 0.5*GRAPH_HEIGHT);
	ctx.lineTo(GRAPH_RIGHT, GRAPH_TOP + 0.5*GRAPH_HEIGHT); 	
    ctx.stroke();  
       
    // draw reference lines top 
    ctx.strokeStyle = "#BBB";
	ctx.fillText(0, GRAPH_RIGHT + 15, GRAPH_TOP + GRAPH_HEIGHT/2);	
	let lineH = 0;
	for (let i=0; i<4; i++) {
		lineH = GRAPH_HEIGHT/2 * i/4;
		ctx.beginPath();
		ctx.moveTo(GRAPH_LEFT, GRAPH_TOP + lineH);  
		ctx.lineTo(GRAPH_RIGHT, GRAPH_TOP + lineH);
		ctx.stroke();
		ctx.fillText((largest * (1 - i/4)).toFixed(2), GRAPH_RIGHT + 30, GRAPH_TOP + lineH);  
	}
	// draw reference lines bottom
	for (let i=0; i<4; i++) {
		lineH = GRAPH_HEIGHT/2 + GRAPH_HEIGHT/2 * (i+1) /4;
		ctx.beginPath();
		ctx.moveTo(GRAPH_LEFT, GRAPH_TOP + lineH);  
		ctx.lineTo(GRAPH_RIGHT, GRAPH_TOP + lineH);
		ctx.stroke();
		ctx.fillText((-largest * (i+1)/4).toFixed(2), GRAPH_RIGHT + 30, GRAPH_TOP + lineH);  
	}
	
    // draw titles  
	ctx.fillText( 't, s', (GRAPH_LEFT + GRAPH_RIGHT) / 2, GRAPH_BOTTOM + 25);
	ctx.fillText( Object.keys(dataY)[0], GRAPH_RIGHT + 60, (GRAPH_TOP + GRAPH_BOTTOM) / 2);  
  
	//draw graph
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(GRAPH_RIGHT, GRAPH_TOP + GRAPH_HEIGHT / 2 + GRAPH_HEIGHT/2 * dataArrY[arrayLen] / largest);
	for (let i=arrayLen; i>0; i--) {
		ctx.lineTo(GRAPH_RIGHT - GRAPH_WIDTH * 1 / arrayLen * (arrayLen - i), GRAPH_TOP + GRAPH_HEIGHT / 2 - GRAPH_HEIGHT/2 * dataArrY[i] / largest);
		ctx.stroke();
		ctx.moveTo(GRAPH_RIGHT - GRAPH_WIDTH * 1 / arrayLen * (arrayLen - i), GRAPH_TOP + GRAPH_HEIGHT / 2 - GRAPH_HEIGHT/2 * dataArrY[i] / largest); 
	}
}   

/** This function is run with every animation frame and each time clears canvas, 
	updates coordinates of object, and draws object and graphs. */
function animate() {
    ctx.clearRect(0, 0, c.width, c.height);
	//draw grid
	ctx.fillStyle = 'gray';
	drawLine({x: 0, y: yAxis}, {x: c.width, y: yAxis}, 3, 'black');
	const divisionLength = 37.7952755906; 	//1 cm in pixels
	let n = 1;
	drawLine({x: c.width/2, y: yAxis - divisionLength}, {x: c.width/2, y: yAxis + divisionLength}, 3, 'black');
	ctx.fillText(
		0,
		c.width/2,
		yAxis + divisionLength + 20,
	);
	while (n * divisionLength <= c.width / 2) {
		const xPositive = c.width/2 + n*divisionLength;
		const xNegative = c.width/2 - n*divisionLength;
		drawLine({x: xPositive, y: yAxis - divisionLength}, 
		{x: xPositive, y: yAxis + divisionLength}, 1.5, 'gray');
		ctx.fillText(
			n,
			xPositive,
			yAxis + divisionLength + 20,
		);
		
		drawLine({x: xNegative, y: yAxis - divisionLength}, 
		{x: xNegative, y: yAxis + divisionLength}, 1.5, 'gray');
		ctx.fillText(
			-n,
			xNegative,
			yAxis + divisionLength + 20,
		);
		n+=1;
	}
	
	//update object
	if (inputs.space == false) {
		object.move(dt);
		//update graph data every other frame
		if (oddFrame) {
			Object.values(vxData)[0].push((object.vx/37.7952755906).toFixed(2));
			if (Object.values(vxData)[0].length > 20) {
				Object.values(vxData)[0].splice(0, 1);
			}
			Object.values(axData)[0].push((object.ax/37.7952755906).toFixed(2));
			if (Object.values(axData)[0].length > 20) {
				Object.values(axData)[0].splice(0, 1);
			}
			Object.values(dxData)[0].push(((object.x-object.halfGridW)/37.7952755906 - 0).toFixed(2));
			if (Object.values(dxData)[0].length > 20) {
				Object.values(dxData)[0].splice(0, 1);
			}
			oddFrame = false;
		} else {
			oddFrame = true;
		}
	}	
	if (inputs.rclick) {
		if (object.x > inputs.mouse.x) {
			object.ax -= 5;
		} else {
			object.ax += 5;
		}
	}	
	if (inputs.lclick) {	
		if (object.distanceTo(inputs.mouse) < object.r*5) {
			object.x = inputs.mouse.x;
			object.vx = inputs.mouse.vx;
		}
	}
	if (object.x > c.width) {
		object.x -= c.width;
	}	
	if (object.x < 0) {
		object.x += c.width;
	}
	
	//draw object
    object.draw();
	
	//draw graph 
	drawGraph(c.width*0.015, c.width*0.015, c.width*0.12, c.height*0.35, 'red', axData, 20);
	drawGraph(c.width*0.015+c.width*0.25, c.width*0.015, c.width*0.12+c.width*0.25, c.height*0.35, 'green', vxData, 20);
	drawGraph(c.width*0.015+2*c.width*0.25, c.width*0.015, c.width*0.12+2*c.width*0.25, c.height*0.35, 'blue', dxData, 20);
	
	//draw UAM
	ctx.drawImage(img, c.width*0.75, c.height*0.01, c.width*0.2, c.width*0.2);
	
	//instructions
	ctx.fillStyle = 'black';
	ctx.fillText(
		'Hold the Left Mouse Button to catch the Circle',
		c.width * 0.5,
		c.height * 0.45,
	);
	ctx.fillText(
		'Hold the Right Mouse Button to accelerate',
		c.width * 0.5,
		c.height * 0.5,
	);
	ctx.fillText(
		'Press SPACE to pause',
		c.width * 0.5,
		c.height * 0.55,
	);

    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);