<?php

$configUrl = '../config/parameters.json';


if(isset($_GET['ban']))
{
    addBannedURL($_GET['ban'], $configUrl);
}

if(isset($_GET['clearbans']))
{
    clearBans($configUrl);
}

if(isset($_GET['hashtag']))
{
    // change hashtag
    changeHashtag($_GET['hashtag'],$configUrl);
}


function addBannedURL($urlString, $configUrl)
{
    if(preg_match('%instagram.com/p/%', $urlString)){
        $obj = json_decode(file_get_contents($configUrl));
        $obj->bans[] =  $urlString;

        $obj = json_encode($obj);
        file_put_contents($configUrl, $obj);
    }
}

function clearBans($configUrl)
{
    $obj = json_decode(file_get_contents($configUrl));
    $obj->bans = array();

    $obj = json_encode($obj);
    file_put_contents($configUrl, $obj);
}

function changeHashtag($hashtag, $configUrl)
{
    // Input validation needed for prod
    $obj = json_decode(file_get_contents($configUrl));
    $obj->hashtag =  $hashtag;

    $obj = json_encode($obj);
    file_put_contents($configUrl, $obj);
}
?>
