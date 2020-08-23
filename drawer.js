let N = 300;
let SHOW_FORCE = false;
let SHOW_VELOCITY = false;
let DRAW_RATE = 1;

let STAR_MASS = 30;
let tpsHistorySize = 10;
let lastTps;

let drawEveryFrames;
let lightSources;

function ini() {
  lastTps = [];
  lightSources = [];
  drawEveryFrames = 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  ini();
  frameRate(Infinity);
  const x = createCanvas(windowWidth, windowHeight, WEBGL);
  x.style('display', 'block');
  angleMode(DEGREES);

  for (let i = 0; i < N; i++) {
    universe[i] = Thing.makeRandomThing();
  }
}

function draw() {
  runSim();

  if (frameCount % DRAW_RATE !== 0) {
    return
  }

  if (frameCount % 10 === 0) {
    $("#fps").text(frameRate().toFixed(0) + " FPS");
    makeBodiesList(universe);

  }

  drawSetup();


  showLightSources(universe);

  background(25);


  let size = universe.length;

  for (let k = 0; k < size; k++) {
    drawThing(universe[k], false);
  }

}

function runSim() {
  if (running) {
    const duration = tick();
    lastTps.push(duration);
    if (lastTps.length >= tpsHistorySize) {
      lastTps.shift();
    }

    const avg = lastTps.reduce((acc, cur) => acc + cur) / lastTps.length;
    const currentTps = (1000 / duration).toFixed(2) + " TPS";
    const avgTps = (1000 / avg).toFixed(2) + " TPS (avg)";
    $("#tps").text(currentTps + " " + avgTps);

  }
}

function drawSetup() {
  orbitControl(1, 1, 0.05);
  smooth();
  debugMode(GRID, 10000, 100);
  // lightFalloff(0.0, 0.0, 1.0);
  // ambientLight(50); // white light


}

function showLightSources(universe) {
  const size = universe.size;
  for (let k = 0; k < size; k++) {
    const uk = universe[k];
    if (uk.mass >= STAR_MASS) {
      pointLight(255, 255, 255, uk.pos);
    }
  }

}

function makeBodiesList(universe) {

  const sortedUniverse = universe.sort((a, b) => (a.mass < b.mass)).slice(0, 10);

  $("#bodiesCount").text(`${universe.length} bodies`);

  for (let i = 0; i < 10; i++) {
    const e = sortedUniverse[i];
    const te = e ? e.name + ' ' + e.mass.toFixed(3) : '';
    $(`#body${i}btn`).attr('value', te);

  }


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

  let d = t.r;
  translate(t.pos.x, t.pos.y, t.pos.z);
  strokeWeight(0);

  fill(t.color);
  if (t.mass >= STAR_MASS) {
    fill(255, 255, 255);
    d = d * 1.5;
  }
  sphere(d);

  drawMetainformation(t);
  pop();
}

function drawMetainformation(t) {
  push();

  noFill();
  strokeWeight(Math.pow(t.mass, 1 / 3));

  if (SHOW_FORCE) {
    stroke(255, 255, 0, 200);
    let f = t.f.copy().mult(50);
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
