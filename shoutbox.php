<?php

define('IN_MYBB', 1);
define('THIS_SCRIPT', 'shoutbox.php');

$templatelist = "shoutbox";

require_once "./global.php";

// Load global language phrases
$lang->load("miunashoutbox");

$plugins->run_hooks('shoutbox_start');

// Make navigation
add_breadcrumb($mybb->settings['miunashout_title'], "shoutbox.php");

if ($mybb->settings['miunashout_online'] != 1 || in_array((int)$mybb->user['usergroup'], explode(',', $mybb->settings['miunashout_grups_acc'])) ||
        ($mybb->user['uid'] == 0 && $settings['miunashout_guest'] != 1))
{
    error_no_permission();
}

$plugins->run_hooks('shoutbox_end');

eval("\$page = \"".$templates->get("shoutbox")."\";");
output_page($page);
