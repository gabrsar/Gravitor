console.log("DRAWER.JS");

SHOW_FORCE = true;
SHOW_VELOCITY = true;
DRAW_RATE = 1;
ZOOM = 1;

function setup() {
  frameRate(3000);
  let width = window.innerWidth;
  let height = window.innerHeight;
  createCanvas(width, height, WEBGL);
  blendMode(MULTIPLY);
  angleMode(DEGREES);

  let n = 500;

  for (let i = 0; i < n; i++) {
    universe[i] = Thing.makeRandomThing();
  }
}

function mouseWheel(event) {
  ZOOM = ZOOM + ZOOM / -event.delta;
}

function draw() {
  scale(ZOOM);
  smooth();

  if (frameCount % 50 === 0) {
    $("#fps").text(frameRate().toFixed(0) + "FPS");
  }

  orbitControl();
  if (running) {
    tick();
  }

  background(0);

  let size = universe.length;

  let x = parseInt($("#x").val());
  let y = parseInt($("#y").val());
  let z = parseInt($("#z").val());

  translate(100, 100, 200);

  for (let k = 0; k < size; k++) {
    drawThing(universe[k]);
  }
}

function drawXYZPlanes() {
  let size = 400;
  let step = 20;

  let ss = size / 2;

  push();
  translate(-ss / 2, -ss / 2, 0);

  push();

  stroke(100, 0, 0);

  translate(-ss, 0, 0);

  for (let x = -ss; x <= ss; x += step) {
    beginShape();
    vertex(0, 0, 0);
    vertex(0, size, 0);
    endShape();
    translate(step, 0, 0);
  }
  pop();
  push();
  stroke(0, 100, 0);
  rotateZ(90);

  translate(0, -ss, 0);
  for (let y = -ss; y <= ss; y += step) {
    beginShape();
    vertex(0, 0, 0);
    vertex(0, size, 0);
    endShape();
    translate(step, 0, 0);
  }
  pop();
  pop();
}

function draw0XZY(v) {
  push();
  beginShape();
  vertex(0, 0, 0);
  vertex(v.x, v.y, v.z);
  endShape();
  pop();
}

function drawThing(t) {
  push();
  let d =  t.r;
  translate(t.pos.x, t.pos.y, t.pos.z);
  strokeWeight(0);
  fill(t.color);
  sphere(d);
  drawMetainformation(t);
  pop();
}

function drawMetainformation(t) {

  push();

  noFill();
  strokeWeight(Math.log(t.mass));

  if (SHOW_FORCE) {
    stroke(255, 255, 0, 200);
    let f = t.f.copy().mult(10);
    draw0XZY(f);
  }

  if (SHOW_VELOCITY) {
    stroke(255, 0, 255, 50);
    draw0XZY(t.vel.copy().mult(1));
  }

  pop();
}

function getRandomColor() {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
}
