<?php

require_once('../includes/helper.php');
require_once('../model/model.php');


$results = get_available_routes();







render('home', array('results' => $results));


// END
