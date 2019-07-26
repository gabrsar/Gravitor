console.log("SKETCH.JS");

function updateResolution() {
  DELTA_TIME = parseFloat(parseInt($("#resolution").val()) / 10);
}

function updateShowForce() {
  SHOW_FORCE = $("#showForce").prop('checked');
}

function updateShowVelocity() {
  SHOW_VELOCITY = $("#showVelocity").prop('checked');
}

function invertTime() {
  DELTA_TIME = -DELTA_TIME;
}

function updateDrawRate() {
  drawRate = $("#drawRate").val();
}

function toggleSimulation() {
  running = !running;
}

function updateBodiesList(universe) {

  universe.sort(function (a, b) {
    return a.mass - b.mass;
  });

  universe.each(function(i){

  })

}
