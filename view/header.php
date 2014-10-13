<!DOCTYPE html>
<html>
    <head>
        <title><?php echo isset($title) ? $title : ''; ?></title>

<?php
// add css
if (isset($css)) {
    foreach ($css as $item) {
        print "<link rel='stylesheet' href='css/{$item}.css'></link>";
    }
}
if (isset($custom)) {
    foreach ($custom as $item) {
        print $item;
    }
}
// add javascript
if (isset($js)) {
    foreach ($js as $item) {
        print "<script type='text/javascript' src='js/{$item}.js'></script>";
    }
}
?>

    </head>
    <body>
