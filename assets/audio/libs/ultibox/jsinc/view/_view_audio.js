/**
 *
 * @param margs
 * @param _boxMainMedia
 * @param ultibox_options
 * @param _boxMainRealMedia
 */
export const viewConstructAudioPlayer = (margs, _boxMainMedia, ultibox_options, _boxMainRealMedia) => {


  let structAudioPlayer = ultibox_options.audioplayer_template;



  structAudioPlayer = structAudioPlayer.replace(/{{dzsap_ultibox-source}}/g, margs.source);
  structAudioPlayer = structAudioPlayer.replace(/{{dzsap_ultibox-audio_thumb}}/g, margs.audio_thumb);


  _boxMainMedia.append(structAudioPlayer);


  const argsApSettings = jQuery.extend({
    'autoplay': 'off'
    , 'cue': 'on'
    , skinwave_mode: 'small'
  }, ultibox_options.audioplayer_settings);

  _boxMainMedia.find('.real-media').eq(0).audioplayer(argsApSettings);

  setTimeout(function () {
    if(_boxMainRealMedia && _boxMainRealMedia.get(0)){

      _boxMainRealMedia.get(0).api_play_media();
    }
  }, 300)
}
