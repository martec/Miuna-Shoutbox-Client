<?php
/**
 * Miuna Shoutbox
 * https://github.com/martec
 *
 * Copyright (C) 2015-2015, Martec
 *
 * Miuna Shoutbox is licensed under the GPL Version 3, 29 June 2007 license:
 *	http://www.gnu.org/copyleft/gpl.html
 *
 * @fileoverview Miuna Shoutbox - Websocket Shoutbox for Mybb
 * @author Martec
 * @requires jQuery, Nodejs, Socket.io, Express, MongoDB, mongoose, debug and Mybb
 */
$l['miunashoutbox_plug_desc'] = 'Websocket Shout for Mybb.';
$l['miunashoutbox_sett_desc'] = 'Settings for the Miuna Shoutbox.';
$l['miunashoutbox_onoff_title'] = 'Enable Miuna Shoutbox?';
$l['miunashoutbox_onoff_desc'] = 'Set here if you want enable or disable Miuna Shoutbox.';
$l['miunashoutbox_heigh_title'] = 'Shoutbox height';
$l['miunashoutbox_heigh_desc'] = 'Set here height of Shoutbox (value in px).';
$l['miunashoutbox_shoutlimit_title'] = 'Amount of shouts';
$l['miunashoutbox_shoutlimit_desc'] = 'Set here amount of shouts that will appear in shout area.';
$l['miunashoutbox_logshoutlimit_title'] = 'Amount of shouts in log (archive)';
$l['miunashoutbox_logshoutlimit_desc'] = 'Set here amount of shouts that will appear in log (archive).';
$l['miunashoutbox_nogrp_title'] = 'Group without permission to use';
$l['miunashoutbox_nogrp_desc'] = 'Set here group that does not has permission to use Miuna Shoutbox.';
$l['miunashoutbox_mod_title'] = 'Mod Group';
$l['miunashoutbox_mod_desc'] = 'Set here group with moderation privilege.';
$l['miunashoutbox_guest_title'] = 'Read mode to guest';
$l['miunashoutbox_guest_desc'] = 'Guest not has access to this shout. But you can enable read only mode to guest here.';
$l['miunashoutbox_shout_title'] = 'Title of Miuna Shoutbox';
$l['miunashoutbox_shout_desc'] = 'Set here title of shoutbox that will appear.';
$l['miunashoutbox_server_title'] = 'Link to Miuna Shoutbox server';
$l['miunashoutbox_server_desc'] = 'Set here your Miuna Shoutbox server address.';
$l['miunashoutbox_socketio_title'] = 'Socket.io address';
$l['miunashoutbox_socketio_desc'] = 'Set here adress that miuna shout box will connect.<br />For openshift users recommended "wss://xxxxxx.rhcloud.com:8443" (replacing xxxxxx with your account).';
$l['miunashoutbox_imgur_title'] = 'Imgur';
$l['miunashoutbox_imgur_desc'] = 'Set here API of imgur.';
$l['miunashoutbox_dataf_title'] = 'Date Format';
$l['miunashoutbox_dataf_desc'] = 'Set here date format (Options of format you can check in http://momentjs.com/docs/).';
$l['miunashoutbox_antiflood_title'] = 'Anti flood system';
$l['miunashoutbox_antiflood_desc'] = 'Set here time in secound that user need wait before to shout another message. Set 0 to disable this feature.';
$l['miunashoutbox_newpost_title'] = 'Shout new post';
$l['miunashoutbox_newpost_desc'] = 'Shout when someone post in thread.';
$l['miunashoutbox_newthread_title'] = 'Shout new thread';
$l['miunashoutbox_newthread_desc'] = 'Shout when someone post new thread.';
$l['miunashoutbox_foldacc_title'] = 'Folder ignored by Shout new post and Shout new thread';
$l['miunashoutbox_foldacc_desc'] = 'Set here folder that Miuna Shoutbox will ignore when someone post in forum (value in id).<br />Separate each forum id with comma.';
$l['miunashoutbox_newptcolor_title'] = 'Color for new thread and new post shout';
$l['miunashoutbox_newptcolor_desc'] = 'Set here color for new thread and new post shout.';
$l['miunashoutbox_oncolor_title'] = 'Online border color';
$l['miunashoutbox_oncolor_desc'] = 'Set border color to online users.';
$l['miunashoutbox_mentstyle_title'] = 'Mention border style';
$l['miunashoutbox_mentstyle_desc'] = 'Set border style to mention.';
$l['miunashoutbox_edtcolor_title'] = 'Background color to edited shout';
$l['miunashoutbox_edtcolor_desc'] = 'Set background color to edited shout.';
$l['miunashoutbox_zone_title'] = 'Timezone';
$l['miunashoutbox_zone_desc'] = 'Set your Timezone here.';
$l['miunashoutbox_shoutstart_title'] = 'Display direction of shouts';
$l['miunashoutbox_shoutstart_desc'] = 'Choice display direction.';
$l['miunashoutbox_shoutstart_opt'] = 'top=Top
bottom=Bottom';
$l['miunashoutbox_actaimg_title'] = 'Active auto image load?';
$l['miunashoutbox_actaimg_desc'] = 'Set if you want active auto image load. If you select yes, Miuna Shoutbox will load image link automatically.';
$l['miunashoutbox_limcharact_title'] = 'Character limit';
$l['miunashoutbox_limcharact_desc'] = 'Set character limit here. Set 0 to disable this feature.';
$l['miunashoutbox_aavatar_title'] = 'Active avatar in Miuna Shoutbox?';
$l['miunashoutbox_aavatar_desc'] = 'Set if you want active avatar in Miuna Shoutbox. If you select yes, Miuna Shoutbox will show avatar.';
$l['miunashoutbox_acolor_title'] = 'Active color in Miuna Shoutbox?';
$l['miunashoutbox_acolor_desc'] = 'Set if you want active color in Miuna Shoutbox. If you select yes, Miuna Shoutbox will give color option to users.';
$l['miunashoutbox_mcolor_title'] = 'Color for user name to mod group of Miuna Shoutbox';
$l['miunashoutbox_mcolor_desc'] = 'Set here color for user name to mod group of Miuna Shoutbox.';
$l['miunashoutbox_ccolor_title'] = 'Color for user name to common user group of Miuna Shoutbox';
$l['miunashoutbox_ccolor_desc'] = 'Set here color for user name to common user group of Miuna Shoutbox.';
$l['miunashoutbox_destindx_title'] = 'Hide Miuna Shoutbox in Index page?';
$l['miunashoutbox_destindx_desc'] = 'Set here if you want hide shoutbox in index or not.';
$l['miunashoutbox_actport_title'] = 'Show Miuna Shoutbox in Portal page?';
$l['miunashoutbox_actport_desc'] = 'Set here if you want show shoutbox in portal or not.';
$l['miunashoutbox_newpost_lang'] = 'posted in thread {1}';
$l['miunashoutbox_newthread_lang'] = 'posted new thread {1}';
?>