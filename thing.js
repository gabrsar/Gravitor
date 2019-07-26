console.log("THING.JS");
class Thing {

  constructor(
    mass,
    pos = createVector(),
    vel = createVector(),
    f = createVector(),
    color = getRandomColor(),
    history = []) {

    this.name = `Thing${Math.floor(Math.random() * 1000)}`;
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

  static makeRandomThing() {
    let massMultiplier = Math.random() * MASS_DISTRIBUTION;
    let mass = Math.pow(Math.random() * MASS_DISTRIBUTION, massMultiplier);

    let px = (Math.random() - 0.5) * X_SPREAD;
    let py = (Math.random() - 0.5) * Y_SPREAD;
    let pz = (Math.random() - 0.5) * Z_SPREAD;
    let pos = createVector(px, py, pz);

    let vx = -pz/10;// Math.random() * V_SPREAD;
    let vy = pz/10;// Math.random() * V_SPREAD;
    let vz = -py/20;// Math.random() * V_SPREAD;
    let vel = createVector(vx, vy, vz);
    let color = getRandomColor();
    let history = [];

    return new Thing(mass, pos, vel, createVector(), color, history)
  }
}

