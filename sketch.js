function updateResolution() {
  DELTA_TIME = parseFloat(parseInt($("#resolution").val()) / 1000);
}

function updateShowForce() {
  SHOW_FORCE = $("#showForce").prop('checked');
}

function updateShowVelocity() {
  SHOW_VELOCITY = $("#showVelocity").prop('checked');
}

function updateDrawRate() {
  DRAW_RATE = $("#drawRate").val();
}

function toggleSimulation() {
  running = !running;
  $("#playpause").text(running ? 'Pause' : 'Run');

}

function updateBodiesList(universe) {

  universe.sort(function (a, b) {
    return a.mass - b.mass;
  });

  universe.each(function (i) {

  })

}
