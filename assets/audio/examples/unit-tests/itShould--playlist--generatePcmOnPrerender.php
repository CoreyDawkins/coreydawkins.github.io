<?php
include_once('../../inc/php/publisher.php');
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Audio Player Preview</title>
  <link href="../../libs/bootstrap/bootstrap.min.css" rel="stylesheet">
  <link rel='stylesheet' type="text/css" href="../../style/style.css"/>
  <script src="../../libs/jquery/jquery.js" type="text/javascript"></script>
  <link rel='stylesheet' type="text/css" href="../../audioplayer/audioplayer.css"/>
  <link href='http://fonts.googleapis.com/css?family=Open+Sans:300,400,600' rel='stylesheet' type='text/css'>
</head>
<body>
<div class="content-wrapper">
  <div class="con-maindemo" id="a-demo">
    <div class="container">
      <div class="row">
        <div class="col-md-12">

          <div id="ag1" class="audiogallery skin-wave auto-init" style=" " data-options='{
"design_menu_show_player_state_button": "on"
}'>
            <div class="items">
              <?php

              $playerId = 'ap3';
              $source = '../../sounds/song.mp3';
              DZSAP_Publisher::view_generatePlayer(array(
                'id' => $playerId,
                'source' => $source,
                'thumbUri' => '../../img/adg3.jpg',
                'skin' => 'skin-wave',
                'php_handler_url' => '../../inc/php/publisher.php',
                'isPlayInFooterPlayer' => true,
                'artistName' => 'Mick Jagger - Revenge',
                'songName' => '<a href="#">Buy now!</a>',
              ));
              ?>
              <?php

              $playerId = 'ap4';
              $source = '../../sounds/steph1.mp3';
              DZSAP_Publisher::view_generatePlayer(array(
                'id' => $playerId,
                'source' => $source,
                'thumbUri' => '../../img/adg3.jpg',
                'skin' => 'skin-wave',
                'php_handler_url' => '../../inc/php/publisher.php',
                'isPlayInFooterPlayer' => true,
                'artistName' => 'Mick Jagger - Revenge2',
                'songName' => '<a href="#">Buy now!</a>',
              ));
              ?>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="con-footer">
    <div class="container">
      <div class="row">
        <div class="span6">
          &copy; copyright <a href="http://bit.ly/nM4R6u">ZoomIt</a> 2013

        </div>
        <div class="span6" style="text-align: right">

        </div>
      </div>
    </div>
  </div>

</div>

<div class="dzsap-sticktobottom-placeholder dzsap-sticktobottom-placeholder-for-skin-wave"></div>
<section class="dzsap-sticktobottom  dzsap-sticktobottom-for-skin-wave">
  <div class="dzs-container">
    <style
      class="player-custom-style"> body .audioplayer.skin-wave.playerid-34528259:not(.a) .player-but .the-icon-bg, body .audioplayer.skin-wave.playerid-34528259:not(.a) .playbtn .the-icon-bg, body .audioplayer.skin-wave.playerid-34528259:not(.a) .pausebtn .the-icon-bg, body .audioplayer.skin-wave.playerid-34528259:not(.a) .ap-controls .scrubbar .scrubBox-hover, body .audioplayer.skin-wave.playerid-34528259:not(.a) .volume_active {
        background-color: #111111;
        border-color: #111111;
      } </style>
    <div
      class="audioplayer-tobe playerid-34528259 ap_idx_32_2 is-single-player apconfig-footer-player button-aspect-noir button-aspect-noir--filled  skin-wave  dzsap_footer"
      style=" width: 100%;" id="dzsap_footer" data-playerid="dzs_footer" data-sanitized_source="fake" data-type="fake"
      data-source="fake" data-playfrom="off">
      <div class="meta-artist track-meta-for-dzsap"><span class="the-artist first-line"></span><span
          class="the-name the-songname second-line"></span></div>
      <div class="menu-description"><span class="the-artist"> </span><span class="the-name"> </span></div>
    </div>
    <script>jQuery(document).ready(function ($) {
        var settings_ap34528259 = {
          design_skin: "skin-wave",
          autoplay: "on",
          disable_volume: "default",
          loop: "off",
          cue: "off",
          embedded: "off",
          preload_method: "metadata",
          design_animateplaypause: "default",
          skinwave_dynamicwaves: "off",
          skinwave_enableSpectrum: "off",
          skinwave_enableReflect: "on",
          playfrom: "off",
          default_volume: "default",
          disable_scrub: "off",
          skinwave_comments_enable: "off",
          settings_php_handler: window.ajaxurl,
          skinwave_mode: "small",
          skinwave_wave_mode: "canvas",
          pcm_data_try_to_generate: "on",
          "pcm_notice": "off",
          "notice_no_media": "on",
          skinwave_wave_mode_canvas_waves_number: "3",
          skinwave_wave_mode_canvas_waves_padding: "1",
          skinwave_wave_mode_canvas_reflection_size: "0.25",
          design_color_bg: "111111",
          design_wave_color_progress: "ef6b13",
          design_color_highlight: "ef6b13",
          skinwave_wave_mode_canvas_mode: "normal",
          preview_on_hover: "off",
          skinwave_comments_playerid: "34528259"
        };
        try {
          dzsap_init(".ap_idx_32_2", settings_ap34528259);
        } catch (err) {
          console.warn("cannot init player", err);
        }
      });</script>
  </div>
</section>


<script src="../../audioplayer/audioplayer.js" type="text/javascript"></script>
<link rel="stylesheet" href="../../libs/fontawesome/font-awesome.min.css">
</body>
</html>
