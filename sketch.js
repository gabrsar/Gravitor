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
let history = [];
let dt = 0.001; //s
let G = 5;
let MASS_DISTRIBUTION = 5;
let X_SPREAD = 900;
let Y_SPREAD = 900;
let Z_SPREAD = 900;
let V_SPREAD = 0.9;
let zoomSpeed = 20;
let zoomF = 100;
let zoom = 1.00;

function setup() {

  frameRate(120);

  let width = window.innerWidth;
  let height = window.innerHeight;
  createCanvas(width, height, WEBGL);

  // let n = 50;
  //
  // for (let i = 0; i < n; i++) {
  //   universe[i] = makeRandomThing();
  // }

  universe[0] = new Thing(100, createVector(0, 100, 0), createVector(0, 0, 0));
  universe[1] = new Thing(500, createVector(200, 200, 0),
    createVector(0, 0, 0));
  // universe[2] = new Thing(1000, createVector(300, 0, 300),createVector(0, 0, 0));

}

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

function draw() {
  tick();
}

function tick() {
  T++;




  background(0);
  pointLight(255, 255, 255, mouseX, mouseY, mouseX);
  specularMaterial(250, 0, 0);

  fill(200);







  push();
  stroke(255);
  fill(255);
  strokeWeight(10);
  line(-5, -5, 5, 5);
  pop();

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

    let dV = aceleration.mult(dt);
    let newVel = aVel.copy().add(dV);

    let dS = aVel.copy().mult(dt);
    let newPos = aPos.copy().add(dS);

    newUniverse[i] = new Thing(a.mass, newPos, newVel, force, a.color);

  }

  for (let k = 0; k < size; k++) {
    let tk = newUniverse[k];
    universe[k] = tk;
    drawThing(tk);
  }

}

function drawMetainformation(t) {

  let centerX = 0;
  let centerY = 0;
  let centerZ = 0;

  push();
  fill(255);
  stroke(255, 0, 0);

  let v = t.vel;
  beginShape(LINES);
  vertex(centerX, centerY, centerZ);
  vertex(centerX + v.x * zoomSpeed, centerY + v.y * zoomSpeed,
    centerZ + v.z * zoomSpeed);
  endShape();

  let f = t.f;
  let fSize = Math.sqrt(f.x * f.x + f.y * f.y + f.z * f.z);
  let r = t.r;

  line(
    centerX,
    centerY,
    centerZ,
    centerX + f.x * zoomF,
    centerY + f.y * zoomF,
    centerZ + f.z * zoomF
  );
  fill(255, 0, 0);

  let fZoom = 5000000;
  let fLenght = fSize * fZoom;
  translate(0, fLenght/2);

  let sr = r/2;

  // push();
  // fill(255,0,0);
  // rotateX(90);
  // cylinder(sr, f.x*fZoom);
  // pop();
  //
  // push();
  // fill(0,255,0);
  // rotateY(90);
  // cylinder(sr, f.y*fZoom);
  // pop();
  //
  // push();
  // fill(0,0,255);
  // rotateZ(90);
  // cylinder(sr, f.z*fZoom);
  //
  // pop();



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
