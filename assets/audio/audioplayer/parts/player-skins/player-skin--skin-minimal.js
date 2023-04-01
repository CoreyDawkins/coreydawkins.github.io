'use strict';


window.dzsap_view_player_skinMinimal_drawFrame = function (selfClass, scrubbarProgX) {


  if (selfClass.isPlayerPlaying || selfClass.isCanvasFirstDrawn === false) {


    var ctx_minimal = selfClass.skin_minimal_canvasplay.getContext('2d');

    var ctx_w = selfClass.skin_minimal_canvasplay.width;
    var ctx_h = selfClass.skin_minimal_canvasplay.height;

    var pw = ctx_w / 100;
    var ph = ctx_h / 100;

    if (selfClass._actualPlayer) {

    }
    scrubbarProgX = Math.PI * 2 * (selfClass.timeModel.getVisualCurrentTime() / selfClass.timeModel.getVisualTotalTime());

    if (isNaN(scrubbarProgX)) {
      scrubbarProgX = 0;
    }
    if (scrubbarProgX > Math.PI * 2) {
      scrubbarProgX = Math.PI * 2;
    }

    ctx_minimal.clearRect(0, 0, ctx_w, ctx_h);


    // -- use design_wave_color_progress for drawing skin-minimal circle


    ctx_minimal.beginPath();
    ctx_minimal.arc((50 * pw), (50 * ph), (40 * pw), 0, Math.PI * 2, false);
    ctx_minimal.fillStyle = "rgba(0,0,0,0.1)";
    ctx_minimal.fill();


    ctx_minimal.beginPath();
    ctx_minimal.arc((50 * pw), (50 * ph), (34 * pw), 0, scrubbarProgX, false);
    ctx_minimal.lineWidth = (10 * pw);
    ctx_minimal.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx_minimal.stroke();


    selfClass.isCanvasFirstDrawn = true;


  }
}
