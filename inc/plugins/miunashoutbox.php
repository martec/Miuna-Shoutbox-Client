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

// Disallow direct access to this file for security reasons
if(!defined("IN_MYBB"))
{
	die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

define('MSB_PLUGIN_VER', '1.0.8');

function miunashoutbox_info()
{
	global $lang;

	$lang->load('config_miunashoutbox');

	return array(
		"name"			=> "Miuna Shout Box",
		"description"	=> $lang->miunashoutbox_plug_desc,
		"author"		=> "martec",
		"authorsite"	=> "",
		"version"		=> MSB_PLUGIN_VER,
		"compatibility" => "18*"
	);
}

function miunashoutbox_install()
{
	global $db, $lang;

	$lang->load('config_miunashoutbox');

	$groupid = $db->insert_query('settinggroups', array(
		'name'		=> 'miunashoutbox',
		'title'		=> 'Miuna Shoutbox',
		'description'	=> $lang->miunashoutbox_sett_desc,
		'disporder'	=> $dorder,
		'isdefault'	=> '0'
	));

	$miunashout_setting[] = array(
		'name' => 'miunashout_online',
		'title' => $lang->miunashoutbox_onoff_title,
		'description' => $lang->miunashoutbox_onoff_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 1,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_height',
		'title' => $lang->miunashoutbox_heigh_title,
		'description' => $lang->miunashoutbox_heigh_desc,
		'optionscode' => 'numeric',
		'value' => '200',
		'disporder' => 2,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_num_shouts',
		'title' => $lang->miunashoutbox_shoutlimit_title,
		'description' => $lang->miunashoutbox_shoutlimit_desc,
		'optionscode' => 'numeric',
		'value' => '25',
		'disporder' => 3,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_lognum_shouts',
		'title' => $lang->miunashoutbox_logshoutlimit_title,
		'description' => $lang->miunashoutbox_logshoutlimit_desc,
		'optionscode' => 'numeric',
		'value' => '50',
		'disporder' => 4,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_grups_acc',
		'title' => $lang->miunashoutbox_nogrp_title,
		'description' => $lang->miunashoutbox_nogrp_desc,
		'optionscode' => 'groupselect',
		'value' => '7',
		'disporder' => 5,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_mod_grups',
		'title' => $lang->miunashoutbox_mod_title,
		'description' => $lang->miunashoutbox_mod_desc,
		'optionscode' => 'groupselect',
		'value' => '3,4,6',
		'disporder' => 6,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_guest',
		'title' => $lang->miunashoutbox_guest_title,
		'description' => $lang->miunashoutbox_guest_desc,
		'optionscode' => 'yesno',
		'value' => '0',
		'disporder' => 7,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_title',
		'title' => $lang->miunashoutbox_shout_title,
		'description' => $lang->miunashoutbox_shout_desc,
		'optionscode' => 'text',
		'value' => 'Miuna Shoutbox',
		'disporder' => 8,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_server',
		'title' => $lang->miunashoutbox_server_title,
		'description' => $lang->miunashoutbox_server_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 9,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_socketio',
		'title' => $lang->miunashoutbox_socketio_title,
		'description' => $lang->miunashoutbox_socketio_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 10,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_imgurapi',
		'title' => $lang->miunashoutbox_imgur_title,
		'description' => $lang->miunashoutbox_imgur_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 11,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_dataf',
		'title' => $lang->miunashoutbox_dataf_title,
		'description' => $lang->miunashoutbox_dataf_desc,
		'optionscode' => 'text',
		'value' => 'DD/MM hh:mm A',
		'disporder' => 12,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_antiflood',
		'title' => $lang->miunashoutbox_antiflood_title,
		'description' => $lang->miunashoutbox_antiflood_desc,
		'optionscode' => 'numeric',
		'value' => '0',
		'disporder' => 13,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_newpost',
		'title' => $lang->miunashoutbox_newpost_title,
		'description' => $lang->miunashoutbox_newpost_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 14,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_newthread',
		'title' => $lang->miunashoutbox_newthread_title,
		'description' => $lang->miunashoutbox_newthread_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 15,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_folder_acc',
		'title' => $lang->miunashoutbox_foldacc_title,
		'description' => $lang->miunashoutbox_foldacc_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 16,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_newpt_style',
		'title' => $lang->miunashoutbox_newptstyle_title,
		'description' => $lang->miunashoutbox_newptstyle_desc,
		'optionscode' => 'text',
		'value' => 'font-size: 14px',
		'disporder' => 17,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_on_color',
		'title' => $lang->miunashoutbox_oncolor_title,
		'description' => $lang->miunashoutbox_oncolor_desc,
		'optionscode' => 'text',
		'value' => 'green',
		'disporder' => 18,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_ment_style',
		'title' => $lang->miunashoutbox_mentstyle_title,
		'description' => $lang->miunashoutbox_mentstyle_desc,
		'optionscode' => 'text',
		'value' => '5px solid #cd0e0a',
		'disporder' => 19,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_edt_backcolor',
		'title' => $lang->miunashoutbox_edtcolor_title,
		'description' => $lang->miunashoutbox_edtcolor_desc,
		'optionscode' => 'text',
		'value' => '#f5caca',
		'disporder' => 20,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_zone',
		'title' => $lang->miunashoutbox_zone_title,
		'description' => $lang->miunashoutbox_zone_desc,
		'optionscode' => 'text',
		'value' => '-3',
		'disporder' => 21,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_styles_font',
		'title' => $lang->miunashoutbox_stfont_title,
		'description' => $lang->miunashoutbox_stfont_desc,
		'optionscode' => 'textarea',
		'value' => 'Arial\r\nArial Black\r\nArial Narrow\r\nBook Antiqua\r\nCentury Gothic\r\nComic Sans MS\r\nCourier New\r\nFixedsys\r\nFranklin Gothic Medium\r\nGaramond\r\nGeorgia\r\nImpact\r\nLucida Console\r\nMicrosoft Sans Serif\r\nPalatino Linotype\r\nSystem\r\nTahoma\r\nTimes New Roman\r\nTrebuchet MS\r\nVerdana',
		'disporder' => 22,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_styles_size',
		'title' => $lang->miunashoutbox_sizfont_title,
		'description' => $lang->miunashoutbox_sizfont_desc,
		'optionscode' => 'textarea',
		'value' => '11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18',
		'disporder' => 23,
		'gid'		=> $groupid
	);
	$miunashout_setting[] = array(
		'name' => 'miunashout_shouts_start',
		'title' => $lang->miunashoutbox_shoutstart_title,
		'description' => $lang->miunashoutbox_shoutstart_desc,
		'optionscode' => 'radio
'.$lang->miunashoutbox_shoutstart_opt.'',
		'value' => 'bottom',
		'disporder' => 24,
		'gid'		=> $groupid
	);

	$db->insert_query_multiple("settings", $miunashout_setting);
	rebuild_settings();

}

function miunashoutbox_uninstall()
{

	global $db;

	//Delete Settings
	$db->write_query("DELETE FROM ".TABLE_PREFIX."settings WHERE name IN(
		'miunashout_online',
		'miunashout_height',
		'miunashout_num_shouts',
		'miunashout_grups_acc',
		'miunashout_mod_grups',
		'miunashout_guest',
		'miunashout_title',
		'miunashout_server',
		'miunashout_socketio'
		'miunashout_imgurapi',
		'miunashout_dataf',
		'miunashout_antiflood',
		'miunashout_newpost',
		'miunashout_newthread',
		'miunashout_folder_acc',
		'miunashout_newpt_style',
		'miunashout_on_color',
		'miunashout_ment_style',
		'miunashout_edt_backcolor',
		'miunashout_zone',
		'miunashout_styles_font',
		'miunashout_styles_size',
		'miunashout_shouts_start'
	)");

	$db->delete_query("settinggroups", "name = 'miunashoutbox'");
	rebuild_settings();

}

function miunashoutbox_is_installed()
{
	global $db;

	$query = $db->simple_select("settinggroups", "COUNT(*) as rows", "name = 'miunashoutbox'");
	$rows  = $db->fetch_field($query, 'rows');

	return ($rows > 0);
}

function miunashoutbox_activate()
{

	global $db;
	require MYBB_ROOT.'/inc/adminfunctions_templates.php';

	$new_template_global['codebutmiuna'] = "<link href=\"{\$mybb->asset_url}/jscripts/miuna/shoutbox/style.css?ver=".MSB_PLUGIN_VER."\" rel='stylesheet' type='text/css'>
<script src=\"{\$mybb->settings['miunashout_server']}/socket.io/socket.io.js\"></script>
<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/select2/3.5.2/select2.min.css\">
<script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/select2/3.5.2/select2.min.js\"></script>
<script type=\"text/javascript\">
if (typeof io == 'undefined') {
	document.write(unescape(\"%3Cscript src='//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.2/socket.io.min.js' type='text/javascript'%3E%3C/script%3E\"));
}
</script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js'></script>
<link rel=\"stylesheet\" href=\"{\$mybb->asset_url}/jscripts/sceditor/editor_themes/{\$theme['editortheme']}\" type=\"text/css\" media=\"all\" />
<link rel=\"stylesheet\" href=\"{\$mybb->asset_url}/jscripts/sceditor/editor_themes/esb.css\" type=\"text/css\" media=\"all\" />
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/sceditor/jquery.sceditor.bbcode.min.js?ver=".MSB_PLUGIN_VER."\"></script>
<script type=\"text/javascript\">
<!--
	var add_spolang = '{\$lang->miunashoutbox_add_spoiler}',
	spo_lan = '{\$lang->miunashoutbox_spoiler}',
	show_lan = '{\$lang->miunashoutbox_show}',
	hide_lan = '{\$lang->miunashoutbox_hide}',
	pm_lan = '{\$lang->miunashoutbox_sel_pm}',
	pm_fromlan = '{\$lang->miunashoutbox_pm_from}',
	pm_tolan = '{\$lang->miunashoutbox_pm_to}',
	updconfiglan = '{\$lang->miunashoutbox_update_config}',
	upimgurlang = '{\$lang->miunashoutbox_up_imgur}',
	usractlan = '{\$lang->miunashoutbox_user_ative}',
	mes_emptylan = '{\$lang->miunashoutbox_mes_empty}',
	usr_banlang = '{\$lang->miunashoutbox_user_banned}',
	flood_msglan = '{\$lang->miunashoutbox_flood_msg}',
	secounds_msglan = '{\$lang->miunashoutbox_flood_scds}',
	log_htmllan = '{\$lang->miunashoutbox_log_html}',
	log_msglan = '{\$lang->miunashoutbox_log_msg}',
	log_shoutlan = '{\$lang->miunashoutbox_log_shout}',
	log_nextlan = '{\$lang->miunashoutbox_log_next}',
	log_backlan = '{\$lang->miunashoutbox_log_back}',
	prune_shoutlan = '{\$lang->miunashoutbox_prune_shout}',
	ban_msglan = '{\$lang->miunashoutbox_ban_msg}',
	not_msglan = '{\$lang->miunashoutbox_notice_msg}',
	prune_msglan = '{\$lang->miunashoutbox_prune_msg}',
	del_msglan = '{\$lang->miunashoutbox_del_mesg}',
	opt_msglan = '{\$lang->miunashoutbox_opt}',
	banlist_modmsglan = '{\$lang->miunashoutbox_banlist_mod}',
	not_modmsglan = '{\$lang->miunashoutbox_notice_mod}',
	shout_prunedmsglan = '{\$lang->miunashoutbox_pruned}',
	conf_questlan = '{\$lang->miunashoutbox_conf_quest}',
	shout_yeslan = '{\$lang->miunashoutbox_yes}',
	shout_nolan = '{\$lang->miunashoutbox_no}',
	shout_savelan = '{\$lang->miunashoutbox_save}',
	shout_delan = '{\$lang->miunashoutbox_del_msg}',
	cancel_editlan = '{\$lang->miunashoutbox_cancel_edt}',
	perm_msglan = '{\$lang->miunashoutbox_user_permission}',
	numshouts = '{\$mybb->settings['miunashout_num_shouts']}',
	direction = '{\$mybb->settings['miunashout_shouts_start']}',
	zoneset = '{\$mybb->settings['miunashout_zone']}',
	zoneformt = '{\$mybb->settings['miunashout_dataf']}',
	shout_height = '{\$mybb->settings['miunashout_height']}',
	theme_borderwidth = '{\$theme['borderwidth']}',
	theme_tablespace = '{\$theme['tablespace']}',
	imgurapi = '{\$mybb->settings['miunashout_imgurapi']}',
	orgtit = document.title,
	on_color = '{\$mybb->settings['miunashout_on_color']}',
	ment_borderstyle = '{\$mybb->settings['miunashout_ment_style']}',
	edt_color = '{\$mybb->settings['miunashout_edt_backcolor']}',
	floodtime = '{\$mybb->settings['miunashout_antiflood']}',
	mpp = '{\$mybb->settings['miunashout_lognum_shouts']}',
	socket = io.connect('{\$mybb->settings['miunashout_socketio']}');
// -->
</script>
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/miuna/shoutbox/miunashout.helper.min.js?ver=".MSB_PLUGIN_VER."\"></script>
<script type=\"text/javascript\">
miuna_smilies = {
	{\$smilies_json}
},
opt_editor = {
	plugins: \"bbcode\",
	style: \"{\$mybb->asset_url}/jscripts/sceditor/textarea_styles/jquery.sceditor.{\$theme['editortheme']}\",
	rtl: {\$lang->settings['rtl']},
	locale: \"mybblang\",
	enablePasteFiltering: true,
	emoticonsEnabled: {\$emoticons_enabled},
	emoticons: {
		// Emoticons to be included in the dropdown
		dropdown: {
			{\$dropdownsmilies}
		},
		// Emoticons to be included in the more section
		more: {
			{\$moresmilies}
		},
		// Emoticons that are not shown in the dropdown but will still be converted. Can be used for things like aliases
		hidden: {
			{\$hiddensmilies}
		}
	},
	emoticonsCompat: true,
	toolbar: \"spoiler,emoticon,imgur\",
};
{\$editor_language}

\$(document).ready(function() {
	\$('#shout_text').height('70px');
	\$('#shout_text').sceditor(opt_editor);
	\$('#shout_text').next().css(\"z-index\", \"1\");
	\$('#shout_text').sceditor('instance').sourceMode(true);
	miunashout({\$mybb->user['uid']}, '{\$mybb->user['username']}', '{\$name_link}', {\$mybb->user['usergroup']}, '{\$mybb->settings['miunashout_mod_grups']}');
});

</script>";

	$new_template_global['templateShoutBox'] = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"4\" class=\"tborder tShout\">
	<thead>
		<tr>
			<td class=\"thead theadShout\" colspan=\"1\">
				<div class=\"expcolimage\"><img src=\"images/collapse.png\" id=\"edshout_img\" class=\"expander\" alt=\"[-]\" title=\"[-]\" /></div>
				<div><strong>{\$mybb->settings['miunashout_title']}</strong></div>
			</td>
		</tr>
	</thead>
	<tbody id=\"edshout_e\">
		<tr><td class=\"tcat\"><span class=\"smalltext\"><strong><span>{\$lang->miunashoutbox_notice_msg} : </span><span class='notshow'></span></strong></span></td></tr>
		<tr>
			<td class=\"trow2\">
				<div class=\"contentShout\">
					<div class=\"shouttab tabShout selected\">{\$mybb->settings['miunashout_title']}</div>
					<div class=\"actusr tabShout\">{\$lang->miunashoutbox_user_ative}</div>
					<div class=\"shoutarea wrapShout\" style=\"height:{\$mybb->settings['miunashout_height']}px;\"></div>
					<div class=\"wrapShout numusr\" style=\"height:{\$mybb->settings['miunashout_height']}px;display:none;\"></div>
					<form id=\"miunashoutbox-form\">
						<input type=\"text\" name=\"shout_text\" class=\"editorShout\" id=\"shout_text\" data-type=\"shout\" autocomplete=\"off\">{\$codebutmiuna}
					</form>
				</div>
			</td>
		</tr>
	</tbody>
</table>";

	$new_template_global['templateShoutBoxGuest'] = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"4\" class=\"tborder tShout\">
	<thead>
		<tr>
			<td class=\"thead theadShout\" colspan=\"1\">
				<div class=\"expcolimage\"><img src=\"images/collapse.png\" id=\"edshout_img\" class=\"expander\" alt=\"[-]\" title=\"[-]\" /></div>
				<div><strong>{\$mybb->settings['miunashout_title']}</strong></div>
			</td>
		</tr>
	</thead>
	<tbody id=\"edshout_e\">
		<tr><td class=\"tcat\"><span class=\"smalltext\"><strong><span>{\$lang->miunashoutbox_notice_msg} : </span><span class='notshow'></span></strong></span></td></tr>
		<tr>
			<td class=\"trow2\">
				<div class=\"contentShout\">
					<div class=\"shouttab tabShout selected\">{\$mybb->settings['miunashout_title']}</div>
					<div class=\"actusr tabShout\">{\$lang->miunashoutbox_user_ative}</div>
					<div class=\"shoutarea wrapShout\" style=\"height:{\$mybb->settings['miunashout_height']}px;\"></div>
					<div class=\"wrapShout numusr\" style=\"height:{\$mybb->settings['miunashout_height']}px;display:none;\"></div>
				</div>
			</td>
		</tr>
	</tbody>
</table>
<link href=\"{\$mybb->asset_url}/jscripts/miuna/shoutbox/style.css?ver=".MSB_PLUGIN_VER."\" rel='stylesheet' type='text/css'>
<script src=\"{\$mybb->settings['miunashout_server']}/socket.io/socket.io.js\"></script>
<script type=\"text/javascript\">
if (typeof io == 'undefined') {
	document.write(unescape(\"%3Cscript src='//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.2/socket.io.min.js' type='text/javascript'%3E%3C/script%3E\"));
}
</script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js'></script>
<script type=\"text/javascript\">
<!--
	var add_spolang = '{\$lang->miunashoutbox_add_spoiler}',
	spo_lan = '{\$lang->miunashoutbox_spoiler}',
	show_lan = '{\$lang->miunashoutbox_show}',
	hide_lan = '{\$lang->miunashoutbox_hide}',
	pm_fromlan = '{\$lang->miunashoutbox_pm_from}',
	pm_tolan = '{\$lang->miunashoutbox_pm_to}',
	updconfiglan = '{\$lang->miunashoutbox_update_config}',
	upimgurlang = '{\$lang->miunashoutbox_up_imgur}',
	usractlan = '{\$lang->miunashoutbox_user_ative}',
	mes_emptylan = '{\$lang->miunashoutbox_mes_empty}',
	usr_banlang = '{\$lang->miunashoutbox_user_banned}',
	flood_msglan = '{\$lang->miunashoutbox_flood_msg}',
	secounds_msglan = '{\$lang->miunashoutbox_flood_scds}',
	log_msglan = '{\$lang->miunashoutbox_log_msg}',
	log_shoutlan = '{\$lang->miunashoutbox_log_shout}',
	log_nextlan = '{\$lang->miunashoutbox_log_next}',
	log_backlan = '{\$lang->miunashoutbox_log_back}',
	prune_shoutlan = '{\$lang->miunashoutbox_prune_shout}',
	ban_msglan = '{\$lang->miunashoutbox_ban_msg}',
	not_msglan = '{\$lang->miunashoutbox_notice_msg}',
	prune_msglan = '{\$lang->miunashoutbox_prune_msg}',
	del_msglan = '{\$lang->miunashoutbox_del_mesg}',
	opt_msglan = '{\$lang->miunashoutbox_opt}',
	banlist_modmsglan = '{\$lang->miunashoutbox_banlist_mod}',
	not_modmsglan = '{\$lang->miunashoutbox_notice_mod}',
	shout_prunedmsglan = '{\$lang->miunashoutbox_pruned}',
	conf_questlan = '{\$lang->miunashoutbox_conf_quest}',
	shout_yeslan = '{\$lang->miunashoutbox_yes}',
	shout_nolan = '{\$lang->miunashoutbox_no}',
	shout_savelan = '{\$lang->miunashoutbox_save}',
	shout_delan = '{\$lang->miunashoutbox_del_msg}',
	cancel_editlan = 'Cancelar a edição',
	perm_msglan = '{\$lang->miunashoutbox_user_permission}',
	numshouts = '{\$mybb->settings['miunashout_num_shouts']}',
	direction = '{\$mybb->settings['miunashout_shouts_start']}',
	zoneset = '{\$mybb->settings['miunashout_zone']}',
	zoneformt = '{\$mybb->settings['miunashout_dataf']}',
	shout_height = '{\$mybb->settings['miunashout_height']}',
	theme_borderwidth = '{\$theme['borderwidth']}',
	theme_tablespace = '{\$theme['tablespace']}',
	imgurapi = '{\$mybb->settings['miunashout_imgurapi']}',
	orgtit = document.title,
	on_color = '{\$mybb->settings['miunashout_on_color']}',
	ment_borderstyle = '{\$mybb->settings['miunashout_ment_style']}',
	edt_color = '{\$mybb->settings['miunashoutbox_edtcolor_desc']}',
	floodtime = '{\$mybb->settings['miunashout_antiflood']}',
	mpp = '{\$mybb->settings['miunashout_lognum_shouts']}',
	socket = io.connect('{\$mybb->settings['miunashout_socketio']}');
// -->
</script>
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/miuna/shoutbox/miunashout.helper.guest.min.js?ver=".MSB_PLUGIN_VER."\"></script>
<script type=\"text/javascript\">
miuna_smilies = {
	{\$smilies_json}
};
\$(document).ready(function() {
	miunashout({\$mybb->user['uid']}, '{\$lang->guest}', '{\$lang->guest}', {\$mybb->user['usergroup']}, '{\$mybb->settings['miunashout_mod_grups']}');
});

</script>";

	foreach($new_template_global as $title => $template)
	{
		$new_template_global = array('title' => $db->escape_string($title), 'template' => $db->escape_string($template), 'sid' => '-1', 'version' => '1801', 'dateline' => TIME_NOW);
		$db->insert_query('templates', $new_template_global);
	}

	$new_template['usercp_miuna_config'] = "<html>
<head>
<title>{\$mybb->settings['bbname']} - {\$mybb->settings['miunashout_title']} {\$lang->miunashoutbox_style}</title>
{\$headerinclude}
<script type=\"text/javascript\">
\$(document).ready(function(){
	sb_sty = JSON.parse(localStorage.getItem('sb_st_lc'))
	if (!sb_sty) {
		return;
	}
	else {
		\$(\"#Bold\").find(\"option[value=\" + sb_sty['bold'] +\"]\").attr('selected', true);
		\$(\"#Italic\").find(\"option[value=\" + sb_sty['em'] +\"]\").attr('selected', true);
		\$(\"#Underline\").find(\"option[value=\" + sb_sty['und'] +\"]\").attr('selected', true);
		\$(\"#Strike\").find(\"option[value=\" + sb_sty['strike'] +\"]\").attr('selected', true);
		if (sb_sty['color']!=undefined) {
			\$(\"#font_color\").val(\"\"+ sb_sty['color'] +\"\");
		}
		\$(\"#fontsize\").find(\"option[value=\" + sb_sty['size'] +\"]\").attr('selected', true);
		\$(\"#fontsty\").find(\"option[value='\" + sb_sty['font'] +\"']\").attr('selected', true);
	}
});
(\$.fn.on || \$.fn.live).call(\$(document), 'click', '#update', function (e) {
	e.preventDefault();
	var sb_sty = JSON.parse(localStorage.getItem('sb_st_lc'));
	sb_sty_ft = JSON.parse(localStorage.getItem('sb_st_ft'));
	if (!sb_sty) {
		sb_sty = {};
	}
	if (!sb_sty_ft) {
		sb_sty_ft = {};
	}
	var	color = '', size = '', font = '', bold = '', em = '', und = '', strike = '';
	sb_sty['color'] = \$(\"#font_color\").val();
	sb_sty['size'] = \$(\"#fontsize option:selected\").val();
	sb_sty['font'] = \$(\"#fontsty option:selected\").val();
	sb_sty['bold'] = \$(\"#Bold option:selected\").val();
	sb_sty['em'] = \$(\"#Italic option:selected\").val();
	sb_sty['und'] = \$(\"#Underline option:selected\").val();
	sb_sty['strike'] = \$(\"#Strike option:selected\").val();
	localStorage.setItem('sb_st_lc', JSON.stringify(sb_sty));

	if (\$(\"#Bold option:selected\").val()==1) {
		bold = \"bold\";
	}
	if (\$(\"#Italic option:selected\").val()==1) {
		em = \"italic\";
	}
	if (\$(\"#Underline option:selected\").val()==1) {
		und = \"underline\";
	}
	if (\$(\"#Strike option:selected\").val()==1) {
		strike = \"line-through\";
	}

	var fmtsty = \"color: \"+sb_sty['color']+\";font-size: \"+sb_sty['size']+\"px;font-family: \"+sb_sty['font']+\";font-weight: \"+bold+\"; font-style: \"+em+\"; text-decoration: \"+und+\"; text-decoration: \"+strike+\";\";
	sb_sty_ft['ft_sty'] = fmtsty;
	localStorage.setItem('sb_st_ft', JSON.stringify(sb_sty_ft));
	if(!\$('#upd_alert').length) {
		\$('<div/>', { id: 'upd_alert', class: 'bottom-right' }).appendTo('body');
	}
	setTimeout(function() {
		\$('#upd_alert').jGrowl('{\$lang->miunashoutbox_update_saved}', { life: 500 });
	},200);
});
</script>
</head>
<body>
{\$header}
<table width=\"100%\" border=\"0\" align=\"center\">
	<tr>
		{\$usercpnav}
		<td valign=\"top\"	id=\"confload\">
			<table border=\"0\" cellspacing=\"{\$theme['borderwidth']}\" cellpadding=\"{\$theme['tablespace']}\" class=\"tborder\">
				<tr>
					<td class=\"thead\" colspan=\"2\">
						<strong>{\$mybb->settings['miunashout_title']} {\$lang->miunashoutbox_style}</strong>
					</td>
				</tr>
				<tr>
					<td class=\"tcat\" colspan=\"2\">
						<strong>{\$lang->miunashoutbox_title_for_type}</strong>
					</td>
				</tr>
				<tr>
					<td class=\"trow1\" width=\"40%\">
						<strong>{\$lang->miunashoutbox_bold}?</strong>
					</td>
					<td class=\"trow1\" width=\"60%\">
						<select id={\$lang->miunashoutbox_bold}>
							<option value=\"0\">{\$lang->miunashoutbox_no}</option>
							<option value=\"1\">{\$lang->miunashoutbox_yes}</option>
						</select>
					</td>
				</tr>
				<tr>
					<td class=\"trow1\" width=\"40%\">
						<strong>{\$lang->miunashoutbox_italic}?</strong>
					</td>
					<td class=\"trow1\" width=\"60%\">
						<select id={\$lang->miunashoutbox_italic}>
							<option value=\"0\">{\$lang->miunashoutbox_no}</option>
							<option value=\"1\">{\$lang->miunashoutbox_yes}</option>
						</select>
					</td>
				</tr>
				<tr>
					<td class=\"trow1\" width=\"40%\">
						<strong>{\$lang->miunashoutbox_underline}?</strong>
					</td>
					<td class=\"trow1\" width=\"60%\">
						<select id={\$lang->miunashoutbox_underline}>
							<option value=\"0\">{\$lang->miunashoutbox_no}</option>
							<option value=\"1\">{\$lang->miunashoutbox_yes}</option>
						</select>
					</td>
				</tr>
				<tr>
					<td class=\"trow1\" width=\"40%\">
						<strong>{\$lang->miunashoutbox_strike}?</strong>
					</td>
					<td class=\"trow1\" width=\"60%\">
						<select id={\$lang->miunashoutbox_strike}>
							<option value=\"0\">{\$lang->miunashoutbox_no}</option>
							<option value=\"1\">{\$lang->miunashoutbox_yes}</option>
						</select>
					</td>
				</tr>
				<tr>
					<td class=\"tcat\" colspan=\"2\">
						<strong>{\$lang->miunashoutbox_title_for_style}</strong>
					</td>
				</tr>
					{\$fontcolor}
					{\$fontselect}
					{\$fontsizeselect}
			</table>
			<br />
			<div align=\"center\">
				<button id=\"update\">{\$lang->miunashoutbox_update_config}</button>
			</div>
		</td>
	</tr>
</table>
{\$footer}
</body>
</html>";

	$new_template['usercp_msdb_fontcolor'] = "<tr>
	<td class=\"trow1\" width=\"40%\"><strong>{\$lang->miunashoutbox_fontcolor}:</strong></td>
	<td class=\"trow1\" width=\"60%\">
		<input type=\"text\" name=\"font_color\" id=\"font_color\" autocomplete=\"off\">
	</td>
</tr>";

	$new_template['usercp_msdb_fontselect'] = "<tr>
	<td class=\"trow1\" width=\"40%\"><strong>{\$lang->miunashoutbox_font}:</strong></td>
	<td class=\"trow1\" width=\"60%\">
		<select id=\"fontsty\">
			<option value=\"\">{\$lang->use_default}</option>
			{\$fonteoptions}
		</select>
	</td>
</tr>";

	$new_template['usercp_msdb_fontselect_option'] = "<option value=\"{\$fonte_option}\">{\$fonte_option}</option>";

	$new_template['usercp_msdb_fontsizeselect'] = "<tr>
	<td class=\"trow1\" width=\"40%\"><strong>{\$lang->miunashoutbox_fontsize}:</strong></td>
	<td class=\"trow1\" width=\"60%\">
		<select id=\"fontsize\">
			<option value=\"\">{\$lang->use_default}</option>
			{\$fontesizeoptions}
		</select>
	</td>
</tr>";

	$new_template['usercp_msdb_fontsizeselect_option'] = "<option value=\"{\$fontesize_option}\">{\$fontesize_option}</option>";

	$new_template['usercp_nav_miuna'] = "<tbody>
<tr>
	<td class=\"tcat tcat_menu tcat_collapse{\$collapsedimg['esb']}\">
		<div class=\"expcolimage\"><img src=\"{\$theme['imgdir']}/collapse{\$collapsedimg['esb']}.png\" id=\"MSB_img\" class=\"expander\" alt=\"[-]\" title=\"[-]\" /></div>
		<div><span class=\"smalltext\"><strong>{\$mybb->settings['miunashout_title']}</strong></span></div>
	</td>
</tr>
</tbody>
<tbody style=\"{\$collapsed['MSB_e']}\" id=\"MSB_e\">
	<tr><td class=\"trow1 smalltext\"><a href=\"usercp.php?action=miuna_config\" class=\"usercp_nav_item usercp_nav_options\" >{\$lang->miunashoutbox_opt}</a></td></tr>
</tbody>";

	foreach($new_template as $title => $template2)
	{
		$new_template = array('title' => $db->escape_string($title), 'template' => $db->escape_string($template2), 'sid' => '-2', 'version' => '1801', 'dateline' => TIME_NOW);
		$db->insert_query('templates', $new_template);
	}

	//Adiciona templates para as posições da shoutbox
	find_replace_templatesets("index", '#{\$forums}#', "{\$miunashout}\n{\$forums}");
}

function miunashoutbox_deactivate()
{

	global $db;
	require MYBB_ROOT.'/inc/adminfunctions_templates.php';

	$db->delete_query("templates", "title IN('codebutmiuna','templateShoutBox','templateShoutBoxGuest','usercp_miuna_config','usercp_msdb_fontcolor','usercp_msdb_fontselect','usercp_msdb_fontselect_option','usercp_msdb_fontsizeselect','usercp_msdb_fontsizeselect_option','usercp_nav_miuna')");

	//Exclui templates para as posições da shoutbox
	find_replace_templatesets("index", '#'.preg_quote('{$miunashout}').'#', '',0);
}

global $settings;
if ($settings['miunashout_online']) {
	$plugins->add_hook('global_start', 'miuna_cache_template');
}
function miuna_cache_template()
{
	global $templatelist, $mybb;

	if (isset($templatelist)) {
		$templatelist .= ',';
	}

	if (THIS_SCRIPT == 'index.php') {
		$templatelist .= 'codebutmiuna,templateShoutBox,templateShoutBoxGuest';
	}
	if (THIS_SCRIPT == 'usercp.php') {
		$templatelist .= 'usercp_miuna_config,usercp_nav_miuna,usercp_msdb_fontcolor,usercp_msdb_fontselect,usercp_msdb_fontselect_option,usercp_msdb_fontsizeselect,usercp_msdb_fontsizeselect_option';
	}
}

function miuna_bbcode_func($smilies = true)
{
	global $db, $mybb, $theme, $templates, $lang, $smiliecache, $cache;

	if (!$lang->miunashoutbox) {
		$lang->load('miunashoutbox');
	}

	$editor_lang_strings = array(
		"editor_bold" => "Bold",
		"editor_italic" => "Italic",
		"editor_underline" => "Underline",
		"editor_strikethrough" => "Strikethrough",
		"editor_subscript" => "Subscript",
		"editor_superscript" => "Superscript",
		"editor_alignleft" => "Align left",
		"editor_center" => "Center",
		"editor_alignright" => "Align right",
		"editor_justify" => "Justify",
		"editor_fontname" => "Font Name",
		"editor_fontsize" => "Font Size",
		"editor_fontcolor" => "Font Color",
		"editor_removeformatting" => "Remove Formatting",
		"editor_cut" => "Cut",
		"editor_cutnosupport" => "Your browser does not allow the cut command. Please use the keyboard shortcut Ctrl/Cmd-X",
		"editor_copy" => "Copy",
		"editor_copynosupport" => "Your browser does not allow the copy command. Please use the keyboard shortcut Ctrl/Cmd-C",
		"editor_paste" => "Paste",
		"editor_pastenosupport" => "Your browser does not allow the paste command. Please use the keyboard shortcut Ctrl/Cmd-V",
		"editor_pasteentertext" => "Paste your text inside the following box:",
		"editor_pastetext" => "PasteText",
		"editor_numlist" => "Numbered list",
		"editor_bullist" => "Bullet list",
		"editor_undo" => "Undo",
		"editor_redo" => "Redo",
		"editor_rows" => "Rows:",
		"editor_cols" => "Cols:",
		"editor_inserttable" => "Insert a table",
		"editor_inserthr" => "Insert a horizontal rule",
		"editor_code" => "Code",
		"editor_width" => "Width (optional):",
		"editor_height" => "Height (optional):",
		"editor_insertimg" => "Insert an image",
		"editor_email" => "E-mail:",
		"editor_insertemail" => "Insert an email",
		"editor_url" => "URL:",
		"editor_insertlink" => "Insert a link",
		"editor_unlink" => "Unlink",
		"editor_more" => "More",
		"editor_insertemoticon" => "Insert an emoticon",
		"editor_videourl" => "Video URL:",
		"editor_videotype" => "Video Type:",
		"editor_insert" => "Insert",
		"editor_insertyoutubevideo" => "Insert a YouTube video",
		"editor_currentdate" => "Insert current date",
		"editor_currenttime" => "Insert current time",
		"editor_print" => "Print",
		"editor_viewsource" => "View source",
		"editor_description" => "Description (optional):",
		"editor_enterimgurl" => "Enter the image URL:",
		"editor_enteremail" => "Enter the e-mail address:",
		"editor_enterdisplayedtext" => "Enter the displayed text:",
		"editor_enterurl" => "Enter URL:",
		"editor_enteryoutubeurl" => "Enter the YouTube video URL or ID:",
		"editor_insertquote" => "Insert a Quote",
		"editor_invalidyoutube" => "Invalid YouTube video",
		"editor_dailymotion" => "Dailymotion",
		"editor_metacafe" => "MetaCafe",
		"editor_veoh" => "Veoh",
		"editor_vimeo" => "Vimeo",
		"editor_youtube" => "Youtube",
		"editor_facebook" => "Facebook",
		"editor_liveleak" => "LiveLeak",
		"editor_insertvideo" => "Insert a video",
		"editor_php" => "PHP",
		"editor_maximize" => "Maximize"
	);
	$editor_language = "(function ($) {\n$.sceditor.locale[\"mybblang\"] = {\n";

	$editor_languages_count = count($editor_lang_strings);
	$i = 0;
	foreach($editor_lang_strings as $lang_string => $key)
	{
		$i++;
		$js_lang_string = str_replace("\"", "\\\"", $key);
		$string = str_replace("\"", "\\\"", $lang->$lang_string);
		$editor_language .= "\t\"{$js_lang_string}\": \"{$string}\"";

		if($i < $editor_languages_count)
		{
			$editor_language .= ",";
		}

		$editor_language .= "\n";
	}

	$editor_language .= "}})(jQuery);";

	if(defined("IN_ADMINCP"))
	{
		global $page;
		$miunabbcode = $page->build_codebuttons_editor($editor_language, $smilies);
	}
	else
	{
		// Smilies
		$emoticon = "";
		$emoticons_enabled = "false";
		if($smilies && $mybb->settings['smilieinserter'] != 0 && $mybb->settings['smilieinsertercols'] && $mybb->settings['smilieinsertertot'])
		{
			$emoticon = ",emoticon";
			$emoticons_enabled = "true";

			if(!$smiliecache)
			{
				if(!is_array($smilie_cache))
				{
					$smilie_cache = $cache->read("smilies");
				}
				foreach($smilie_cache as $smilie)
				{
					if($smilie['showclickable'] != 0)
					{
						$smilie['image'] = str_replace("{theme}", $theme['imgdir'], $smilie['image']);
						$smiliecache[$smilie['sid']] = $smilie;
					}
				}
			}

			unset($smilie);

			if(is_array($smiliecache))
			{
				reset($smiliecache);

				$smilies_json = $dropdownsmilies = $moresmilies = $hiddensmilies = "";
				$i = 0;

				foreach($smiliecache as $smilie)
				{
					$finds = explode("\n", $smilie['find']);
					$finds_count = count($finds);

					// Only show the first text to replace in the box
					$smilie['find'] = $finds[0];

					$find = htmlspecialchars_uni($smilie['find']);
					$image = htmlspecialchars_uni($smilie['image']);
					$findfirstquote = preg_quote($find);
					$findsecoundquote = preg_quote($findfirstquote);
					$smilies_json .= '"'.$findsecoundquote.'": "<img src=\"'.$mybb->asset_url.'/'.$image.'\" />",';
					if($i < $mybb->settings['smilieinsertertot'])
					{
						$dropdownsmilies .= '"'.$find.'": "'.$mybb->asset_url.'/'.$image.'",';
					}
					else
					{
						$moresmilies .= '"'.$find.'": "'.$mybb->asset_url.'/'.$image.'",';
					}

					for($j = 1; $j < $finds_count; ++$j)
					{
						$find2 = htmlspecialchars_uni($finds[$j]);
						$hiddensmilies .= '"'.$find.'": "'.$mybb->asset_url.'/'.$image.'",';
					}
					++$i;
				}
			}
		}

		$name = format_name($mybb->user['username'], $mybb->user['usergroup'], $mybb->user['displaygroup']);
		$name_link = build_profile_link($name,$mybb->user['uid'], '_blank');

		eval("\$miunabbcode = \"".$templates->get("codebutmiuna")."\";");
	}

	return $miunabbcode;
}

if ($settings['miunashout_online']) {
	$plugins->add_hook('index_start', 'MiunaShout');
}
function MiunaShout() {

	global $settings, $mybb, $theme, $templates, $miunashout, $codebutmiuna, $lang;

	$codebutmiuna = miuna_bbcode_func();

	if (!$lang->miunashoutbox) {
		$lang->load('miunashoutbox');
	}

	if(!in_array((int)$mybb->user['usergroup'],explode(',',$mybb->settings['miunashout_grups_acc'])) && $mybb->user['uid']!=0) {
		eval("\$miunashout = \"".$templates->get("templateShoutBox")."\";");
	}
	elseif ($mybb->user['uid']==0 && $settings['miunashout_guest']==1) {
		eval("\$miunashout = \"".$templates->get("templateShoutBoxGuest")."\";");
	}

}

if ($settings['miunashout_online']) {
	$plugins->add_hook('usercp_start', 'MUSB_config');
}
function MUSB_config()
{
	global $mybb, $lang, $theme, $templates, $headerinclude, $header, $footer, $usercpnav, $fontcolor, $fonteoptions, $fontselect, $fontesizeoptions, $fontsizeselect;

	if ($mybb->input['action'] == 'miuna_config') {
		if (!$lang->miunashoutbox) {
			$lang->load('miunashoutbox');
		}

		add_breadcrumb($lang->nav_usercp, 'usercp.php');
		add_breadcrumb($lang->miunashoutbox_page_title, 'usercp.php?action=miuna_config');

		eval("\$fontcolor = \"".$templates->get("usercp_msdb_fontcolor")."\";");
		$explodedfonte = explode("\r\n", $mybb->settings['miunashout_styles_font']);
		$fonteoptions = $fonte_option = $fontselect = '';
		if(is_array($explodedfonte))
		{
			foreach($explodedfonte as $key => $val)
			{
				$val = trim($val);

				$fonte_option = $val;
				eval("\$fonteoptions .= \"".$templates->get("usercp_msdb_fontselect_option")."\";");
			}
		}
		eval("\$fontselect = \"".$templates->get("usercp_msdb_fontselect")."\";");

		$explodedfontesize = explode("\r\n", $mybb->settings['miunashout_styles_size']);
		$fontesizeoptions = $fontesize_option = $fontsizeselect = '';
		if(is_array($explodedfontesize))
		{
			foreach($explodedfontesize as $key => $val)
			{
				$val = trim($val);

				$fontesize_option = $val;
				eval("\$fontesizeoptions .= \"".$templates->get("usercp_msdb_fontsizeselect_option")."\";");
			}
		}
		eval("\$fontsizeselect = \"".$templates->get("usercp_msdb_fontsizeselect")."\";");

		eval("\$content = \"".$templates->get('usercp_miuna_config')."\";");
		output_page($content);
	}
}

if ($settings['miunashout_online']) {
	$plugins->add_hook('usercp_menu', 'miuna_ucpmenu', 20);
}
function miuna_ucpmenu()
{
	global $mybb, $templates, $theme, $usercpmenu, $lang, $collapsed, $collapsedimg;

	if (!$lang->miunashoutbox) {
		$lang->load('miunashoutbox');
	}

	eval("\$usercpmenu .= \"".$templates->get('usercp_nav_miuna')."\";");
}

function tokencall($url) {
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Origin: http://'.$_SERVER['HTTP_HOST'].''));
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($ch, CURLOPT_HTTPGET, true);
	$result = curl_exec($ch);
	curl_close($ch);
	return $result;
}

function sendPostData($url, $post) {
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Origin: http://'.$_SERVER['HTTP_HOST'].''));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	$result = curl_exec($ch);
	curl_close($ch);
	return $result;
}

if ($settings['miunashout_online'] && $settings['miunashout_newthread']) {
	$plugins->add_hook('newthread_do_newthread_end', 'MSB_newthread');
}
function MSB_newthread()
{
	global $mybb, $tid, $settings, $lang, $forum;

	if(!in_array((int)$forum['fid'],explode(',',$mybb->settings['miunashout_folder_acc']))) {
		$lang->load('admin/config_miunashoutbox');

		$name = format_name($mybb->user['username'], $mybb->user['usergroup'], $mybb->user['displaygroup']);
		$name_link = build_profile_link($name,$mybb->user['uid'], '_blank');
		$link = '[url=' . $settings['bburl'] . '/' . get_thread_link($tid) . ']' . $mybb->input['subject'] . '[/url]';
		$linklang = $lang->sprintf($lang->miunashoutbox_newthread_lang, $link);

		$baseurl = $settings['miunashout_server'];
		$timestamp = time();
		$url_token = $baseurl."/socket.io/?EIO=3&transport=polling&t=".$timestamp;

		$data = array(
			"nick" => $name_link,
			"msg" => $linklang,
			"nickto" => "0",
			"uid" => $mybb->user['uid'],
			"uidto" => "0,". $thread['uid'] ."",
			"stylesheet" => $mybb->settings['miunashout_newpt_style'],
			"type" => "system"
		);

		$gettoken = tokencall($url_token);
		$token = json_decode(substr($gettoken, 5));

		$msg = '["message",'.json_encode($data).']';
		$count = strlen($msg) + 2;

		$emiturl = $baseurl."/socket.io/?EIO=3&transport=polling&t=".$timestamp."-2&sid=".$token->{"sid"};
		sendPostData($emiturl, ''.$count.':42'.$msg.'');
	}
}

if ($settings['miunashout_online'] && $settings['miunashout_newpost']) {
	$plugins->add_hook('newreply_do_newreply_end', 'MSB_newpost');
}
function MSB_newpost()
{
	global $mybb, $tid, $settings, $lang, $url, $thread, $forum;

	if(!in_array((int)$forum['fid'],explode(',',$mybb->settings['miunashout_folder_acc']))) {
		$lang->load('admin/config_miunashoutbox');

		$name = format_name($mybb->user['username'], $mybb->user['usergroup'], $mybb->user['displaygroup']);
		$name_link = build_profile_link($name,$mybb->user['uid'], '_blank');
		$MSB_url = htmlspecialchars_decode($url);
		$link = '[url=' . $settings['bburl'] . '/' . $MSB_url . ']' . $thread['subject'] . '[/url]';
		$linklang = $lang->sprintf($lang->miunashoutbox_newpost_lang, $link);

		$baseurl = $settings['miunashout_server'];
		$timestamp = time();
		$url_token = $baseurl."/socket.io/?EIO=3&transport=polling&t=".$timestamp;

		$data = array(
			"nick" => $name_link,
			"msg" => $linklang,
			"nickto" => "0",
			"uid" => $mybb->user['uid'],
			"uidto" => "0,". $thread['uid'] ."",
			"stylesheet" => $mybb->settings['miunashout_newpt_style'],
			"type" => "system"
		);

		$gettoken = tokencall($url_token);
		$token = json_decode(substr($gettoken, 5));

		$msg = '["message",'.json_encode($data).']';
		$count = strlen($msg) + 2;

		$emiturl = $baseurl."/socket.io/?EIO=3&transport=polling&t=".$timestamp."-2&sid=".$token->{"sid"};
		sendPostData($emiturl, ''.$count.':42'.$msg.'');
	}
}

?>
