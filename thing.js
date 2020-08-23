console.log("THING.JS");
THING_COUNT = 0;

function str0padded(str, size) {

  const slen = str.length;
  const zerosNedded = size - slen;
  let pad = "";
  for (let i = 0; i < zerosNedded; i++) {
    pad += '0';
  }
  return `${str}${pad}`;
}


class Thing {
  constructor(
      name,
      mass,
      pos = createVector(),
      vel = createVector(),
      f = createVector(),
      color = getRandomColor()
  ) {

    this.name = name || '2020-' + str0padded(THING_COUNT++ + '', 5);
    this.mass = mass;
    this.pos = pos;
    this.vel = vel;
    this.f = f;
    this.r = Math.pow(mass, 1 / 3);
    this.color = color;
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

  // static makeRandomThing() {
  //   let massMultiplier = Math.random() * MASS_DISTRIBUTION;
  //   let mass = Math.pow(Math.random() * MASS_DISTRIBUTION, massMultiplier);
  //
  //   let px = (Math.random() - 0.5) * X_SPREAD;
  //   let py = (Math.random() - 0.5) * Y_SPREAD;
  //   let pz = (Math.random() - 0.5) * Z_SPREAD;
  //   let pos = createVector(px, py, pz);
  //
  //   let vx = -pz/10;// Math.random() * V_SPREAD;
  //   let vy = pz/10;// Math.random() * V_SPREAD;
  //   let vz = -py/10;// Math.random() * V_SPREAD;
  //   let vel = createVector(vx, vy, vz);
  //   let color = getRandomColor();
  //
  //   return new Thing(mass, pos, vel, createVector(), color, history)
  // }

  static makeRandomThing() {
    let massMultiplier = Math.random() * MASS_DISTRIBUTION;
    let mass = Math.pow(Math.random() * MASS_DISTRIBUTION, massMultiplier);

    let px = (Math.random() - 0.5) * X_SPREAD;
    let py = (Math.random() - 0.5) * Y_SPREAD;
    let pz = (Math.random() - 0.5) * Z_SPREAD;
    let pos = createVector(px, py, pz);

    let vx = (Math.random() - 0.5) * V_SPREAD;
    let vy = (Math.random() - 0.5) * V_SPREAD;
    let vz = (Math.random() - 0.5) * V_SPREAD;
    let vel = createVector(vx, vy, vz);
    let color = getRandomColor();

    return new Thing(null, mass, pos, vel, createVector(), color)
  }

}

