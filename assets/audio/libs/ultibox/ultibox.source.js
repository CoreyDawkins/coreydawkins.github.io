// -- DZS Ultibox
// @version 1.23
// @this is not free software
// -- DZS Ultibox == copyright == http://digitalzoomstudio.net


"use strict";

import {viewConstructAudioPlayer} from "./jsinc/view/_view_audio";
import {
  assets_svg_close_btn,
  assets_svg_play,
  assets_svg_right_arrow, detect_ultibox_args,
  detect_ultibox_media_type,
  dzs_initHelperFunctions,
  init_jquery_helpers
} from "./jsinc/_ultibox_helpers";
import {ultiboxDefaultOptions} from "./config/_ultiboxDefaultOptions";

Object.size = function (obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
if (window.jQuery === undefined) {
  console.log("jquery not detected ? ");
  setTimeout(() => {
    init_jquery_helpers();
  }, 500);
} else {
  init_jquery_helpers();
}

window.dzstaa_self_options = {};


window.dzsulb_inited = false;


Math.easeIn = function (t, b, c, d) {

  return -c * (t /= d) * (t - 2) + b;

};

dzs_initHelperFunctions();

(function ($) {


  var svg_close_btn = assets_svg_close_btn;


  var svg_right_arrow = assets_svg_right_arrow;


  var _maincon = null,
    _boxMainsCon = null,
    _galleryClipCon = null,
    _galleryItemsCon = null,
    _boxMain = null,
    _boxMainMediaCon = null,
    _boxMainMedia = null,
    _boxMainRealMedia = null, // -- temp, the real media
    _boxMainUnder = null
  ;


  var id_main = '';

  var media_ratio_w_h = 0
    , media_w = 0
    , media_h = 0
    , media_finalw = 0
    , media_finalh = 0
    , media_has_under_description = false

    , opts_max_width = 0


    , currNr_gal = -1

    , bmc_w = 0 // -- box-mains-con width
    , bmc_h = 0 // -- box-mains-con height

    , scaling = 'proportional' // -- proportional or fill

    , ww = 0
    , wh = 0

    , gallery_setup = '' // -- the gallery curently setup

    , $ultibox_items_arr = []
    , theurl = window.location.href
  ;


  var lastargs = null
    , lastlastargs = null
  ;

  var padding_hor = 30
    , padding_ver = 30
    , offset_v = 30
  ;


  var inter_calculate_dims_light = 0;


  var _inline_content_orig_parent = null
    , _inline_content_orig_prev = null
    , _inline_content_orig_parent_last = null
    , _inline_content_orig_prev_last = null
  ;


  var func_callback = null
  ;


  let ultibox_curr_margs = {};
  let ultibox_options = {

    'transition': 'slideup',
    'transition_out': 'same-as-in',
    'skin': 'skin-default',
    settings_deeplinking: "on",
    nav_mode: "thumbs", // -- thumbs or none
    settings_enable_arrows: "auto",
    extra_classes: "",
    gallery_type: "skin-default",
    videoplayer_settings: {
      'autoplay': 'off',
      'design_skin': 'skin_reborn',
      settings_youtube_usecustomskin: 'on',
      'cue': 'on'
    },
    audioplayer_template: `<div class="audioplayer-tobe skin-wave real-media  button-aspect-noir button-aspect-noir--filled "   data-source="{{dzsap_ultibox-source}}"  data-thumb="{{dzsap_ultibox-audio_thumb}}" ></div>`,
    audioplayer_settings: {}


  };

  let scroll_lastOffsetY = 0;
  let isUltiboxOpened = false;


  const $body = $('body').eq(0);
  const _html = $('html').eq(0);

  window.dzsulb_main_init = dzsulb_main_init;

  function dzsulb_main_init() {


    if (_maincon) {
      return false;
    }


    if (window.ultibox_options_init) {
      ultibox_options = $.extend(ultibox_options, window.ultibox_options_init);
    }



    let struct_mainCon = '<div class="dzsulb-main-con ' + ultibox_options.skin + ' ' + ultibox_options.extra_classes + ' gallery-' + ultibox_options.gallery_type + '">';


    if (ultibox_options.skin == 'skin-default') {

      if (ultibox_options.settings_enable_arrows == 'auto') {

      }
    }

    struct_mainCon += '<div class="overlay-background"></div>';

    struct_mainCon += '<div class="dzsulb-preloader preloader-fountain" > <div id="fountainG_1" class="fountainG"></div> <div id="fountainG_2" class="fountainG"></div> <div id="fountainG_3" class="fountainG"></div> <div id="fountainG_4" class="fountainG"></div> </div>';

    struct_mainCon += '<div class="box-mains-con">';

    struct_mainCon += '</div><!-- end .box-mains-con-->';


    if (ultibox_options.nav_mode == 'thumbs') {

      struct_mainCon += '<div class="gallery-clip-con"><div class="gallery-items-con">';

      struct_mainCon += '</div></div><!-- end .gallery-clip-con-->';
    }


    struct_mainCon += '</div>';


    $body.append(struct_mainCon);


    _maincon = $body.children('.dzsulb-main-con').eq(0);
    _boxMainsCon = _maincon.find('.box-mains-con').eq(0);
    _galleryClipCon = _maincon.find('.gallery-clip-con').eq(0);
    _galleryItemsCon = _maincon.find('.gallery-items-con').eq(0);

    if (ultibox_options.transition == 'default') {
      ultibox_options.transition = 'fade';
    }
    if (ultibox_options.transition_out == 'same-as-in') {
      ultibox_options.transition_out = ultibox_options.transition;
    }


    _maincon.addClass('transition-' + ultibox_options.transition);


    _maincon.on('click', '>.overlay-background, .close-btn-con, .ultibox-close-btn, .gallery-items-con > .gallery-thumb, .ultibox-gallery-arrow,.ultibox-prev-btn,.ultibox-next-btn', handle_mouse);
    _maincon.on('wheel', '.box-main.scroll-mode,.gallery-items-con.scroll-mode', handle_scroll);
    $(window).on('wheel', handle_window_scroll);


    check_deeplink();


    window.close_ultibox = close_ultibox;


    window.api_ultibox_set_callback_func = function (argo) {
      func_callback = argo;
    };


    $(window).on('resize', handle_resize)
    handle_resize();

  }

  function overwrite_mainOptions(newUltiboxOptions) {
    ultibox_options = Object.assign(ultibox_options, newUltiboxOptions);
  }

  function handle_window_scroll() {

    if (isUltiboxOpened) {
      if (Math.abs(window.scrollY - scroll_lastOffsetY) > 150) {
        close_ultibox()
      } else {

        window.scrollTo({
          top: scroll_lastOffsetY,
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  }

  function check_deeplink() {
    if (theurl.indexOf('ultibox=') > -1) {

      if (get_query_arg(theurl, 'ultibox')) {
        var tempNr = parseInt(get_query_arg(theurl, 'ultibox'), 10);


        if (String(tempNr) !== 'NaN') {
          // -- if it is a number
          if (tempNr > -1) {

            // -- lets see if we have it .. if we don t


            if ($('.ultibox-item,.ultibox-item-delegated').eq(tempNr).length) {

              open_ultibox($('.ultibox-item,.ultibox-item-delegated').eq(tempNr), null, {
                from_deeplink: tempNr
                , call_from: 'check_deeplink'
              });
            } else {

              setTimeout(function () {
                open_ultibox($('.ultibox-item,.ultibox-item-delegated').eq(tempNr), null, {
                  from_deeplink: tempNr
                  , call_from: 'check_deeplink'
                });

              }, 1500);
            }
            // -- let us try again

          }
        } else {

          var auxobj = $('#' + get_query_arg(theurl, 'ultibox'));


          open_ultibox(auxobj, null, {
            from_deeplink: '#' + get_query_arg(theurl, 'ultibox')
            , call_from: 'check_deeplink'
          });
        }
      }

    }
  }

  function handle_scroll(e) {


    var _t = $(this);


    // -- this is where the scrolling happens
    if (_t.hasClass('box-main')) {

      var ch = wh;
      var th = _boxMain.children('.box-main-media-con').eq(0).outerHeight();

      var auxY = parseInt(_boxMain.css('top')) + Number(e.originalEvent.wheelDelta) * 10;


      if (auxY > offset_v) {
        auxY = offset_v;
      }
      if (auxY < ch - th - offset_v - (wh - _boxMain.parent().outerHeight())) {
        auxY = ch - th - offset_v - (wh - _boxMain.parent().outerHeight());
      }


      _boxMain.css({})
    }
    if (_t.hasClass('gallery-items-con')) {

      var cw = ww;
      var tw = _galleryItemsCon.outerWidth();

      var auxX = parseInt(_galleryItemsCon.css('left')) + Number(e.originalEvent.wheelDelta) * 10;


      if (auxX > 30) {
        auxX = 30;
      }
      if (auxX < cw - tw - 30) {
        auxX = cw - tw - 30;
      }


      _galleryItemsCon.css({
        'left': auxX
      })
    }


  }

  function handle_mouse(e) {


    var _t = $(this);

    if (e.type === 'click') {


      if (_t.hasClass('overlay-background')) {

        close_ultibox();

      }
      if (_t.hasClass('close-btn-con') || _t.hasClass('ultibox-close-btn')) {

        close_ultibox();

      }

      if (_t.hasClass('gallery-thumb')) {

        var ind = _t.parent().children().index(_t);


        goto_gallery_item(ind);

      }

      if (_t.hasClass('ultibox-gallery-arrow--left')) {

        goto_gallery_item_prev();

      }

      if (_t.hasClass('ultibox-gallery-arrow--right')) {

        goto_gallery_item_next();

      }


      // -- loaded-item next, .zoomed next
    }

  }

  function handle_mouse_item(e) {


    var _t = $(this);

    if (e.type === 'click') {


      if (_t.hasClass('')) {

      }

      open_ultibox(_t, null);


      // -- loaded-item next, .zoomed next
    }

  }


  function goto_gallery_item_prev() {
    var tempNr = currNr_gal;
    tempNr--;


    var gal_nr_items = 0;

    if (_galleryItemsCon.length) {
      gal_nr_items = _galleryItemsCon.children().length;
    } else {
      gal_nr_items = $('*[data-biggallery="' + ultibox_curr_margs.biggallery + '"]').length;
    }

    if (tempNr < 0) {
      tempNr = gal_nr_items - 1;
    }


    goto_gallery_item(tempNr);

    return false;
  }

  function goto_gallery_item_next() {
    var tempNr = currNr_gal;
    tempNr++;


    var gal_nr_items = 0;

    if (_galleryItemsCon.length) {
      gal_nr_items = _galleryItemsCon.children().length;
    } else {
      gal_nr_items = $('*[data-biggallery="' + ultibox_curr_margs.biggallery + '"]').length;
    }


    if (tempNr >= gal_nr_items) {
      tempNr = 0;
    }


    goto_gallery_item(tempNr);


    return false;
  }


  function goto_gallery_item(arg) {

    var _c = null;
    var gallery_selection_mode = 'gallery-items';


    if (_galleryItemsCon.length && _galleryItemsCon.children().length) {


      _c = _galleryItemsCon.children().eq(arg);

      gallery_selection_mode = 'gallery-items';
    } else {


      _c = $('*[data-biggallery="' + ultibox_curr_margs.biggallery + '"]').eq(arg);

      gallery_selection_mode = 'this is the item';
    }


    if (_c) {

    }


    if (currNr_gal > -1) {
      if (arg < currNr_gal) {

        _maincon.addClass('gallery-direction-reverse');
      }

      if (arg === currNr_gal) {
        return false;
      }
    }


    // -- if we have _c parent-item property
    if (_c) {

      window.ultibox_countdown = false;

      if (gallery_selection_mode === 'gallery-items') {

        if (_c.data('parent-item')) {
          open_ultibox(_c.data('parent-item'), {
            'call_from': 'gallery_item'
          })
        }


      }

      if (gallery_selection_mode === 'this is the item') {


        open_ultibox(_c, {
          'call_from': 'gallery_item'
        })


      }

      currNr_gal = arg;


      restore_target_div();


      if (_galleryItemsCon) {

        _galleryItemsCon.children().removeClass('active');
        setTimeout(function () {
          _galleryItemsCon.children().eq(currNr_gal).addClass('active');
        }, 100)
      }

    }

  }


  window.ultibox_reset_cooldown = function () {

  }
  /**
   * main open ultibox
   * @param $ultiboxItem
   * @param pargs
   * @returns {boolean}
   */
  window.open_ultibox = function ($ultiboxItem, pargs) {


    var margs = {

      type: 'detect',
      video_type: 'detect',
      audio_type: 'detect'
      , audio_thumb: ''
      , source: ''
      , max_width: 'default' // -- this is useful for under description feed and is mandatory actually
      , under_description: '' // -- this is the under description
      , right_description: '' // -- this is the under description
      , scaling: 'proportional' // -- this is the under description
      , inline_content_move: 'off'
      , suggested_width: ''
      , suggested_height: ''
      , box_bg: ''
      , biggallery: ''
      , call_from: 'default'
      , forcenodeeplink: 'off'
      , _targetDiv: null,
      item: null // -- we can pass the items from here too

    };


    if (pargs) {
      margs = $.extend(margs, pargs);
    }


    if (window.ultibox_countdown) {
      return false;

    }
    window.ultibox_countdown = true;
    setTimeout(function () {
      window.ultibox_reset_cooldown();
    }, 100);


    detect_ultibox_args(margs, $ultiboxItem, overwrite_mainOptions);


    ultibox_curr_margs = $.extend({}, margs);


    _maincon.removeClass('disabled');
    _html.addClass('ultibox-opened');
    scroll_lastOffsetY = window.scrollY;
    isUltiboxOpened = true;


    setTimeout(function () {

      _maincon.addClass('loading-item');


      if (margs.type === 'image') {


        var newImg = new Image;
        newImg.onload = function () {
          media_w = this.naturalWidth;
          media_h = this.naturalHeight;
          setup_media(margs);
        };
        newImg.src = margs.source;
      }

      if (margs.type === 'video') {
        media_w = 800;
        media_h = 454;
        if (margs.video_type === 'video' || margs.video_type === 'youtube' || margs.video_type === 'vimeo') {
          if ($.fn.vPlayer) {
            setup_media(margs);
          } else {
            console.warn("You need videogallery embedded");
            close_ultibox();
          }
        }

      }

      if (margs.type === 'audio') {
        media_w = 800;
        media_h = 'auto';
        if (margs.audio_type === 'audio') {
          if ($.fn.audioplayer) {
            setup_media(margs);
          } else {
            console.warn("You need zoomsounds embedded");
            close_ultibox();
          }
        }
      }

      if (margs.type === 'iframe') {
        media_w = 800;
        media_h = 600;

        setup_media(margs);
      }

      if (margs.type === 'inlinecontent') {
        media_w = 800;
        media_h = 'auto';

        setup_media(margs);
      }
    }, 100);


    if (ultibox_options.settings_deeplinking === 'on' && can_history_api() === true && margs.forcenodeeplink !== 'on') {


      $ultibox_items_arr = $('.ultibox-item,.ultibox-item-delegated')
      if (margs.item && margs.item.attr('data-ultibox-sort')) {

      }

      let ind = $ultibox_items_arr.index(margs.item);
      if ($(margs.item).attr('id')) {


        var aux = encodeURIComponent($(margs.item).attr('id'));
        aux = aux.replace(/%/g, "8767");
        ind = aux;
      }


      theurl = window.location.href;
      var newurl = add_query_arg(theurl, 'ultibox', ind);
      if (newurl.indexOf(' ') > -1) {
        newurl = newurl.replace(' ', '%20');
      }
      theurl = newurl;
      history.pushState({}, "", newurl);
    }
  }


  /**
   * appends the item to the DOM but does not necesarrly append the loaded event , that is appended only when the media is ( allegedly )
   * @param {object} margs
   * @param {number} margs.suggested_width
   * @param {number} margs.suggested_height
   * @param {string} margs.call_from
   * @param {string} margs.type
   * @param {string} margs.video_type
   */
  function setup_media(margs) {


    if (margs.suggested_width) {
      if (isNaN(Number(margs.suggested_width)) === false) {

        media_w = Number(margs.suggested_width);
      } else {
        media_w = margs.suggested_width;
      }
    }
    if (margs.suggested_height) {
      if (isNaN(Number(margs.suggested_height)) === false) {

        media_h = Number(margs.suggested_height);
      } else {
        media_h = margs.suggested_height;
      }
    }


    if (isNaN(Number(margs.suggested_height)) === false) {
      media_ratio_w_h = media_w / media_h;
    } else {
      media_ratio_w_h = 1;
    }
    scaling = margs.scaling;


    var structureBoxMain = '';


    if (margs.call_from == 'gallery_item') {
      _boxMain.addClass('gallery-transitioning-out');
    } else {
      if (_boxMain) {

        _boxMain.addClass('transitioning-out');
      }
    }

    structureBoxMain += '<div class="box-main type-' + margs.type;

    if (margs.call_from == 'gallery_item') {
      structureBoxMain += ' gallery-preparing-transitioning-in';

      setTimeout(function () {
        _boxMain.addClass('gallery-transitioning-in')
      }, 10)
      setTimeout(function () {
        _maincon.find('.box-main.gallery-transitioning-out').remove();
        _boxMain.removeClass('gallery-transitioning-in')
        _boxMain.removeClass('gallery-preparing-transitioning-in')
        _maincon.removeClass('gallery-direction-reverse')
      }, 500)


    }


    structureBoxMain += '">';


    structureBoxMain += '<div class="box-main-media-con transition-target">';


    structureBoxMain += '<div class="close-btn-con"> ' + svg_close_btn + '</div>';

    structureBoxMain += '<div class="box-main-media type-' + margs.type + '" style="';

    if (margs.box_bg) {
      structureBoxMain += 'background-color: ' + margs.box_bg + ';';
    }

    structureBoxMain += '"></div><div class="box-main-under"></div>';


    if (ultibox_options.settings_enable_arrows === 'on') {
      structureBoxMain += '<div class="ultibox-gallery-arrow ultibox-gallery-arrow--left">' + svg_right_arrow + '</div>';
      structureBoxMain += '<div class="ultibox-gallery-arrow ultibox-gallery-arrow--right">' + svg_right_arrow + '</div>';


    }


    structureBoxMain += '</div></div>';

    _boxMainsCon.append(structureBoxMain);


    _boxMain = _maincon.find('.box-main:not(.gallery-transitioning-out)').eq(0);
    _boxMainMediaCon = _boxMain.find('.box-main-media-con').eq(0);
    _boxMainMedia = _boxMain.find('.box-main-media').eq(0);
    _boxMainUnder = _boxMain.find('.box-main-under').eq(0);


    if (margs.type === 'image') {
      _boxMainMedia.append('<div class="imagediv real-media" style="background-image: url(' + margs.source + ') "></div>');
      setTimeout(function () {

        media_ready(margs);
      }, 50);

    }

    if (margs.type === 'video') {


      if (ultibox_options.videoplayer_settings.settings_youtube_usecustomskin === 'off' && (margs.video_type === 'youtube' || margs.video_type === 'vimeo')) {


        if (margs.video_type === 'youtube') {
          _boxMainMedia.append('<iframe class="real-media" width="100%" height="100%" src="https://www.youtube.com/embed/' + margs.source + '" frameborder="0" allowfullscreen allow="fullscreen"></iframe>');
        }
        if (margs.video_type === 'vimeo') {
          _boxMainMedia.append('<iframe src="https://player.vimeo.com/video/' + margs.source + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="fullscreen"></iframe>');
        }


      } else {
        if (margs.video_type === 'video' || margs.video_type === 'youtube' || margs.video_type === 'vimeo') {
          if ($.fn.vPlayer) {


            var video_title = '';

            if (margs.item && margs.item.attr('data-videotitle')) {
              video_title = margs.item.attr('data-videotitle');
            }


            var aux_str_videoplayer = '<div class="vplayer-tobe auto-init   real-media " data-videoTitle="' + video_title + '"  data-src="' + margs.source + '"';


            aux_str_videoplayer += ' data-type="' + margs.video_type + '"'

            aux_str_videoplayer += '></div>';

            _boxMainMedia.append(aux_str_videoplayer);


            var args = {
              'autoplay': 'off'
              , 'cue': 'on'
            };

            if (ultibox_options.videoplayer_settings) {
              args = $.extend(args, ultibox_options.videoplayer_settings);
            }



            if (margs.item && margs.item.attr('data-player-id')) {
              _boxMainMedia.find('.real-media').eq(0).attr('data-player-id', margs.item.attr('data-player-id'));
            }


            window.dzsvp_init(_boxMainMedia.find('.real-media').eq(0), args);


          }
        }

      }


      setTimeout(function () {

        _maincon.addClass('loaded-item');
      }, 50);


    }


    if (margs.type === 'audio') {

      if (margs.audio_type === 'youtube') {
        _boxMainMedia.append('<iframe class="real-media" width="100%" height="100%" src="https://www.youtube.com/embed/' + margs.source + '" frameborder="0" allowfullscreen></iframe>');
      }


      if (margs.audio_type === 'audio') {
        if ($.fn.audioplayer) {

          viewConstructAudioPlayer(margs, _boxMainMedia, ultibox_options, _boxMainRealMedia);
        }
      }


      setTimeout(function () {

        media_ready(margs);
      }, 50);


    }
    if (margs.type === 'iframe') {
      _boxMainMedia.append('<div class=" real-media" style=""><iframe class="ultibox--real-media--iframe" src="' + margs.source + '" style="" width="100%" height="100%"></iframe></div>');

      setTimeout(function () {
        media_ready(margs);

      }, 1500);


    }
    if (margs.type === 'inlinecontent') {


      _boxMainMedia.append('<div class=" real-media" style=""></div>');


      _inline_content_orig_prev = null;
      _inline_content_orig_parent = null;


      if (margs.inline_content_move === 'on') {

        if (margs._targetDiv.prev().length > 0) {
          _inline_content_orig_prev = margs._targetDiv.prev();
        } else {

          _inline_content_orig_parent = margs._targetDiv.parent();
        }
      }


      if (margs.inline_content_move === 'on') {
        _boxMainMedia.find('.real-media').append(margs._targetDiv);
      } else {
        _boxMainMedia.find('.real-media').append(margs._targetDiv.clone());
      }


      if (margs._targetDiv.hasClass('cancel-inlinecontent-padding')) {
        _boxMainMedia.addClass('cancel-inlinecontent-padding');
      } else {
        _boxMainMedia.removeClass('cancel-inlinecontent-padding');
      }


      if (_boxMainMedia.find('.auto-init-from-ultibox').length) {


        if (window.dzsvg_init) {
          _boxMainMedia.find('.videogallery.auto-init-from-ultibox:not(.inited)').each(function () {
            var _t2 = $(this);

            dzsvg_init(_t2, {
              init_each: true,
            });
          })
        }
      }


      _boxMainMedia.find('.toexecute, .to-execute--from-ultibox').each(function () {
        var _t2 = $(this);
        if (_t2.hasClass('executed') === false) {
          eval(_t2.text());
          _t2.addClass('executed');
        }
      });

      setTimeout(function () {

        media_ready(margs);
      }, 200);

      // -- we leave 1500 ms time to load any iframe

    }
    _boxMainRealMedia = _boxMainMedia.find('.real-media').eq(0);


    if (margs.under_description) {


      _boxMainUnder.append(margs.under_description);
      _boxMainMedia.width('100%');
      media_has_under_description = true;
      _boxMain.addClass('with-description');
    } else {

      media_has_under_description = false;

    }


    if (margs.biggallery) {

      if (margs.biggallery !== gallery_setup) {


        if (ultibox_options.nav_mode !== 'none') {

          _maincon.addClass('has-gallery');
        }


        var i5 = 0;
        $('*[data-biggallery="' + margs.biggallery + '"]').each(function () {
          var _t = $(this);


          // -- we check if
          if (margs.item && margs.item.get && margs.item.get(0)) {
            if (margs.item.get(0) === _t.get(0)) {

              currNr_gal = i5;
            }
          }


          let thumb_src = '';


          if (_t.attr('data-thumb-for-gallery')) {
            thumb_src = _t.attr('data-thumb-for-gallery');
          } else {
            if (_t.attr('data-source')) {
              thumb_src = _t.attr('data-source');
            }
            if (_t.get(0) && _t.get(0).nodeName === "IMG") {

              thumb_src = _t.attr('src');
            }
          }


          if (thumb_src) {

            var aux = '<div class="gallery-thumb"><div class="gallery-thumb--image" style="background-image: url(' + thumb_src + ');"></div><div class="gallery-thumb--icon">';


            if (_t.attr('data-type') === 'video' || _t.attr('data-type') === 'audio') {

              aux += assets_svg_play;
            }

            aux += '</div></div>';


            _galleryItemsCon.append(aux);
            _galleryItemsCon.children().last().data('parent-item', _t);
          }

          i5++;

        });

        // -- end for

        gallery_setup = margs.biggallery;


        setTimeout(function () {
          _galleryClipCon.addClass('gallery-loaded');

          _galleryItemsCon.children().eq(currNr_gal).addClass('active');
        }, 100)

      } else {

        _galleryClipCon.addClass('gallery-loaded');
      }
    } else {

      _maincon.removeClass('has-gallery');
      _galleryClipCon.removeClass('gallery-loaded');
      gallery_setup = '';
    }


    if (margs.max_width) {
      opts_max_width = margs.max_width;
    } else {
      opts_max_width = 0;
    }

    handle_resize(null, {
      call_calculate_dims_light: false
    })
    calculate_dims_light({
      'call_from': "setup_media"
      , 'calculate_main_con': true

    })

    lastargs = margs;


    if (func_callback) {
      func_callback(margs);
    }


    // -- just want to cancel the default click behaviour on links


  }

  function media_ready(margs) {

    _maincon.addClass('loaded-item');


    if (margs.type === 'inlinecontent') {


      if (_boxMainMedia.find('.contentscroller').length) {
        _boxMainMedia.find('.contentscroller').each(function () {
          var $t2 = $(this);


          if ($t2.get(0).api_handleResize) {

            $t2.get(0).api_handleResize();
          }
        })
      }


      if (_boxMainMedia.find('.videogallery').length) {
        _boxMainMedia.find('.videogallery').each(function () {
          var $t2 = $(this);


          if ($t2.get(0).api_handleResize) {
            $t2.get(0).api_handleResize(null, {
              force_resize_gallery: true
            })
          }
        })
      }

      if (_boxMainMedia.find('.ultibox-close-btn').length) {
        _boxMain.find('.close-btn-con').fadeOut('fast');
      } else {

        _boxMain.find('.close-btn-con').fadeIn('fast');
      }


      setTimeout(function () {

        calculate_dims_light();
      }, 500);
    }
  }


  function restore_target_div() {


    if (lastargs && lastargs.inline_content_move === 'on') {

      _inline_content_orig_prev_last = _inline_content_orig_prev;
      _inline_content_orig_parent_last = _inline_content_orig_parent;


      lastlastargs = $.extend({}, lastargs);


      setTimeout(function () {


        if (_inline_content_orig_prev_last) {

          _inline_content_orig_prev_last.after(lastlastargs._targetDiv);

        }
        if (_inline_content_orig_parent_last) {

          _inline_content_orig_parent_last.prepend(lastlastargs._targetDiv);

        }


        // -- TODO: maybe resize content scroller


      }, 300)
    }

  }


  function close_ultibox() {


    if (_maincon.find('.show-only-in-ultibox').length === 0) {
      _maincon.removeClass('loading-item');
    }

    _maincon.removeClass('loaded-item');
    _html.removeClass('ultibox-opened')
    isUltiboxOpened = false;
    _galleryClipCon.removeClass('gallery-loaded');


    if (_maincon.find('.show-only-in-ultibox').length) {
      setTimeout(function () {
        _maincon.removeClass('loading-item');
      }, 500);
    }
    _maincon.addClass('closing-ultibox');


    // -- leave it a bit so we can make sure that the hiding for show-only-in-ultibox is not instant
    setTimeout(function () {
      _maincon.removeClass('loading-item');
      _maincon.removeClass('closing-ultibox');
    }, 500);

    restore_target_div();


    if (ultibox_options.settings_deeplinking == 'on' && can_history_api() == true) {
      var newurl = add_query_arg(theurl, 'ultibox', "NaN");
      theurl = newurl;
      history.pushState({}, "", newurl);
    }

    setTimeout(function () {

      _maincon.addClass('disabled');

      if (_boxMainRealMedia) {

        _boxMainRealMedia.remove();
      }

      if (_boxMainUnder) {

        _boxMainUnder.html('');
      }

      _boxMainsCon.html('');


      window.ultibox_countdown = false;
    }, 300);
  }

  function handle_resize(e, pargs) {


    var margs = {
      'call_from': 'default'
      , 'call_calculate_dims_light': true
    };

    if (pargs) {
      margs = $.extend(margs, pargs);
    }


    ww = $(window).width();
    wh = window.innerHeight;

    bmc_w = _boxMainsCon.width();
    bmc_h = _boxMainsCon.height();


    if (margs.call_calculate_dims_light) {

      if (inter_calculate_dims_light) {
        clearTimeout(inter_calculate_dims_light);
      }
      inter_calculate_dims_light = setTimeout(calculate_dims_light, 100);
    }

    if (_boxMainMedia && _boxMainMedia.hasClass('type-inlinecontent')) {


    }

  }


  function calculate_dims_light(pargs) {


    var margs = {
      'call_from': 'default'
      , 'calculate_main_con': true
    };

    if (pargs) {
      margs = $.extend(margs, pargs);
    }


    if (margs.calculate_main_con) {


      media_finalw = media_w;
      media_finalh = media_h;

      if (opts_max_width) {
        if (media_finalw > opts_max_width) {
          media_finalw = opts_max_width;

          if (scaling !== 'fill') {

            media_finalh = media_finalw / media_ratio_w_h;
          }


        }


      }


      if (media_finalw > bmc_w - padding_hor) {
        media_finalw = bmc_w - padding_hor;
        if (scaling !== 'fill') {
          media_finalh = media_finalw / media_ratio_w_h;
        }
      }
      if (media_finalh > bmc_h - padding_ver) {

        media_finalh = bmc_h - padding_ver;
        if (scaling !== 'fill') {
          media_finalw = media_finalh * media_ratio_w_h;
        }

      }


      if (opts_max_width) {
        if (media_has_under_description) {
          _boxMainMediaCon.width(media_finalw);
        }
      }

      if (_boxMainMedia) {

        if (media_has_under_description) {
          _boxMainMedia.width('100%');
        } else {

          _boxMainMedia.width(media_finalw);
        }

        setTimeout(function () {


        }, 5000);

        _boxMainMedia.height(media_finalh);


        _boxMain.css({
          'max-height': 'none'
          , 'height': 'auto'
        })
        if (_boxMain) {


          setTimeout(function () {

            if (_boxMain.outerHeight() > _boxMain.parent().outerHeight()) { // 0 = padding


              _boxMain.addClass('scroll-mode');

              if (offset_v !== 30) {
                _boxMain.css('top', offset_v);
              }

            } else {

              _boxMain.removeClass('scroll-mode');
              _boxMain.css({
                'top': ''
              })
            }
            _boxMain.css({
              'max-height': ''
              , 'height': ''
            })
          }, 100)
        }
        if (_galleryItemsCon) {


          if (_galleryItemsCon.outerWidth() > ww - 0) { // 0 = padding


            _galleryItemsCon.addClass('scroll-mode');

          } else {

            _galleryItemsCon.removeClass('scroll-mode');
            _galleryItemsCon.css({
              'left': ''
            })
          }
          _galleryItemsCon.css({
            'max-height': ''
            , 'height': ''
          })
        }
      }


    }


  }


  // -- item


  $.fn.dzsulb = function (o) {



    if (!o) {
      if (typeof $(this).attr('data-options') != 'undefined' && $(this).attr('data-options') != '') {
        var aux = $(this).attr('data-options');
        aux = 'window.dzstaa_self_options = ' + aux;
        eval(aux);
        o = $.extend({}, window.dzstaa_self_options);
        window.dzstaa_self_options = $.extend({}, {});
      }
    }
    o = $.extend(ultiboxDefaultOptions, o);
    this.each(function () {
      const cthis = $(this)

      ;


      if (isNaN(Number(o.settings_startTab)) === false) {
        o.settings_startTab = parseInt(o.settings_startTab, 10);
      }

      if (can_history_api() === false) {
        o.settings_enable_linking = 'off';
      }

      o.toggle_breakpoint = parseInt(o.toggle_breakpoint, 10);


      if (window.dzsulb_inited === false) {
        dzsulb_init();
      }


      // -- item


      init();

      // -- init item !
      function init() {


        if (cthis.attr('data-source')) {

        } else {
          if (cthis.attr('href')) {
            cthis.attr('data-source', cthis.attr('href'));
          }
        }

        var src = cthis.attr('data-source');
        if (!(cthis.attr('data-type')) || cthis.attr('data-type') === 'detect') {


          cthis.attr('data-type', detect_ultibox_media_type(src));

        } else {

        }


        cthis.off('click', handle_mouse_item);
        cthis.on('click', handle_mouse_item);

      }


      return this;
    })
  }
  window.dzsulb_init = function (selector, settings) {
    $(selector).each(function () {
      var _t = $(this);
      _t.dzsulb(settings)
    });


    if (get_query_arg(window.location.href, 'ultibox') || get_query_arg(window.location.href, 'ultibox') === '0') {

      $(window).scrollTop(0);
    }


  };
})(jQuery);


function can_history_api() {
  return !!(window.history && history.pushState);
}


jQuery(document).ready(function ($) {

  dzsulb_init('.ultibox-item', {init_each: true});

  window.dzsulb_main_init();


  $(document).off('click', '.ultibox-item-delegated');
  $(document).on('click', '.ultibox-item-delegated', function (e) {
    window.open_ultibox($(this));

    e.stopPropagation();
    e.preventDefault();
    return false;
  });


});
