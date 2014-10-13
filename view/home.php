<?php
require_once('../includes/helper.php');
include('../../googleapikey.php');

$css = array('home');
$js = array('main');
$custom = array('<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=' . $map_api_key . '"></script>');
$resources = array(
    'title' => 'PROJECT2',
    'custom' => $custom,
    'css' => $css,
    'js' => $js
);

render('header', $resources);

?>
<div class="map-container">
    <div id="map-canvas"></div>
</div>
<div id="routes-list">

<?php
foreach ($results as $result) {
    echo "<p class=\"routes\" id=\"{$result[1]}\">{$result[1]} : {$result[0]}</p>";
}
?>


</div>


<?php

render('footer');
?>
