class Thing {
  constructor(
    mass,
    pos = createVector(),
    vel = createVector(),
    f = createVector(),
    color = getRandomColor()) {
    this.mass = mass;
    this.pos = pos;
    this.vel = vel;
    this.f = f;
    this.r = Math.pow(mass, 1 / 3);
    this.color = color;
  }

}

function getRandomColor() {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
}

let T = 0;
let universe = [];
let DELTA_TIME = 0.1; //s
let G = 6.67408;
let MASS_DISTRIBUTION = 5;
let X_SPREAD = 900;
let Y_SPREAD = 900;
let Z_SPREAD = 900;
let V_SPREAD = 0.9;
let zoomSpeed = 20;
let zoomF = 100;
let zoom = 1.00;
let running = true;
let logTick = null;

function setup() {

  frameRate(30);

  let width = window.innerWidth;
  let height = window.innerHeight;
  createCanvas(width, height, WEBGL);

  angleMode(DEGREES);

  // let n = 50;
  //
  // for (let i = 0; i < n; i++) {
  //   universe[i] = makeRandomThing();
  // }

  // universe[0] = new Thing(100, createVector(400, 0, 100), createVector(5, 0, 0));
  // universe[1] = new Thing(200, createVector(100, 200, 0, 0), createVector(0, -5, 0));

}

function invertTime() {
  DELTA_TIME = -DELTA_TIME;
}

function draw() {
  smooth();

  if (frameCount % 50 === 0) {
    $("#fps").text(frameRate().toFixed(0) + "FPS");
  }

  orbitControl();
  if (running) {
    tick();
  }

  background(0);

  drawXYZPlanes();

  let size = universe.length;

  let x = parseInt($("#x").val());
  let y = parseInt($("#y").val());
  let z = parseInt($("#z").val());

  drawUniverseCenter();
  drawXYZ(createVector(x, y, z), 2, 255, 50);
  draw0XZY(createVector(x, y, z));

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
  fill(100, 0, 0);
  translate(-ss, 0, 0);

  for (let x = -ss; x <= ss; x += step) {
    cylinder(0.2, size);
    translate(step, 0, 0);
  }
  pop();
  push();
  fill(0, 100, 0);

  translate(0, -ss, 0);
  rotateZ(90);

  for (let y = -ss; y <= ss; y += step) {
    cylinder(0.2, size);
    translate(step, 0, 0);
  }
  pop();

}

/////////////////////////////

function makeRandomThing() {
  let massMultiplier = Math.random() * MASS_DISTRIBUTION;
  let mass = Math.pow(Math.random() * MASS_DISTRIBUTION, massMultiplier);

  let px = Math.random() * X_SPREAD;
  let py = Math.random() * Y_SPREAD;
  let pz = Math.random() * Z_SPREAD;
  let pos = createVector(px, py, pz);

  let vx = Math.random() * V_SPREAD;
  let vy = Math.random() * V_SPREAD;
  let vz = Math.random() * V_SPREAD;
  let vel = createVector(vx, vy, vz);

  return new Thing(mass, pos, vel)
}

function drawXYZ(vector, thick = 2, intensity = 255, alpha = 255) {
  push();

  push();
  rotateZ(-90);
  fill(intensity, 0, 0, 255);
  draw3dArrow(vector.x, thick);
  pop();

  push();
  rotateX(0);
  fill(0, intensity, 0, 255);
  draw3dArrow(vector.y, thick);
  pop();

  push();
  rotateX(90);
  fill(0, 0, intensity, 255);
  draw3dArrow(vector.z, thick);
  pop();

  pop();

}

function drawUniverseCenter() {
  drawXYZ(createVector(200, 200, 200), 0.5, 100, 50);
}

function toDeg(i) {
  return i * 180 / Math.PI;
}

function draw0XZY(v) {

  let xx = v.x * v.x;
  let yy = v.y * v.y;
  let zz = v.z * v.z;

  push();
  fill(255, 0, 255, 155);

  let vx = v.x !== 0;
  let vy = v.y !== 0;
  let vz = v.z !== 0;

  let size = Math.sqrt(xx + yy + zz);

  let signX = sign(v.x);
  let signY = sign(v.y);
  let signZ = sign(v.z);

  let angleXY = null;
  let angleYZ = null;
  let angleXZ = null;

  push();
  translate(v.x, v.y, v.z);

  sphere(5);
  fill(0, 0, 0, 255);
  sphere(1);
  pop();

  fill(255, 0, 255, 10);
  sphere(size, 64, 64);

  fill(255, 0, 255, 100);

  if (vx || vy) {
    let hXY = Math.sqrt(xx + yy);
    let cosXY = v.y / hXY;
    angleXY = -toDeg(Math.acos(cosXY)) * signX;
    rotateZ(angleXY);
  }

  if (vy || vz) {
    let hYZ = Math.sqrt(yy + zz);
    let sinYZ = v.z / hYZ;
    angleYZ = toDeg(Math.asin(sinYZ));
    rotateX(angleYZ);
  }

  let debug = {
    az: az,
    x: v.x.toFixed(2),
    y: v.y.toFixed(2),
    z: v.z.toFixed(2),
    angleYZ: angleYZ ? angleYZ.toFixed(2) : 'NAN',
    angleXY: angleXY ? angleXY.toFixed(2) : 'NAN',
    angleXZ: angleXZ ? angleXZ.toFixed(2) : 'NAN',
    size: size.toFixed(2)
  };
  $("#debug").text(JSON.stringify(debug));
  draw3dArrow(size);

  pop();
}

// function draw0XZY(v) {
//
//   push();
//   fill(255, 0, 255, 155);
//
//
//
//   let xx = v.x * v.x;
//   let yy = v.y * v.y;
//   let zz = v.z * v.z;
//
//   push();
//   translate(v.x,v.y,v.z);
//   box(10);
//   pop();
//
//   let size = Math.sqrt(xx + yy + zz);
//
//   fill(255, 0, 255, 50);
//   sphere(size, 64, 64);
//
//   fill(255, 0, 255, 100);
//
//   let debug = {x: ax, y: ay, z: az};
//
//   $("#debug").text(JSON.stringify(debug));
//   draw3dArrow(size);
//   box(10);
//
//   pop();
// }

function sign(i) {
  return i >= 0 ? 1 : -1;
}

function draw3dArrow(size, thick = 2) {

  let absSize = Math.abs(size);
  let sizeSign = Math.sign(size);
  let bodySize = size * 0.7;
  let coneSize = size * 0.3;
  if (absSize > 100) {
    coneSize = (sizeSign * 30);
    bodySize = size - coneSize;
  }

  push();
  translate(0, bodySize / 2);
  strokeWeight(0);
  cylinder(thick, bodySize);
  let tr = bodySize / 2 + coneSize / 2;
  translate(5, tr / 2, 0);
  box(5);
  translate(-5, tr / 2, 0);
  cone(thick * 4, coneSize);
  pop();
}

function tick() {
  T += DELTA_TIME;

  let t = T / 10;
  $("#x").val(Math.cos(t) * 200);
  $("#y").val(Math.sin(t) * 200);

  $("#time").text((T * Math.abs(DELTA_TIME)).toFixed(4) + "s");

  let size = universe.length;
  let newUniverse = Array(size);
  for (let i = 0; i < size; i++) {

    let a = universe[i];

    let aPos = a.pos.copy();
    let aVel = a.vel.copy();

    let force = createVector(0, 0, 0);
    for (let j = 0; j < size; j++) {

      if (i === j) {
        continue;
      }
      let b = universe[j];

      let vd = a.pos.copy().sub(b.pos);
      let x = vd.x;
      let y = vd.y;
      let z = vd.z;
      let minDist = a.r + b.r;
      let realDist = Math.sqrt(x * x + y * y + z * z);
      let distance = Math.max(minDist, realDist);

      let abForce = -geForce(a.mass, b.mass, distance);
      let nvd = vd.normalize().mult(abForce);

      force.add(nvd);
    }

    let aceleration = force.div(a.mass);

    let dV = aceleration.mult(DELTA_TIME);
    let newVel = aVel.copy().add(dV);

    let dS = aVel.copy().mult(DELTA_TIME);
    let newPos = aPos.copy().add(dS);

    newUniverse[i] = new Thing(a.mass, newPos, newVel, force, a.color);

  }

  for (let k = 0; k < size; k++) {
    universe[k] = newUniverse[k];
  }

  if (T % 50 === 0) {
    console.clear();
  }

  if (logTick) {

    console.log(logTick);
  }
}

function toggleSimulation() {
  running = !running;
}

function drawMetainformation(t) {

  push();
  fill(255);
  stroke(255, 255, 0);

  let f = t.f.copy().mult(1000000);
  draw0XZY(f);
  drawXYZ(f);

  pop();
}

function drawThing(t) {
  push();
  let d = 2 * t.r;
  translate(t.pos.x, t.pos.y, t.pos.z);
  strokeWeight(0);
  fill(t.color);
  sphere(d);
  drawMetainformation(t);
  pop();
}

function geForce(massA, massB, distance) {
  return (G * massA * massB) / (distance * distance);
}

