export const assets_svg_close_btn = '<svg enable-background="new 0 0 40 40" id="" version="1.1" viewBox="0 0 40 40" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M28.1,26.8c0.4,0.4,0.4,1,0,1.4c-0.2,0.2-0.5,0.3-0.7,0.3s-0.5-0.1-0.7-0.3l-6.8-6.8l-6.8,6.8c-0.2,0.2-0.5,0.3-0.7,0.3   s-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l6.8-6.8l-6.8-6.8c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l6.8,6.8l6.8-6.8   c0.4-0.4,1-0.4,1.4,0c0.4,0.4,0.4,1,0,1.4L21.3,20L28.1,26.8z"/></g><g><path d="M19.9,40c-11,0-20-9-20-20s9-20,20-20c4.5,0,8.7,1.5,12.3,4.2c0.4,0.3,0.5,1,0.2,1.4c-0.3,0.4-1,0.5-1.4,0.2   c-3.2-2.5-7-3.8-11-3.8c-9.9,0-18,8.1-18,18s8.1,18,18,18s18-8.1,18-18c0-3.2-0.9-6.4-2.5-9.2c-0.3-0.5-0.1-1.1,0.3-1.4   c0.5-0.3,1.1-0.1,1.4,0.3c1.8,3.1,2.8,6.6,2.8,10.2C39.9,31,30.9,40,19.9,40z"/></g></svg>';


export const assets_svg_play = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="13.75px" height="12.982px" viewBox="0 0 13.75 12.982" enable-background="new 0 0 13.75 12.982" xml:space="preserve"> <path d="M11.889,5.71L3.491,0.108C3.389,0.041,3.284,0,3.163,0C2.834,0,2.565,0.304,2.565,0.676H2.562v11.63h0.003 c0,0.372,0.269,0.676,0.597,0.676c0.124,0,0.227-0.047,0.338-0.115l8.389-5.595c0.199-0.186,0.326-0.467,0.326-0.781 S12.088,5.899,11.889,5.71z"/> </svg>';
export const assets_svg_right_arrow = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 22.062 22.062" style="enable-background:new 0 0 22.062 22.062;" xml:space="preserve" width="512px" height="512px"> <g> <path d="M10.544,11.031l6.742-6.742c0.81-0.809,0.81-2.135,0-2.944l-0.737-0.737 c-0.81-0.811-2.135-0.811-2.945,0L4.769,9.443c-0.435,0.434-0.628,1.017-0.597,1.589c-0.031,0.571,0.162,1.154,0.597,1.588 l8.835,8.834c0.81,0.811,2.135,0.811,2.945,0l0.737-0.737c0.81-0.808,0.81-2.134,0-2.943L10.544,11.031z" fill="#696969"/> </g> </svg> ';

export function dzs_initHelperFunctions(){

  window.get_query_arg = function (purl, key) {


    if (purl.indexOf(key + '=') > -1) {

      var regexS = "[?&]" + key + "(.+?)(?=&|$)";
      var regex = new RegExp(regexS);
      var regtest = regex.exec(purl);


      if (regtest) {


        if (regtest[1]) {
          const aux = regtest[1].replace(/=/g, '');
          return aux;
        } else {
          return '';
        }


      }

    }
  }


  window.add_query_arg = function (purl, key, value) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);


    var s = purl;
    var pair = key + "=" + value;

    var r = new RegExp("(&|\\?)" + key + "=[^\&]*");


    s = s.replace(r, "$1" + pair);

    var addition = '';
    if (s.indexOf(key + '=') > -1) {


    } else {
      if (s.indexOf('?') > -1) {
        addition = '&' + pair;
      } else {
        addition = '?' + pair;
      }
      s += addition;
    }

    //if value NaN we remove this field from the url
    if (value == 'NaN') {
      var regex_attr = new RegExp('[\?|\&]' + key + '=' + value);
      s = s.replace(regex_attr, '');
    }


    return s;
  }
}

export function init_jquery_helpers() {

  jQuery.fn.outerHTML = function (e) {
    return e
      ? this.before(e).remove()
      : jQuery("<p>").append(this.eq(0).clone()).html();
  };


  jQuery.fn.prependOnce = function (arg, argfind) {
    var _t = jQuery(this) // It's your element


    if (typeof (argfind) == 'undefined') {
      var regex = new RegExp('class="(.*?)"');
      var auxarr = regex.exec(arg);


      if (typeof auxarr[1] != 'undefined') {
        argfind = '.' + auxarr[1];
      }
    }


    // we compromise chaining for returning the success
    if (_t.children(argfind).length < 1) {
      _t.prepend(arg);
      return true;
    } else {
      return false;
    }
  };
  jQuery.fn.appendOnce = function (arg, argfind) {
    var _t = jQuery(this) // It's your element


    if (typeof (argfind) == 'undefined') {
      var regex = new RegExp('class="(.*?)"');
      var auxarr = regex.exec(arg);


      if (typeof auxarr[1] != 'undefined') {
        argfind = '.' + auxarr[1];
      }
    }

    if (_t.children(argfind).length < 1) {
      _t.append(arg);
      return true;
    } else {
      return false;
    }
  };

}

export function detect_ultibox_args (margs, $ultiboxItem, overwrite_mainOptions) {



  // const margs = pargs;
  let suggestedMediaType = 'image';
  if ($ultiboxItem) {


    if ($ultiboxItem.attr('data-source')) {
      margs.source = $ultiboxItem.attr('data-source');
    } else {
      if ($ultiboxItem.attr('data-src')) {
        margs.source = $ultiboxItem.attr('data-src');
      } else {
        if ($ultiboxItem.attr('data-sourcevp')) {
          // -- if it's video we might be looking for data-sourcevp
          margs.source = $ultiboxItem.attr('data-sourcevp');
          suggestedMediaType = 'video';
        } else {
          if ($ultiboxItem.attr('href')) {
            margs.source = $ultiboxItem.attr('href');
            suggestedMediaType = 'iframe';
          }
        }
      }
    }
    if ($ultiboxItem.attr('data-type')) {
      margs.type = $ultiboxItem.attr('data-type');


      if (margs.type === 'vimeo') {
        margs.type = 'video';
        margs.video_type = 'vimeo';
      }
      if (margs.type === 'youtube') {
        margs.type = 'video';
        margs.video_type = 'youtube';
      }
    } else {
      margs.type = detect_ultibox_media_type(margs.source, suggestedMediaType);
    }

    if ($ultiboxItem.attr('data-scaling')) {
      margs.scaling = $ultiboxItem.attr('data-scaling');
    }
    if ($ultiboxItem.attr('data-box-bg')) {
      margs.box_bg = $ultiboxItem.attr('data-box-bg');
    }
    if ($ultiboxItem.attr('data-overwriteUltiboxSettings')) {
      try {
        const newOptions = JSON.parse($ultiboxItem.attr('data-overwriteUltiboxSettings'));
        overwrite_mainOptions(newOptions);
      } catch (e) {

        console.log(e);
      }
    }
    if ($ultiboxItem.attr('data-audio-thumb')) {
      margs.audio_thumb = $ultiboxItem.attr('data-audio-thumb');
    }
    if ($ultiboxItem.attr('data-inline-move')) {
      margs.inline_content_move = $ultiboxItem.attr('data-inline-move');
    }

    if ($ultiboxItem.next().hasClass('feed-ultibox-desc') || $ultiboxItem.children().hasClass('feed-ultibox-desc')) {

      var _c = null;
      if ($ultiboxItem.next().hasClass('feed-ultibox-desc')) {
        _c = $ultiboxItem.next();
      }
      if ($ultiboxItem.children('.feed-ultibox-desc').length) {
        _c = $ultiboxItem.children('.feed-ultibox-desc').eq(0);
      }

      if (_c) {

        margs.under_description = _c.html();
      }

    }


    if ($ultiboxItem.attr('data-suggested-width')) {
      margs.suggested_width = ($ultiboxItem.attr('data-suggested-width'));
    }
    if ($ultiboxItem.attr('data-force-nodeeplink')) {
      margs.forcenodeeplink = ($ultiboxItem.attr('data-force-nodeeplink'));
    }
    if ($ultiboxItem.attr('data-suggested-height')) {
      margs.suggested_height = ($ultiboxItem.attr('data-suggested-height'));
    }

    if (typeof $ultiboxItem !== 'string') {
      margs.item = $ultiboxItem;
    }


    if ($ultiboxItem.attr('data-biggallery')) {
      margs.biggallery = $ultiboxItem.attr('data-biggallery');
    }
  }


  if (margs.type === 'video') {
    if (margs.video_type === 'detect') {


      if (margs.item && margs.item.attr('data-video-type')) {
        margs.video_type = margs.item.attr('data-video-type');
      }
    }

    if (margs.video_type === 'detect') {
      if (margs.source.indexOf('youtube.com/') > -1) {
        margs.video_type = 'youtube';
        margs.source = get_query_arg(margs.source, 'v');
      }
    }
    if (margs.video_type === 'detect') {

      margs.video_type = 'video';
    }

  }

  if (margs.type === 'audio') {

    if (margs.audio_type === 'detect') {

      margs.audio_type = 'audio';
    }

  }

  if (margs.type === 'inlinecontent') {
    margs._targetDiv = $(margs.source).eq(0);

  }


  if (margs.under_description) {
    if (margs.max_width === 'default') {
      margs.max_width = 400;
    }
  }


  if (margs.biggallery) {
  }

  return margs;

}
export function detect_ultibox_media_type (theSource, suggestedMediaType = 'image') {

  var type = suggestedMediaType;


  if (theSource) {

    if (theSource.indexOf('#') === 0 || (theSource.indexOf('.') === 0 && theSource.indexOf('/') === '-1')) {
      type = 'inlinecontent';
    }
    if (theSource.indexOf('.mp4') >= theSource.length - 4 || theSource.indexOf('.m4v') >= theSource.length - 4) {
      type = 'video';
    }
    if (theSource.indexOf('.mp3') >= theSource.length - 4 || theSource.indexOf('.m4a') >= theSource.length - 4) {
      type = 'audio';
    }
  }

  return type;
}



