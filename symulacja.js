function setup() {
    var size = 800;
	createCanvas(size, size);
	fill(100);
    noStroke();

	class Body {
		constructor(mass, v) {
			this.rx = Math.random() * height;
			this.ry = Math.random() * width;
			this.vx = Math.random() * v;
			this.vy = Math.random() * v;
			this.ax = 0;
			this.ay = 0;
			this.mass = mass;
		}
	}
    
    // generowanie n ciał
	bt = [];
    var i;
    var n = 8;
	for (i = 0; i < n; i++){
		bt.push(new Body(Math.random() * 8, 0));
	}
}

function draw() {
	var G = 0.1;
    
    // obliczanie wypadkowych sił
	var i;
	var j;
	for (i = 0; i < bt.length; i++){
		bt[i].ax = 0;
		bt[i].ay = 0;
		for (j = 0; j < bt.length; j++){
			if (i != j) {
				dx = bt[j].rx - bt[i].rx;
				dy = bt[j].ry - bt[i].ry;
				r = Math.sqrt(dx*dx + dy*dy);
				
                g = G * bt[i].mass * bt[j].mass / r;
                gx = dx * g / r
                gy = dy * g / r
				bt[i].ax += gx / bt[i].mass;
				bt[i].ay += gy / bt[i].mass;
			}
			
        }
    }
    
    // obliczanie przesunięć
	for (i = 0; i < bt.length; i++){
		bt[i].vx += bt[i].ax;
		bt[i].vy += bt[i].ay;
		bt[i].rx += bt[i].vx;
		bt[i].ry += bt[i].vy;
		
		if (bt[i].rx < 0 || bt[i].rx > height)
			bt[i].vx = (-1) * bt[i].vx;
		if (bt[i].ry < 0 || bt[i].ry > height)
			bt[i].vy = (-1) * bt[i].vy;
	}
    
    // rysowanie i liczenie środka masy
	var mx = 0;
    var my = 0;
    var mm = 0;
	for (i = 0; i < bt.length; i++){
        fill(200 + bt[i].mass);
		ellipse(bt[i].rx, bt[i].ry, 2 * Math.sqrt(bt[i].mass));
		mx += bt[i].rx * bt[i].mass;
        my += bt[i].ry * bt[i].mass;
        mm += bt[i].mass;
	}
	fill('rgba(255,0,0, 0.5)');
    ellipse(mx / mm, my / mm, 1);
	fill(100);
	
    background('rgba(255,255,255, 0.05)');
}