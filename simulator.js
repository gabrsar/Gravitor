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

function groupSorter(a, b) {
  if (a.id === b.id) {
    return 0;
  } else if (a.id < b.id) {
    return -1;
  } else {
    return 1
  }
}

function geForce(massA, massB, distance) {
  return (G * massA * massB) / (distance * distance);
}

/**
 *
 *
 * a cada tick,
 * 1 - criar grupos por coordenada, colocando todas as particulas dentro dos grupos respectivos
 * 2 - para cada grupo:
 *    1 - obter os grupos vizinhos
 *    2 - para cada particula
 *      1 - o grupo e os grupos vizinhos CONJUNTO LOCAL
 *      2 - calculo o conjunto local
 *      3 - calculo para o resultando dos outros grupos.
 *
 * @returns {number}
 */


function tick() {
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

function tick2() {
  const groupedUniverse = universeBreaker(universe);

  Object.
  Object.entries(groupedUniverse).forEach(([groupId, group]) => {
    const coord = groupId.split(':').map((c) => parseInt(c));
    const neighborhoods = getNeighborhoods(groupedUniverse, ...coord);


    const outros =


    // FINISH HERE. Use tick() probably will need to modify it to use flatN + groupedUniverse.resultant

  })

}


function getNeighborhoods(groups, x, y, z) {
  const neighborhoods = [];
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      for (let k = z - 1; k <= z + 1; k++) {
        const groupId = `${i}:${j}:${k}`;
        neighborhoods.push(groups[groupId]);
      }
    }
  }
  return neighborhoods.sort(groupSorter);
}


function getNeighborhoods(groups, x, y, z) {
  const neighborhoods = [];
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      for (let k = z - 1; k <= z + 1; k++) {
        const groupId = `${i}:${j}:${k}`;
        neighborhoods.push(groups[groupId]);
      }
    }
  }
  return neighborhoods;
}


function universeBreaker(universe) {

  //TODO: use dynamic breaks based on the universe size && particles numbers

  let maxX, maxY, maxZ;
  let minX, minY, minZ;

  const start = universe[0].pos;
  minX = maxX = start.x;
  minY = maxY = start.y;
  minZ = maxZ = start.z;

  universe.forEach((p) => {
    const pos = p.pos;
    if (minX < pos.x) {
      minX = pos.x;
    }
    if (minY < pos.y) {
      minY = pos.y;
    }
    if (minZ < pos.z) {
      minZ = pos.z;
    }

    if (maxX > pos.x) {
      maxX = pos.x;
    }
    if (maxY > pos.y) {
      maxY = pos.y;
    }
    if (maxZ > pos.z) {
      maxZ = pos.z;
    }
  });

  const n = 10;

  const dx = (maxX - minX) / n;
  const dy = (maxY - minY) / n;
  const dz = (maxZ - minZ) / n;

  const groups = {};

  universe.forEach((p) => {
    const pos = p.pos;

    const gX = Math.floor(pos.x / dx);
    const gY = Math.floor(pos.y / dy);
    const gZ = Math.floor(pos.z / dz);

    const gId = `${gX}:${gY}:${gZ}`;

    let group = groups[gId];

    if (!group) {
      group = new Group(gId);
      groups[gId] = group;
    }

    group.push(p);
  });
  return groups;
}

class Group {
  constructor(id) {
    this.id = id;
    this.particles = [];
    this.resultant = null;
  }

  push(particle) {
    this.particles.push(particle);
  }

  getResultant() {
    if (this.resultant) {
      return this.resultant;
    }

    let totalMass = 0;
    let acc = createVector(0, 0, 0);

    this.particles.forEach((p) => {
      acc.add(p.pos.copy().mult(p.mass));
      totalMass += p.mass;
    });

    acc.div(totalMass);
    this.resultant = acc;
    return acc;
  }
}