console.log("SIMULATOR.JS");
let cY = 0;
let cZ = 0;
let T = 0;
let universe = [];
let merges = [];
let DELTA_TIME = 0.1;//s
let G = 6.67408 * 10;
let MASS_DISTRIBUTION = 2;
let X_SPREAD = 400;
let Y_SPREAD = 400;
let Z_SPREAD = 400;
let V_SPREAD = 10;
let running = false;

function geForce(massA, massB, distance) {
  return (G * massA * massB) / (distance * distance);
}

function tick(dynamicTime) {
  const start = new Date();
  T += DELTA_TIME;

  $("#time").text((T * Math.abs(DELTA_TIME)).toFixed(3) + "s");

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
      let minDist = a.r + b.r;
      let realDist = a.pos.dist(b.pos);

      if (realDist < minDist) {
        merges.push([i, j]);
      }

      let distance = Math.max(minDist, realDist);

      let abForce = -geForce(a.mass, b.mass, distance);
      let nvd = vd.normalize().mult(abForce);

      force.add(nvd);
    }

    let acceleration = force.div(a.mass);

    let dV = acceleration.mult(DELTA_TIME);
    let newVel = aVel.copy().add(dV);

    let dS = aVel.copy().mult(DELTA_TIME);
    let newPos = aPos.copy().add(dS);

    newUniverse[i] = new Thing(a.name, a.mass, newPos, newVel, force, a.color);
  }

  let updateBodiesList = false;

  merges.forEach(merge => {
    let a = newUniverse[merge[0]];
    let b = newUniverse[merge[1]];

    if (a && b) {
      a.consume(b);
      newUniverse[merge[1]] = null;
      console.log(`${merge[0]} colliding with ${merge[1]}`);
      updateBodiesList = true;
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

  // updateBodiesList([...universe]);
  const finish = new Date();
  return finish - start;
}
