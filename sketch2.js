var N = 64;
var px_size = 8;
var frame_rate = 32;
var dt = 1/frame_rate;
var diff=.02;
// var visc;
var stopwatch;

var vx;
var vy;
var vx0;
var vy0;
var dens;
var dens0;

function idx(i,j) {return i + N*j; }

function setup() {
    createCanvas(N*px_size, N*px_size);
    noStroke();
    frameRate(frame_rate);

    vx = empty_array(N*N);
    vy = empty_array(N*N);
    vx0 = empty_array(N*N);
    vy0 = empty_array(N*N);
    dens = empty_array(N*N);
    dens0 = empty_array(N*N);

    stopwatch = performance.now();
}

function draw() {

    //// density solver
    let temp;
    // add_surce(dens, s)
    // temp=dens;dens=dens0;dens0=temp;

    diffuse(dens, dens0);
    temp=dens;dens=dens0;dens0=temp;
    advect(dens, dens0, vx0, vy0, 0);
    temp=dens;dens=dens0;dens0=temp;
    dim(dens0);

    //// velocity solver
    // add_surce(vx0, s);
    // add_surce(vx0, s);
    // temp=vx;vx=vx0;vx0=temp;
    // temp=vy;vy=vy0;vy0=temp;
    diffuse(vx, vx0, 1);
    diffuse(vy, vy0, 2);
    project(vx, vy);
    temp=vx;vx=vx0;vx0=temp;
    temp=vy;vy=vy0;vy0=temp;
    advect(vx, vx0, vx0, vy0, 1);
    advect(vy, vy0, vx0, vy0, 2);
    project(vx, vy);
    temp=vx;vx=vx0;vx0=temp;
    temp=vy;vy=vy0;vy0=temp;

    display_array(dens0);

    if(frameCount % 100 == 0){
        console.log(frameCount);
        console.log('fps: ' + (100000/(performance.now()-stopwatch)));
        stopwatch = performance.now();
    }
}

function mouseDragged(event) {
    let x = Math.floor(mouseX/px_size);
    let y = Math.floor(mouseY/px_size);
    if (x<N && y<N) {
        dens0[idx(x,y)] += 5000;
        dx = mouseX - pmouseX;
        dy = mouseY - pmouseY;
        vx0[idx(x,y)] += dx/1;
        vy0[idx(x,y)] += dy/1;
    }
}

function display_array(x, k=1){
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            fill(k * Math.floor(x[idx(i,j)]));
            rect(px_size*i, px_size*j, px_size, px_size);
        }
    }
}

