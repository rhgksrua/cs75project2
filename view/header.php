<!DOCTYPE html>
<html>
    <head>
        <title><?php echo isset($title) ? $title : ''; ?></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
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

        <link rel="stylesheet" media="(max-width: 640px)" href="css/small.css">
        <link rel="stylesheet" media="(min-width: 640px)" href="css/large.css">
    </head>
    <body>
