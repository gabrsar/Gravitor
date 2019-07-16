class Thing {
  constructor(
    mass,
    pos = createVector(),
    vel = createVector(),
    f = createVector(),
    color = getRandomColor(),
    history = []) {

    this.name = `Thing${Math.floor(Math.random()*1000)}`;
    this.mass = mass;
    this.pos = pos;
    this.vel = vel;
    this.f = f;
    this.r = Math.pow(mass, 1 / 3);
    this.color = color;
    this.history = history;
  }

  consume(o) {

    this.color = (this.mass > o.mass) ? this.color : o.color;
    let t = this;

    let totalMass = t.mass + o.mass;
    let tMomentumV = t.vel.mult(t.mass);
    let oMomentumV = o.vel.mult(o.mass);
    let finalMomentumV = tMomentumV.add(oMomentumV);
    let finalVelocity = finalMomentumV.div(totalMass);

    this.mass = totalMass;
    this.vel = finalVelocity;
    this.r = Math.pow(this.mass, 1 / 3);

  }

}

function getRandomColor() {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
}

let cX = 0;
let cY = 0;
let cZ = 0;
let HISTORY_SIZE = 10;
let T = 0;
let universe = [];
let merges = [];
let DELTA_TIME = 0.1; //s
let G = 6.67408 * 10;
let MASS_DISTRIBUTION = 4;
let X_SPREAD = 400;
let Y_SPREAD = 400;
let Z_SPREAD = 400;
let V_SPREAD = 0.9;
let zoomSpeed = 20;
let zoomF = 100;
let zoom = 1.00;
let running = false;
let logTick = null;

function setup() {
  frameRate(30);
  let width = window.innerWidth;
  let height = window.innerHeight;
  createCanvas(width, height, WEBGL);
  blendMode(MULTIPLY);
  angleMode(DEGREES);

  let n = 1;

  for (let i = 0; i < n; i++) {
    universe[i] = makeRandomThing();
  }

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

/////////////////////////////

function makeRandomThing() {
  let massMultiplier = Math.random() * MASS_DISTRIBUTION;
  let mass = Math.pow(Math.random() * MASS_DISTRIBUTION, massMultiplier);

  let px = (Math.random() - 0.5) * X_SPREAD;
  let py = (Math.random() - 0.5) * Y_SPREAD;
  let pz = (Math.random() - 0.5) * Z_SPREAD;
  let pos = createVector(px, py, pz);

  let vx = Math.random() * V_SPREAD;
  let vy = Math.random() * V_SPREAD;
  let vz = Math.random() * V_SPREAD;
  let vel = createVector(vx, vy, vz);
  let color = getRandomColor();
  let history = [];

  return new Thing(mass, pos, vel, createVector(), color, history)
}

function draw0XZY(v) {
  push();
  beginShape();
  vertex(0, 0, 0);
  vertex(v.x, v.y, v.z);
  endShape();
  pop();
}

function sign(i) {
  return i >= 0 ? 1 : -1;
}

function tick() {
  console.log(`universe size=${universe.length}`);
  T += DELTA_TIME;

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

      if (realDist < minDist) {
        merges.push([i, j]);
      }

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

    let lastN;

    let ssInterval = 1 / DELTA_TIME;

    if (frameCount % 2 == 0 && running) {
      a.history.push(a.pos);
    }

    if (a.history.length > HISTORY_SIZE) {
      lastN = a.history.slice(1);
    } else {
      lastN = a.history;
    }

    newUniverse[i] = new Thing(a.mass, newPos, newVel, force, a.color, lastN);

  }

  merges.forEach(merge => {
    let a = newUniverse[merge[0]];
    let b = newUniverse[merge[1]];

    if (a && b) {
      a.consume(b);
      newUniverse[merge[1]] = null;
      console.log(`${merge[0]} colliding with ${merge[1]}`);
    } else {
      console.log(`${merge[0]} would collide with ${merge[1]}, but last was already merged.`);
    }
  });

  merges = [];

  universe = [];
  for (let k = 0; k < size; k++) {
    let t = newUniverse[k];
    if (t) {
      universe.push(t);
    }
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
  stroke(255, 255, 0, 200);

  noFill();
  strokeWeight(Math.log(t.mass));

  let f = t.f.copy().mult(100);
  draw0XZY(f);

  stroke(255, 0, 255, 50);
  draw0XZY(t.vel.copy().mult(5));

  pop();
}

function drawThing(t) {
  push();
  let d = 2 * t.r;
  translate(t.pos.x, t.pos.y, t.pos.z);
  strokeWeight(0);
  fill(t.color);
  drawHistory(t);
  sphere(d);
  drawMetainformation(t);
  pop();
}

function drawHistoryX(t) {
  let c = t.color;
  t.history.forEach((h, i) => {

    push();
    translate(h.copy().sub(t.pos));
    fill(c[0], c[1], c[2], 10);
    let d = 2 * t.r;

    sphere(d / 5);
    pop();
  });
}
//
// function drawHistory(t) {
//   beginShape();
//   t.history.forEach((h, i) => {
//
//     console.log(`${t.name} - ${h}`);
//     vertex(h);
//   });
//   endShape();
// }

function geForce(massA, massB, distance) {
  return (G * massA * massB) / (distance * distance);
}

