<?php

define('CONSIDER_COOKIES_WHEN_PORTAL_ACTIONS', 'false');
define('DZSAPP_SOURCE_PATH', dirname(dirname(dirname(__FILE__))));


ini_set("log_errors", 1);
ini_set('display_errors', '0');
error_reporting(E_ALL);
ini_set("error_log", "publisher.log");
if (file_exists(DZSAPP_SOURCE_PATH . '/dzsap-config.php')) {
  include_once(DZSAPP_SOURCE_PATH . '/dzsap-config.php');
}

$dzsap_portal = null;
if (isset($dzsap_config) && $dzsap_config['type'] == 'portal') {
  include_once(DZSAPP_SOURCE_PATH . '/portal/class-portal.php');
  $dzsap_portal = new DZSAP_Portal();
}


function dzs_clean($string) {
  $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.

  return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

function get_pcm($argplayerid, $source) {

  // -- mock
//  return '';

  $aux = 'pcm';
  $playerid = '';
  $current = '';

  if (isset($argplayerid) && $argplayerid) {
    $aux .= $argplayerid;
    $playerid = $argplayerid;
  } else {
    if (isset($source) && $source) {
      $aux .= dzs_clean($source);
//      return 'ceva';
      $playerid = $source;
    }
  }

  $file = DZSAPP_SOURCE_PATH . '/db/' . $aux . '.html';
//    echo $file;
  if (file_exists($file)) {
    $current = file_get_contents($file);
  }


  return $current;

}

if (isset($_GET['load-lightbox-css']) && $_GET['load-lightbox-css'] == 'on') {

  header("Content-type: text/css");
  include('assets/lightbox-css.php');
  die();
}


class DZSAP_Publisher {

  public $dir = 'db/';

  function __construct() {


    $this->check_post_input();


  }

  function check_post_input() {

    global $dzsap_portal, $dzsap_config;

    if (isset($_REQUEST['action'])) {


      if ($_REQUEST['action'] == 'dzsap_get_views_all') {

        $this->get_all_views();
        die();
      }
    }

    // -- get_views
    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_get_views') {


      $playerId = '';

      if (isset($_POST['playerid'])) {
        $playerId = $_POST['playerid'];
      }
      $ajaxResponse = array(
        'ajax_status' => 'success',
        'playerId' => $playerId,
      );


      $fileName = 'db-views';
      $playerid = '';

      if (isset($playerId) && $playerId) {
        $fileName .= $playerId;
      }

      $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';

      $ajaxResponse['file'] = $file;

      $fileContent = file_get_contents($file);
//      echo $current;
      $ajaxResponse['views'] = $fileContent;

      if (isset($_COOKIE['viewsubmitted-' . $playerid])) {
//        echo 'viewsubmitted';
      }



      echo json_encode($ajaxResponse);

      die();
    }


    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_submit_views') {

      $fileName = 'db-views';
      $playerId = '';

      if (isset($_POST['playerid'])) {
        $playerId = $_POST['playerid'];
      }

      $ajaxResponse = array(
        'ajax_status' => 'success',
      );


      if (isset($playerId)) {
        $fileName .= $playerId;
      }


      $ajaxResponse['playerid'] = $playerId;

      if (isset($dzsap_config) && $dzsap_config['type'] == 'portal') {

        echo $dzsap_portal->submit_view();
      } else {
        $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';

        $fileContent = '';
        if (file_exists($file)) {

          $fileContent = file_get_contents($file);
        }


        if ($fileContent == '') {
          $fileContent = 0;
        }
        $fileContent = intval($fileContent);


        if (CONSIDER_COOKIES_WHEN_PORTAL_ACTIONS === 'true' && isset($_COOKIE['viewsubmitted-' . $playerId])) {
          //echo $current;
          $ajaxResponse['ajax_status'] = 'fail';
          $ajaxResponse['ajax_message'] = 'has cookie';
        } else {
          $fileContent = $fileContent + 1;
          $ajaxResponse['nr_views'] = $fileContent;
          $ajaxResponse['file'] = $file;
          $confirmer = file_put_contents($file, $fileContent);
          //echo $current;
        }
        setcookie('viewsubmitted-' . $playerId, '1', time() + 36000);


        echo json_encode($ajaxResponse);


      }
      die();
    }
    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_submit_download') {

      $fileName = 'db-download';
      $playerid = '';

      if (isset($_POST['playerid'])) {
        $fileName .= $_POST['playerid'];
        $playerid = $_POST['playerid'];
      }


      if (isset($dzsap_config) && $dzsap_config['type'] == 'portal') {

        echo $dzsap_portal->submit_view();
      } else {
        $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';


        $fileContent = file_get_contents($file);

        if ($fileContent == '') {
          $fileContent = 0;
        }
        $fileContent = intval($fileContent);

        $confirmer = 'hascookie';

        if (isset($_COOKIE['downloadsubmitted-' . $playerid])) {
          //echo $current;
        } else {
          $fileContent = $fileContent + 1;
          $confirmer = file_put_contents($file, $fileContent);
          //echo $current;
        }
        setcookie('downloadsubmitted-' . $playerid, '1', time() + 36000);


        echo $confirmer;
      }
      die();
    }

    if (isset($_REQUEST['action']) && $_REQUEST['action'] == 'dzsap_shoutcast_get_streamtitle') {


//      echo 'dada';

//      print_r($_GET);
      //print_r($_COOKIE);

      $source = $_GET['source'];


      include_once "shoutcast_now_playing.php";

      echo shoutcast_get_now_playing($source);

      die();
    }
    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_get_comments') {


      $fileName = 'comments';
      $playerid = '';

      if (isset($_POST['playerid'])) {
        $fileName .= $_POST['playerid'];
        $playerid = $_POST['playerid'];
      }

      $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';
//    echo $file;
      $fileContent = '';
      if (file_exists($file)) {

        $fileContent = file_get_contents($file);
      }


      echo $fileContent;


      //print_r($_COOKIE);

      die();
    }

    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_get_pcm') {


      echo get_pcm($_POST['playerid'], $_POST['source']);


      //print_r($_COOKIE);

      die();
    }


    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_submit_pcm') {

      $fileName = 'pcm';

      if (isset($_POST['playerid'])) {
        $fileName .= dzs_clean($_POST['playerid']);
      }


      $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';
      $fileContent = '';


      $content = $_POST['postdata'];
      $fileContent = $content;
      $confirmer = file_put_contents($file, $fileContent);

      echo $confirmer;


      // TODO: temp
      die();


      die();
    }


    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_front_submitcomment') {

      $fileName = 'comments';

      if (isset($_POST['playerid'])) {
        $fileName .= $_POST['playerid'];
      }


      if (isset($dzsap_config) && $dzsap_config['type'] == 'portal') {

        echo $dzsap_portal->submit_comment();
      } else {
        $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';
        $fileContent = '';

        if (file_exists($file)) {
          $fileContent = file_get_contents($file);
        }


        $content = $_POST['postdata'];

        $content = '<span class="dzstooltip-con" style="left:' . $_POST['comm_position'] . '"><span class="dzstooltip arrow-from-start transition-slidein arrow-bottom skin-black" style="width: 250px;"><span class="the-comment-author">@' . $_POST['skinwave_comments_account'] . '</span> says:<br>';
        $content .= htmlentities($_POST['postdata']);


        $content .= '</span><div class="the-avatar" style="background-image: url(' . $_POST['skinwave_comments_avatar'] . ')"></div></span>';

        $fileContent .= $content;
        $confirmer = file_put_contents($file, $fileContent);

        echo $confirmer;
      }


      die();
    }


    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_submit_playlist_entry') {
      $dzsap_portal->submit_playlist_entry($_POST['playlistid'], $_POST['mediaid']);
    }

    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_retract_playlist_entry') {
      $dzsap_portal->retract_playlist_entry($_POST['playlistid'], $_POST['mediaid']);
    }


    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_get_rate') {


      $fileName = 'db-rates';
      $playerid = '';

      if (isset($_POST['playerid'])) {
        $fileName .= $_POST['playerid'];
        $playerid = $_POST['playerid'];
      }

      $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';

      $fileContent = file_get_contents($file);


      if (isset($_COOKIE['ratesubmitted-' . $playerid])) {
        $fileContent .= '|' . $_COOKIE['ratesubmitted-' . $playerid];
      }

      echo $fileContent;

      die();
    }


    if (isset($_GET['action']) && $_GET['action'] == 'rates') {
      $this->ajax_get_ratingData();
    }
    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_submit_rate') {
      $this->ajax_post_ratingData();
    }


    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_get_likes') {


      $fileName = 'db-likes';

      if (isset($_POST['playerid'])) {
        $fileName .= $_POST['playerid'];
        $playerid = $_POST['playerid'];
      }

      $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';

      $fileContent = file_get_contents($file);
      echo $fileContent;


      if (isset($_COOKIE['likesubmitted-' . $playerid])) {
        echo 'likesubmitted';
      }

      //print_r($_COOKIE);


      die();
    }


    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_submit_like') {


      $fileName = 'db-likes';
      $playerid = '';

      if (isset($_POST['playerid'])) {
        $fileName .= $_POST['playerid'];
        $playerid = $_POST['playerid'];
      }

      $ajaxResponse = array(
        'ajax_status' => 'success'
      );

      if (isset($dzsap_config) && $dzsap_config['type'] == 'portal') {

        echo $dzsap_portal->submit_like();
      } else {

        $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';


        $fileContent = file_get_contents($file);
        $fileContent = intval($fileContent);
        $ajaxResponse['file_contents'] = $fileContent;
        $fileContent = $fileContent + 1;
        $confirmer = file_put_contents($file, $fileContent);


        if (!$confirmer) {
          $ajaxResponse['ajax_status'] = 'error';
        } else {

          setcookie('likesubmitted-' . $playerid, '1', time() + 36000);
        }

      }


      echo json_encode($ajaxResponse);
      die();
    }
    if (isset($_POST['action']) && $_POST['action'] == 'dzsap_retract_like') {

      $fileName = 'db-likes';
      $playerid = '';

      if (isset($_POST['playerid'])) {
        $fileName .= $_POST['playerid'];
        $playerid = $_POST['playerid'];
      }

      $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';


      if (isset($dzsap_config) && $dzsap_config['type'] == 'portal') {

        echo $dzsap_portal->retract_like();
      } else {

        $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';


        $fileContent = file_get_contents($file);
        $fileContent = intval($fileContent);
        $fileContent = $fileContent - 1;
        $confirmer = file_put_contents($file, $fileContent);


        setcookie('likesubmitted-' . $playerid, '', time() - 36000);

        echo $confirmer;
      }


      die();
    }
  }

  function ajax_post_ratingData(){



    $playerid = '';
    $fileName = 'db-rates';

    if (isset($_POST['playerid'])) {
      $fileName .= $_POST['playerid'];
      $playerid = $_POST['playerid'];
    }


    if (isset($dzsap_config) && $dzsap_config['type'] == 'portal') {
      global $dzsap_portal;
      $dzsap_portal->submit_rating();
    } else {


      $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';
      $arrRateData = $this->getRatingData($playerid);

      $currentRate = $arrRateData['currentRate'];
      $rate_nr = $arrRateData['rateNumber'];

      if (!isset($_COOKIE['ratesubmitted-' . $playerid])) {
        $rate_nr++;
      }
      if ($rate_nr <= 0) {
        $rate_nr = 1;
      }

      $currentRate = ($currentRate * ($rate_nr - 1) + intval($_POST['postdata'])) / ($rate_nr);


      $outputFileContent = json_encode(array(
        'currentRate'=>$currentRate,
        'rateNumber'=>$rate_nr,
      ));


      $confirmer = file_put_contents($file, $outputFileContent);


      setcookie('ratesubmitted-' . $playerid, intval($_POST['postdata']), time() + 36000);

      echo json_encode(array(
        'playerId'=>$playerid,
        'postdata'=>$_POST['postdata'],
        'rate_index'=>$currentRate,
        'rate_nr'=>$rate_nr,
        'confirmer'=>$confirmer,
      ));
    }

    die();
  }

  function getRatingData($playerId){

    $fileName = 'db-rates';

    if ($playerId) {
      $fileName .= $playerId;
    }


    $file = DZSAPP_SOURCE_PATH . '/db/' . $fileName . '.html';
    $fileContent = file_get_contents($file);

    return DZSAP_Publisher::getRatingDataFromContent($fileContent);


  }

  function ajax_get_ratingData(){
    $playerId = $_GET['player_id'];
    echo json_encode($this->getRatingData($playerId));
    die();
  }

  /**
   * @param array $pargs
   */
  static function view_generatePlayer($pargs = array()) {


    $playerOpts = array_merge(array(
      'id' => '',
      'source' => '',
      'skin' => 'skin-wave',
      'thumbUri' => '',
      'extra_classes' => ' ',
      'php_handler_url' => ' ',
      'artistName' => '',
      'songName' => '',
      'isPlayInFooterPlayer' => false,
      'isAutoInit' => false,
    ), $pargs);
    $playerId = $playerOpts['id'];
    $source = $playerOpts['source'];


    $stringArtistName = '';
    $stringSongName = '';
    $stringPlayInFooterPlayer = '';

    if ($playerOpts['artistName']) {
      $stringArtistName = $playerOpts['artistName'];
    }

    $jsOptions = array(
      'autoplay' => 'off',
    );

    if ($playerOpts['isPlayInFooterPlayer']) {
      $stringPlayInFooterPlayer = ' data-fakeplayer=".dzsap_footer"';
    }

    if ($playerOpts['songName']) {
      $stringSongName = $playerOpts['songName'];
    }

    if ($playerOpts['php_handler_url']) {
      $jsOptions['settings_php_handler'] = $playerOpts['php_handler_url'];
    }

    $playerClasses = 'audioplayer-tobe  ' . $playerOpts['skin'] . ' ' . $playerOpts['extra_classes'];

    if ($playerOpts['isAutoInit']) {
      $playerClasses .= ' auto-init';
    }
    ?>
  <div data-thumb="<?= $playerOpts['thumbUri'] ?>" id="<?php echo $playerId; ?>" data-type="audio"
       class="<?= $playerClasses ?>" data-source="<?php echo $source; ?>"
    <?= $stringPlayInFooterPlayer ?> data-playfrom="0"
       data-options='<?= json_encode($jsOptions) ?>' <?php
  if (get_pcm($playerId, $source)) {
    echo ' data-pcm="' . get_pcm($playerId, $source) . '"';
  }
  ?>>
    <div class="feed-dzsap feed-artist-name"><?= $stringArtistName ?></div>
    <div class="feed-dzsap feed-song-name"><?= $stringSongName ?></div>
    </div><?php
  }

  function get_all_views() {

    $arr = array();


    $dir = $this->dir;
    $files1 = scandir($dir);

//        print_r($files1);

    foreach ($files1 as $fil) {
      if (strpos($fil, 'db-views') !== false) {
//                echo $fil;


        $current = file_get_contents($this->dir . $fil);


        $id = str_replace('db-views', '', $fil);
        $id = str_replace('.html', '', $id);


        $aux = array(
          'label' => $id,
          'views' => $current,
        );

        array_push($arr, $aux);


      }
    }

//        print_r($arr);

    echo json_encode($arr);
  }

  function misc_get_ip() {

    if (isset($_SERVER['HTTP_CLIENT_IP']) && !empty($_SERVER['HTTP_CLIENT_IP'])) {
      $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
      $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
      $ip = (isset($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
    }

    $ip = filter_var($ip, FILTER_VALIDATE_IP);
    $ip = ($ip === false) ? '0.0.0.0' : $ip;


    return $ip;
  }



  static function getRatingDataFromContent($fileContent = ''){


    $currentRate = 0;
    $rate_nr = 0;

    if(strpos($fileContent, '|')!==false){

      $current_arr = explode("|", $fileContent);


      if (count($current_arr) == 1 && $current_arr[0] == '') {
      } else {
        $currentRate = $current_arr[0];
        $rate_nr = intval($current_arr[1]);

        if ($currentRate == '' || $currentRate == ' ') {
          $currentRate = 0;
        }
      }
    }else{

      if($fileContent){

        try{
          return json_decode($fileContent, true);
        }catch (Exception $exception){

        }
      }
    }



    return array(
      'currentRate'=>$currentRate,
      'rateNumber'=>$rate_nr,
    );
  }

}

$dzsap_publisher = new DZSAP_Publisher();



//print_r($_POST);
