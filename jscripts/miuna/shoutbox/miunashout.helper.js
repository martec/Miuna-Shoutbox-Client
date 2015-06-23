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
function escapeHtml(text) {
  var map = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function revescapeHtml(text) {
  var map = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#039;': "'"
  };

  return text.replace(/(&amp;|&lt;|&gt;|&quot;|&#039;)/g, function(m) { return map[m]; });
}

function regexment(text,nick) {
  var mentregex = text.match(/(?:^|\s)@&quot;([^<]+?)&quot;|(?:^|\s)@&#039;([^<]+?)&#039;|(?:^|\s)@`([^<]+?)`|(?:^|\s)@(?:([^"<>\.,;!?()\[\]{}&\'\s\\]{3,}))/gmi);
  if (mentregex) {
	var patt = new RegExp(nick, "gi");
		for (var i =0;i<mentregex.length;i++) {
			if(nick.length == (String(mentregex[i]).trim().length - 1)) {
				res = patt.exec(mentregex[i]);
				if (nick.toUpperCase() == String(res).toUpperCase()) {
					return 1;
				}
				return 0;
			}
			return 0;
		}
		return 0;
  }
  return 0;
}

function regexmiuna(message) {
	format_search =	 [
		/\[url=(.*?)\](.*?)\[\/url\]/ig,
		/\[spoiler\](.*?)\[\/spoiler\]/ig,
		/(^|[^"=\]])(https?:\/\/[a-zA-Z0-9\.\-\_\-\/]+(?:\?[a-zA-Z0-9=\+\_\;\-\&]+)?(?:#[\w]+)?)/gim,
		/(^|[^"=\]\>\/])(www\.[\S]+(\b|$))/gim,
		/(^|[^"=\]])(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim
	],
	// The matching array of strings to replace matches with
	format_replace = [
		'<a href="$1" target="_blank">$2</a>',
		"<tag><div style=\"margin: 5px\"><div style=\"font-size:11px; border-radius: 3px 3px 0 0 ; padding: 4px; background: #f5f5f5;border:1px solid #ccc;font-weight:bold;color:#000;text-shadow:none; \">"+spo_lan+":&nbsp;&nbsp;<input type=\"button\" onclick=\"if (this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display != '') { this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = '';this.innerText = ''; this.value = '"+hide_lan+"'; } else { this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = 'none'; this.innerText = ''; this.value = '"+show_lan+"'; }\" style=\"font-size: 9px;\" value=\""+show_lan+"\"></div><div><div style=\"border:1px solid #ccc; border-radius: 0 0 3px 3px; border-top: none; padding: 4px;display: none;\">$1</div></div></div></tag>",
		'$1<a href="$2" target="_blank">$2</a>',
		'$1<a href="http://$2" target="_blank">$2</a>',
		'<a href="mailto:$1">$1</a>'
	];
	// Perform the actual conversion
	for (var i =0;i<format_search.length;i++) {
		message = message.replace(format_search[i], format_replace[i]);
	}

	for (var val in miuna_smilies) {
		message = message.replace(new RegExp(''+val+'(?!\\S)', "gi"), miuna_smilies[val]);
	}
	return message;
}

function imgconv(type) {
	$("div."+type+"").find( "a[href*='.jpg'], a[href*='.gif'], a[href*='.png']" ).each(function(e) {
		var imgsrc = $(this).attr('href');
		if (aimgrepl.trim()) {
			imgsrc = aimgrepl.replace(/\$1/g, escapeHtml(imgsrc));
		}
		if (!$(this).children("img").length) {
			$(this).empty().append( '<img src="'+ imgsrc +'" style="max-width:80px; max-height:80px" />' );
		}
	});
}

function scrollmiuna(key,area,ckold,imarea) {
	if ((($(""+area+"").scrollTop() + $(""+area+"").outerHeight()) > ($(""+area+"")[0].scrollHeight - 90)) || ckold=='old') {
		imgarea = key;
		if (ckold=='old') {
			imgarea = imarea;
		}
		$(""+area+"").animate({scrollTop: ($(""+area+"")[0].scrollHeight)}, 10);
		$("div."+imgarea+" img").one("load", function() {
			$(""+area+"").animate({scrollTop: ($(""+area+"")[0].scrollHeight)}, 10);
		}).each(function() {
			if(this.complete) $(this).load();
		});
	}
}

function scrollmiunalog() {
	$(".logstyle").animate({scrollTop: ($(".logstyle")[0].scrollHeight)}, 10);
	$("div.msglog img").one("load", function() {
		$(".logstyle").animate({scrollTop: ($(".logstyle")[0].scrollHeight)}, 10);
	}).each(function() {
		if(this.complete) $(this).load();
	});
}

function autocleaner(area,count,numshouts,direction) {
	if($(""+area+"").children("div."+count+"").length>(parseInt(numshouts) - 1)) {
		dif = $(""+area+"").children("div."+count+"").length - (parseInt(numshouts) - 1);
		if(direction=='top'){
			$(""+area+"").children("div."+count+"").slice(-dif).remove();
		}
		else {
			$(""+area+"").children("div."+count+"").slice(0, dif).remove();
		}
	}
	setTimeout(function() {
		if ($('.shoutarea').children("[data-ment=yes]").length) {
			document.title = '('+$('.shoutarea').children("[data-ment=yes]").length+') '+orgtit+'';
		}
		else {
			document.title = orgtit;
		}
	},200);
}

function shoutgenerator(reqtype,key,uidp,uid,gid,colorsht,avatar,hour,username,nickto,message,type,ckold,direction,numshouts,cur) {
	var preapp = lanpm = pmspan = area = scrollarea = count = coloruser = usravatar = shoutcolor = '';
	if(direction=='top'){
		preapp = 'prepend';
		if (reqtype == 'logback') {
			preapp = 'append';
		}
	}
	else {
		preapp = 'append';
		if (reqtype == 'logback') {
			preapp = 'prepend';
		}
	}
	if(uidp==uid) {
		lanpm = pm_fromlan;
		nickto = username;
	}
	else {
		lanpm = pm_tolan;
		nickto = nickto;
	}
	if (reqtype=="shout") {
		area = scrollarea = ".shoutarea";
		count = "msgstcount";
		autocleaner(area,count,numshouts,direction);
	}
	else if (reqtype=="pm") {
		area = scrollarea = "[data-uidpm="+uidp+"]";
		count = "pmmsgstcount";
		autocleaner(area,count,numshouts,direction);
	}
	else {
		area = ".loglist";
		scrollarea = ".logstyle";
		count = "msglog";
	}
	if (parseInt(dcusrname)) {
		username = username.replace(/(<([^>]+)>)/ig,"");
		nickto = nickto.replace(/(<([^>]+)>)/ig,"");
	}
	if (parseInt(actavat)) {
		if (avatar.trim()) {
			usravatar = "<span class='msb_tvatar'><img src="+escapeHtml(avatar)+" /></span>";
		}
		else {
			usravatar = "<span class='msb_tvatar'><img src='"+imagepath+"/default_avatar.png' /></span>";
		}
	}
	if (parseInt(actcolor)) {
		if (colorsht) {
			if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorsht)) {
				shoutcolor = 'style="color:'+colorsht+'"';
			}
		}
	}
	if ((reqtype == 'shout' || reqtype == 'lognext' || reqtype == 'logback') && (type == 'pmshout' || type == 'pmsystem')) {
		pmspan = "<span class='pm_inf'>["+lanpm+" "+nickto+"] </span>";
	}
	if(type == 'shout' || type == 'pmshout') {
		$(""+area+"")[preapp]("<div class='msgShout "+count+" "+escapeHtml(key)+"' data-uid="+parseInt(uid)+" data-ided="+escapeHtml(key)+">"+usravatar+"<span class='time_msgShout'><span>[</span>"+hour+"<span>]</span></span>"+pmspan+"<span class='username_msgShout'>"+username+"</span>:<span class='content_msgShout' "+shoutcolor+">"+message+"</span></div>");
	}
	if(type == 'system' || type == 'pmsystem') {
		$(""+area+"")[preapp]("<div class='msgShout "+count+" "+escapeHtml(key)+"' data-uid="+parseInt(uid)+" data-ided="+escapeHtml(key)+">"+usravatar+""+pmspan+"*<span class='username_msgShout'>"+username+"</span><span class='content_msgShout' "+shoutcolor+">"+message+"</span>*</div>");
	}
	if(cur==0) {
		if(parseInt(actaimg)) {
			imgconv(count);
		}
		if (reqtype == 'lognext' || reqtype == 'logback') {
			if(direction!='top') {
				scrollmiunalog();
			}
		}
		else {
			if(direction!='top') {
				scrollmiuna(key,scrollarea,ckold,count);
			}
		}
	}
}

function tok_ajax() {
	$.ajax({
		type: 'POST',
		url: 'xmlhttp.php?action=msb_gettoken&my_post_key='+my_post_key
	}).done(function (result) {
		var IS_JSON = true;
		try {
			var json = $.parseJSON(result);
		}
		catch(err) {
			IS_JSON = false;
		}
		if (IS_JSON) {
			if (JSON.parse(result).token) {
				token = JSON.parse(result).token;
				var msb_token = JSON.parse(localStorage.getItem('msb_token'));
				if (!msb_token) {
					msb_token = {};
				}
				msb_token['token'] = token;
				localStorage.setItem('msb_token', JSON.stringify(msb_token));
				miunashout_connect();
			}
			if (JSON.parse(result).error) {
				if (JSON.parse(result).error=='admpassinc') {
					if(!$('#incadm_pass').length) {
						$('<div/>', { id: 'incadm_pass', class: 'top-right' }).appendTo('body');
					}
					setTimeout(function() {
						$('#incadm_pass').jGrowl(eregp, { life: 1500 });
					},200);
				}
				if (JSON.parse(result).error=='admusarinc') {
					if(!$('#incadm_user').length) {
						$('<div/>', { id: 'incadm_user', class: 'top-right' }).appendTo('body');
					}
					setTimeout(function() {
						$('#incadm_user').jGrowl(eregn, { life: 1500 });
					},200);
				}
				miunashout_connecticon();
			}
		}
		else {
			if(typeof result == 'object')
			{
				if(result.hasOwnProperty("errors"))
				{
					$.each(result.errors, function(i, message)
					{
						if(!$('#er_others').length) {
							$('<div/>', { id: 'er_others', class: 'top-right' }).appendTo('body');
						}
						setTimeout(function() {
							$('#er_others').jGrowl(message, { life: 1500 });
						},200);
					});
				}
				
			}
			else {
				return result;
			}
			miunashout_connecticon();
		}
	});
	return false;
};

function miunashout_connecticon() {

	if(!$('#msb_connect').length) {
		var connect = [
			'<a class="sceditor-button" title="'+connectlang+'" id="msb_connect">',
				'<div style="background-image: url('+rootpath+'/images/connect.png); opacity: 1; cursor: pointer;">'+connectlang+'</div>',
			'</a>'
		];
		$(connect.join('')).appendTo('.sceditor-group:last');
	}
}

($.fn.on || $.fn.live).call($(document), 'click', '#msb_connect', function (e) {
	e.preventDefault();
	sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
	if (!sb_sty) {
		sb_sty = {};
	}
	sb_sty['logoff'] = 0;
	localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));		
	tok_ajax();
});

function miunashout_connect() {

	var msb_token = JSON.parse(localStorage.getItem('msb_token'));
	if (!msb_token) {
		tok_ajax();
	}
	else {
		sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
		if (!sb_sty) {
			sb_sty = {};
		}
		if (!sb_sty['logoff']) {
			if(!$('#auto_log').length) {
				$('<div/>', { id: 'auto_log', class: 'top-right' }).appendTo('body');
			}
			setTimeout(function() {
				$('#auto_log').jGrowl(spinner+aloadlang, { sticky: true });
			},200);
			socket = io.connect(socketaddress+'/member', { 'forceNew': true });
				socket.on('authenticated', function () {
					socket.emit('ckusr', {uid:msbvar.mybbuid});
					socket.once('ckusr', function (data) {
						if (data=='ok') {
							if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
							conelem = document.getElementById("msb_connect");
							if (conelem) { conelem.parentElement.removeChild(conelem); }
							miunashout(socket);
						}
						else if (data=='banned') {
							if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
							miunashout_connecticon();
							socket.disconnect();
							if(!$('#usr_ban').length) {
								$('<div/>', { id: 'usr_ban', class: 'top-right' }).appendTo('body');
							}
							setTimeout(function() {
								$('#usr_ban').jGrowl(usr_banlang, { life: 1500 });
							},200);
						}
						else {
							if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
							socket.disconnect();
							if(!$('#inv_alert').length) {
								$('<div/>', { id: 'inv_alert', class: 'top-right' }).appendTo('body');
							}
							setTimeout(function() {
								$('#inv_alert').jGrowl(invtoklang, { life: 1500 });
							},200);
							tok_ajax();
						}
					});
				})
				.emit('authenticate', {token: msb_token['token']}) //send the jwt
				.on("unauthorized", function(error) {
					if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
					socket.disconnect();
					if(!$('#inv_alert').length) {
						$('<div/>', { id: 'inv_alert', class: 'top-right' }).appendTo('body');
					}
					setTimeout(function() {
						$('#inv_alert').jGrowl(invtoklang, { life: 1500 });
					},200);
					tok_ajax();
				});				
		}
		else {
			miunashout_connecticon();
		}
	}
}

function miunashout(socket) {
	var notban = '1',
	flooddetect,
	colorshout = '',
	shoutvol = '0',
	usrlist = '',
	uidlist = '',
	pmdata = '',
	connected = false;

	var shoutbut = '<button id="sbut" style="margin: 2px; float: right;">'+shout_lang+'</button>';
	$(shoutbut).appendTo('.sceditor-toolbar');

	if (parseInt(actcolor)) {
		sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
		if (sb_sty) {
			if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(sb_sty['color'])) {
				colorshout = sb_sty['color'];
			}
		}
	}

	sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
	if (sb_sty) {
		shoutvol = sb_sty['sound'];
	}

	function addParticipantsMessage (data) {
		$('.actusr').text(''+usractlan+' '+Object.keys(data.usernames).length+'');
	}

	socket.once('login', function (data) {
		connected = true;
		addParticipantsMessage(data);
		usrlist = data.usernames;
		uidlist = data.uidlist;
		socket.emit('getoldmsg', {ns:numshouts});
	});

	socket.on('user joined', function (data) {
		addParticipantsMessage(data);
		usrlist = data.usernames;
		uidlist = data.uidlist;
		if($("[data-uid="+data.uid+"]").length) {
			$("[data-uid="+data.uid+"]").find(".time_msgShout span").css("color",on_color);
		}
	});

	socket.on('user left', function (data) {
		addParticipantsMessage(data);
		usrlist = data.usernames;
		uidlist = data.uidlist;
		if($("[data-uid="+data.uid+"]").length) {
			$("[data-uid="+data.uid+"]").find(".time_msgShout span").css("color","");
		}
	});

	socket.emit('add user', function (data) {});

	socket.emit('getnot', function (data) {});
	socket.once('getnot', function (data) {
		if (data) {
			$(".notshow").text(escapeHtml(data.not));
		}
	});

	socket.on('ban', function (data) {
		if (data) {
			socket.disconnect();
			notban = 0;
			if(!$('#upd_alert').length) {
				$('<div/>', { id: 'upd_alert', class: 'top-right' }).appendTo('body');
			}
			setTimeout(function() {
				$('#upd_alert').jGrowl(usr_banlang, { life: 1500 });
			},200);
		}
	});

	socket.on('abuse', function (data) {
		if (data) {
			socket.disconnect();
			if(!$('#abuse_alert').length) {
				$('<div/>', { id: 'abuse_alert', class: 'top-right' }).appendTo('body');
			}
			setTimeout(function() {
				$('#abuse_alert').jGrowl(usr_abulang, { life: 1500 });
			},200);
		}
	});

	socket.on('updnot', function (data) {
		if (data) {
			$(".notshow").text(escapeHtml(data.not));
		}
		else {
			$(".notshow").text('');
		}
	});
	
	socket.on('purge', function () {
		$('.msgShout').remove();
	});

	var last_check = Date.now()/1000;

	$('#shout_text').sceditor('instance').bind('keypress', function(e) {
		if(e.originalEvent.which == 13) {
			e.preventDefault();
			onshout(e);
		}
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#sbut', function (e) {
		e.preventDefault();
		onshout(e);
	});

	function onshout(e) {
		current = Date.now()/1000;
		time_passed = current - last_check;
		if (parseInt(time_passed) >= msbvar.floodtime) {
			last_check = current;
			if (notban) {
				if ($('#shout_text').attr('data-type')=='shout') {

					var msg = escapeHtml($('#shout_text').sceditor('instance').val());

					if (parseInt(msbvar.msblc) > 0) {
						msg = msg.slice(0, parseInt(msbvar.msblc));
					}

					if(msg == '' || msg == null) {
						$('#shout_text').sceditor('instance').val('').focus();
						return false;
					}
					else {
						$('#shout_text').sceditor('instance').val('').focus();
						if ( /^\/me[\s]+(.*)$/.test(msg) ) {
							socket.emit('message', {msg:msg.slice(4), nickto:'0', colorsht: colorshout, uidto:0, type: 'system'});
						}
						else {
							socket.emit('message', {msg:msg, nickto:'0', uidto:0, colorsht: colorshout, type: 'shout'});
						}
						return false;
					}
				}
				else if ($('#shout_text').attr('data-type')=='pm') {
					var msg = escapeHtml($('#shout_text').sceditor('instance').val()),
					uid_to = parseInt($('#shout_text').attr('data-tbuid')),
					nick_to = $('#shout_text').attr('data-nicktopm');

					if(msg == '' || msg == null){
						$('#shout_text').sceditor('instance').val('').focus();
						return false;
					}
					else {
						$('#shout_text').sceditor('instance').val('').focus();

						if ( /^\/me[\s]+(.*)$/.test(msg) ) {
							socket.emit('message', {msg:msg.slice(4), nickto:nick_to, colorsht: colorshout, uidto:uid_to, type: 'pmsystem'});
						}
						else {
							socket.emit('message', {msg:msg, nickto:nick_to, colorsht: colorshout, uidto:uid_to, type: 'pmshout'});
						}
						return false;
					}
				}
				else if ($('#shout_text').attr('data-type')=='edit') {
					var msg = escapeHtml($('#shout_text').sceditor('instance').val());

					if (parseInt(msbvar.msblc) > 0) {
						msg = msg.slice(0, parseInt(msbvar.msblc));
					}

					if(msg == '' || msg == null){
						if(!$('#upd_alert').length) {
							$('<div/>', { id: 'upd_alert', class: 'bottom-right' }).appendTo('body');
						}
						setTimeout(function() {
							$('#upd_alert').jGrowl(mes_emptylan, { life: 500 });
						},200);
						$('#shout_text').sceditor('instance').val('').focus();
						return false;
					}
					else {
						$('#shout_text').sceditor('instance').val('').focus();
						if ($('.pmtab.selected').length) {
							uid = $(this).attr('data-uidpmtab');
							nickto = $(this).children('.pmuser').html();
							$('#shout_text').attr({"data-type":"pm", "data-tbuid":uid, "data-nicktopm":nickto});
						}
						else {
							$('#shout_text').attr("data-type", "shout");
						}
						$('#cancel_edit').remove();
						$('#del_shout').remove();
						var id = $('#shout_text').attr('data-id');
						socket.emit('updmsg', {id:id, newmsg:msg});
						return false;
					}
				}
			}
			else {
				$('#shout_text').sceditor('instance').val('').focus();
				if(!$('#upd_alert').length) {
					$('<div/>', { id: 'upd_alert', class: 'top-right' }).appendTo('body');
				}
				setTimeout(function() {
					$('#upd_alert').jGrowl(usr_banlang, { life: 1500 });
				},200);
				e.preventDefault();
				return;
			}
		}
		else {
			if(!$('#upd_alert').length) {
				$('<div/>', { id: 'upd_alert', class: 'bottom-right' }).appendTo('body');
			}
			setTimeout(function() {
				time_after = msbvar.floodtime - parseInt(time_passed);
				$('#upd_alert').jGrowl(flood_msglan+time_after+secounds_msglan, { life: 500 });
			},50);
			e.preventDefault();
			return;
		}
	}

	function displayMsg(reqtype, message, username, uidp, uid, gid, colorsht, avatar, nickto, edt, type, key, created, ckold, cur){
		var hour = moment(created).utcOffset(parseInt(zoneset)).format(zoneformt);
		message = regexmiuna(escapeHtml(revescapeHtml(message))),
		nums = numshouts;
		if (reqtype=='lognext' || reqtype=='logback') {
			nums = msbvar.mpp;
		}

		shoutgenerator(reqtype,key,uidp,uid,gid,colorsht,avatar,hour,username,nickto,message,type,ckold,direction,nums,cur);
		if (uidlist[uid]==1) {
			$("[data-uid="+uid+"]").find(".time_msgShout span").css("color",on_color);
		}
		if (regexment(message,msbvar.mybbusername)) {
			$("div."+key+"").css("border-left",ment_borderstyle).attr( "data-ment", "yes" );
			setTimeout(function() {
				if ($('.shoutarea').children("[data-ment=yes]").length) {
					document.title = '('+$('.shoutarea').children("[data-ment=yes]").length+') '+orgtit+'';
				}
			},200);
		}
		if (edt=='1') {
			$("div."+key+"").css("background-color",edt_color);
		}
	};

	function checkMsg(req, msg, nick, nickto, uid, gid, colorsht, avatar, uidto, edt, type, _id, created, ckold, cur) {
		var mtype = 'shout';

		if (req=='lognext' || req=='logback') {
			mtype = req;
		}
		if (nickto=='0') {
			displayMsg(mtype, msg, nick, uid, uid, gid, colorsht, avatar, nickto, edt, type, _id, created, ckold, cur);
		}
		else {
			if (uid==msbvar.mybbuid) {
				if (req=="msg" || req=='lognext' || req=='logback') {
					displayMsg(mtype, msg, nick, uidto, uid, gid, colorsht, avatar, nickto, edt, type, _id, created, ckold, cur);
				}
				if ($("[data-uidpm="+uidto+"]").length && req!='lognext' && req!='logback') {
					displayMsg("pm", msg, nick, uidto, uid, gid, colorsht, avatar, nickto, edt, type, _id, created, ckold, cur);
				}
				else {
					return;
				}
			}
			else if (uidto==msbvar.mybbuid) {
				if (req=="msg" || req=='lognext' || req=='logback') {
					displayMsg(mtype, msg, nick, uid, uid, gid, colorsht, avatar, nickto, edt, type, _id, created, ckold, cur);
				}
				if($("[data-uidpm="+uid+"]").length && req!='lognext' && req!='logback') {
					displayMsg("pm", msg, nick, uid, uid, gid, colorsht, avatar, nickto, edt, type, _id, created, ckold, cur);
				}
				else {
					return;
				}
			}
			else {
				return;
			}
		}
	};

	socket.once('load old msgs', function(docs){
		for (var i = docs.length-1; i >= 0; i--) {
			checkMsg("msg", docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].gid, docs[i].colorsht, docs[i].avatar, docs[i].uidto, docs[i].edt, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
		}
	});

	socket.on('message', function(data){
		if(parseFloat(shoutvol)) {
			var sound = new Audio(rootpath + '/jscripts/miuna/shoutbox/msb_sound.mp3');
			sound.volume = parseFloat(shoutvol);
			sound.play();
		}
		checkMsg("msg", data.msg, data.nick, data.nickto, data.uid, data.gid, data.colorsht, data.avatar, data.uidto, data.edt, data.type, data._id, data.created, 'new', 0);
	});

	function updmsg(message, key){
		message = regexmiuna(escapeHtml(revescapeHtml(message)));
		setTimeout(function() {
			if(parseInt(actaimg)) {
				imgconv(count);
			}
			if ($('.shoutarea').children().hasClass(key)) {
				if(direction!='top') {
					scrollmiuna(key,'.shoutarea','new','msgstcount');
				}
			}
			if (typeof $('div.'+key+'').parent('.pmarea').attr('data-uidpm') !== "undefined") {
				area2 = "[data-uidpm="+$('div.'+key+'').parent('.pmarea').attr('data-uidpm')+"]";
				if(direction!='top') {
					scrollmiuna(key, area2,'new','"pmmsgstcount";');
				}
			}
		},50);
		var menttest = regexment(message,msbvar.mybbusername);
		if ($("div."+key+"").attr('data-ment') == "yes") {
			if(!menttest) {
				$("div."+key+"").css("border-left","").attr( "data-ment", "no" );
				setTimeout(function() {
					if ($('.shoutarea').children("[data-ment=yes]").length) {
						document.title = '('+$('.shoutarea').children("[data-ment=yes]").length+') '+orgtit+'';
					}
					else {
						document.title = orgtit;
					}
				},200);
			}
		}
		if (menttest) {
			$("div."+key+"").css("border-left",ment_borderstyle).attr( "data-ment", "yes" );
			setTimeout(function() {
				document.title = '('+$('.shoutarea').children("[data-ment=yes]").length+') '+orgtit+'';
			},200);
		}
		$('div.'+key+'').children('.content_msgShout').html(message);
		$("div."+key+"").css("background-color",edt_color);
	}

	socket.on('updmsg', function (data) {
		if (data) {
			updmsg(data.msg, data._id);
		}
	});

	function logfunc() {
		socket.emit('logfpgmsg', {mpp:msbvar.mpp});
		socket.once('logfpgmsg', function(docs){
			for (var i = docs.length-1; i >= 0; i--) {
				checkMsg('lognext', docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].gid, docs[i].colorsht, docs[i].avatar, docs[i].uidto, docs[i].edt, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
			}
		});
	}

	($.fn.on || $.fn.live).call($(document), 'click', '#log', function (e) {
		var heightwin = window.innerHeight*0.8,
		widthwin = window.innerWidth*0.5,
		page = '',
		initpage = '',
		npostbase = '';

		if (window.innerWidth < 650 || (window.innerWidth < window.innerHeight)) {
			 widthwin = document.getElementById("edshout_e").offsetWidth;
		}
		if (window.innerWidth < window.innerHeight) {
			heightwin = widthwin*0.8;
		}

		function displayfpglogMsg(data){
			npostbase = data;
			pagebase = Math.ceil(npostbase/msbvar.mpp);
			npost = npostbase + pagebase;
			page = Math.ceil(npost/msbvar.mpp);
			if (page>1) {
				initpage = "1/"+page;
			}
			else {
				initpage = "1/1";
			}

			$('body').append( '<div id="logpop" style="width: '+widthwin+'px;max-width:900px !important"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+log_shoutlan+'</strong></div></td></tr><tr><td class="trow1" colspan="2"><div class="logstyle" style="overflow-y: auto;width:99%;height: '+heightwin*0.7+'px;word-break:break-all"><div class="loglist"></div></div></td></tr><td class="trow1"><div id="page" style="text-align:center"><button id="page_back" style="margin:4px;">'+log_backlan+'</button> <span id="pagecount" data-pageact="1" data-pagemax="'+page+'">'+initpage+'</span> <button id="page_next" style="margin:4px;">'+log_nextlan+'</button><button id="htmlgenerator" style="margin:4px;">'+log_htmllan+'</button></div></td></table></div></div>' );
			$('#logpop').modal({ zIndex: 7 });
			logfunc();
		}

		socket.emit('countmsg', function (data) {});
		socket.once('countmsg', function (data) {
			displayfpglogMsg(data);
		});
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#page_next', function (e) {
		e.preventDefault();
		var actpage = $('#pagecount').attr('data-pageact'),
		maxpage = $('#pagecount').attr('data-pagemax');

		if (parseInt(actpage)==parseInt(maxpage)) {
			return;
		}
		else {
			var newactpage = parseInt(actpage) + 1,
			newpagelist = newactpage+"/"+maxpage,
			prevpagefirstid = '';
			if(direction=='top'){
				prevpagefirstid = $(".msglog:last").attr('data-ided');
			}
			else {
				prevpagefirstid = $(".msglog:first").attr('data-ided');
			}
			$('#pagecount').text(newpagelist);
			$('.loglist').remove();
			$(".logstyle").append('<div class="loglist"></div>');
			$('#pagecount').attr('data-pageact', newactpage);
			$('#pagecount').val(newpagelist);

			socket.emit('logmsgnext', {id:prevpagefirstid, mpp:msbvar.mpp});
			socket.once('logmsgnext', function (docs) {
				for (var i = docs.length-1; i >= 0; i--) {
					checkMsg('lognext', docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].gid, docs[i].colorsht, docs[i].avatar, docs[i].uidto, docs[i].edt, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
				}
			});
		}
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#page_back', function (e) {
		e.preventDefault();
		var actpage = $('#pagecount').attr('data-pageact'),
		maxpage = $('#pagecount').attr('data-pagemax');

		if (parseInt(actpage)==1) {
			return;
		}
		else {
			var newactpage = parseInt(actpage) - 1,
			newpagelist = newactpage+"/"+maxpage,
			prevpagelastid = '';
			if(direction=='top'){
				prevpagelastid = $(".msglog:first").attr('data-ided');
			}
			else {
				prevpagelastid = $(".msglog:last").attr('data-ided');
			}
			$('#pagecount').text(newpagelist);
			$('.loglist').remove();
			$(".logstyle").append('<div class="loglist"></div>');
			$('#pagecount').attr('data-pageact', newactpage);
			$('#pagecount').val(newpagelist);

			socket.emit('logmsgback', {id:prevpagelastid, mpp:msbvar.mpp});
			socket.once('logmsgback', function (docs) {
				for (var i = docs.length-1; i >= 0; i--) {
					checkMsg('logback', docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].gid, docs[i].colorsht, docs[i].avatar, docs[i].uidto, docs[i].edt, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
				}
			});
		}
	});

	function genpmfun(uid,nick){
		if (msbvar.mybbuid!=uid) {
			if (!$("[data-uidpmtab="+uid+"]").length) {
				$(".tabShout").removeClass( "selected" );
				$('.wrapShout').hide();
				$('.shoutarea').before( ' <div class="pmtab tabShout selected" data-uidpmtab="'+parseInt(uid)+'"><span class="pmuser" >'+nick+' </span>[<a href="#" class="closetab">x</a>]</div>' ).hide();
				$('.shoutarea').after( '<div class="pmarea wrapShout" data-uidpm="'+parseInt(uid)+'" style="height:'+shout_height+'px;"></div>' );
				$('#shout_text').attr({"data-type": "pm", "data-tbuid": parseInt(uid), "data-nicktopm": nick});
				socket.emit('getoldpmmsg', {ns: numshouts, suid: uid});
				socket.once('load old pm msgs', function(docs){
					for (var i = docs.length-1; i >= 0; i--) {
						checkMsg("pm", docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].gid, docs[i].colorsht, docs[i].avatar, docs[i].uidto, docs[i].edt, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
					}
				});
			}
			else {
				$(".tabShout").removeClass( "selected" );
				$("[data-uidpmtab="+parseInt(uid)+"]").addClass( "selected" );
				$('.wrapShout').hide();
				$("[data-uidpm="+parseInt(uid)+"]").show();
				$('#shout_text').attr({"data-type": "pm", "data-tbuid": parseInt(uid), "data-nicktopm": nick});
				if(direction!='top'){
					$('[data-uidpm='+parseInt(uid)+']').animate({
						scrollTop: ($('[data-uidpm='+parseInt(uid)+']')[0].scrollHeight)
					}, 10);
				}
			}
		}
	}

	if ($.inArray(parseInt(msbvar.mybbusergroup), msbvar.miunamodgroups.split(',').map(function(modgrup){return Number(modgrup);}))!=-1) {
		function prunefunc() {
			heightwin = 120;
			$('body').append( '<div class="prune"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+prune_shoutlan+':</strong></div></td></tr><td class="trow1">'+conf_questlan+'</td></table></div><td><button id="prune_yes" style="margin:4px;">'+shout_yeslan+'</button><button id="no_ans" style="margin:4px;">'+shout_nolan+'</button></td></div>' );
			$('.prune').modal({ zIndex: 7 });
		}

		function buildbanl(nicks,uid,ban,i) {
			$("#banlselector").append('<option value="'+parseInt(uid)+'" data-i="'+parseInt(i)+'" data-ban="'+parseInt(ban)+'">'+nicks+'</option>');
		}

		function banusr(docs) {
			bandata = docs;
			heightwin = 200;
			$('body').append( '<div class="banlist"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+ban_syslan+':</strong></div></td></tr><tr><td class="tcat">'+ban_msglan+':</td></tr><tr><td id="banlist" class="trow1"></td></tr><tr><td class="trow1"><select id="banlselector" style="width:100%"></select></td></tr></table></div><td><button id="banunbutton" style="margin:4px;">'+ban_unban_lan+'</button></td></div>' );
			for (var i = docs.length-1; i >= 0; i--) {
				buildbanl(docs[i].nicks, parseInt(docs[i].uid), parseInt(docs[i].ban), i);
			}
			$("[data-ban=1]").each(function(){
				$("#banlist").append('<span class="banusr" data-uid="'+$(this).val()+'">'+$(this).html()+'</span>, ');
			});
			var onowlist = $('#banlist').html();
			if (onowlist) {
				$('#banlist').html(onowlist.slice(0, -2));
			}
			else {
				$("#banlist").text(no_ban_usrlan);
			}
			$("#banlselector").select2();
			$('.banlist').modal({ zIndex: 7 });
		}

		($.fn.on || $.fn.live).call($(document), 'click', '.banusr', function (e) {
			e.preventDefault();
			var uid = $(this).attr('data-uid');
			$("#banlselector").select2("val", uid);
		});

		($.fn.on || $.fn.live).call($(document), 'click', '#banunbutton', function (e) {
			e.preventDefault();
			if ($('#banlselector option:selected').val()!=null) {
				uid = $('#banlselector option:selected').val();
				if (parseInt(uid)==parseInt(msbvar.mybbuid)) {
					if(!$('#banyourself').length) {
						$('<div/>', { id: 'banyourself', class: 'top-right' }).appendTo('body');
					}
					setTimeout(function() {
						$('#banyourself').jGrowl(ban_selflan, { life: 1500 });
					},200);
				}
				else {
					socket.emit('updbanl', {uid: parseInt(uid)});
					socket.emit('message', {msg:banlist_modmsglan, nickto:'0', colorsht: colorshout, uidto:0, type: 'system'});
				}
			}
			$.modal.close();
		});

		function noticefunc(notice) {
			heightwin = 120;
			$('body').append( '<div class="noticemod"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+not_msglan+':</strong></div></td></tr><td class="trow1"><textarea id="noticetext" style="width:97%;height: '+heightwin*0.3+'px;" >'+notice+'</textarea></td></table></div><td><button id="sv_notice" style="margin:4px;">'+shout_savelan+'</button></td></div>' );
			$('.noticemod').modal({ zIndex: 7 });
		}

		var banbut = [
			'<a class="sceditor-button" title="'+ban_syslan+'" id="banusr">',
				'<div style="background-image: url('+rootpath+'/images/buddy_delete.png); opacity: 1; cursor: pointer;">'+ban_syslan+'</div>',
			'</a>'
		];
		$(banbut.join('')).appendTo('.sceditor-group:last');

		($.fn.on || $.fn.live).call($(document), 'click', '#banusr', function (e) {
			socket.emit('getpml', function (data) {});
			socket.once('getpml', function (data) {
				banusr(data);
			});
		});

		var notice = [
			'<a class="sceditor-button" title="'+not_msglan+'" id="notice">',
				'<div style="background-image: url('+rootpath+'/images/icons/information.png); opacity: 1; cursor: pointer;">'+not_msglan+'</div>',
			'</a>'
		];
		$(notice.join('')).appendTo('.sceditor-group:last');

		($.fn.on || $.fn.live).call($(document), 'click', '#notice', function (e) {
			socket.emit('getnot', function (data) {});
			socket.once('getnot', function (data) {
				var notice = '';
				if (data) {
					notice = escapeHtml(data.not);
				}
				noticefunc(notice);
			});
		});

		var prune = [
			'<a class="sceditor-button" title="'+prune_msglan+'" id="prune">',
				'<div style="background-image: url('+rootpath+'/images/invalid.png); opacity: 1; cursor: pointer;">'+prune_msglan+'</div>',
			'</a>'
		];
		$(prune.join('')).appendTo('.sceditor-group:last');

		($.fn.on || $.fn.live).call($(document), 'click', '#prune', function (e) {
			prunefunc();
		});

		($.fn.on || $.fn.live).call($(document), 'click', '#sv_notice', function (e) {
			e.preventDefault();
			socket.emit('message', {msg:not_modmsglan, nickto:'0', colorsht: colorshout, uidto:0, type: 'system'});
			var textnot = escapeHtml($('#noticetext').val());
			socket.emit('updnot', {not:textnot});
			$.modal.close();
		});

		($.fn.on || $.fn.live).call($(document), 'click', '#prune_yes', function (e) {
			e.preventDefault();
			socket.emit('purge', function () {});
			socket.once('purge', function () {
				$('.msgShout').remove();
				setTimeout(function() {
					socket.emit('message', {msg:shout_prunedmsglan, nickto:'0', colorsht: colorshout, uidto:0, type: 'system'});
				},50);
			});
			$.modal.close();
		});
	}

	($.fn.on || $.fn.live).call($(document), 'click', '#del_shout', function (e) {
		e.preventDefault();
		var id = $(this).attr('data-delid'),
		heightwin = 120;
		$('body').append( '<div class="del"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+del_msglan+':</strong></div></td></tr><td class="trow1">'+conf_questlan+'</td></table></div><td><button id="del_yes" style="margin:4px;" ided="'+id+'">'+shout_yeslan+'</button><button id="del_no" style="margin:4px;">'+shout_nolan+'</button></td></div>' );
		$('.del').modal({ zIndex: 7 });
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#del_yes', function (e) {
		e.preventDefault();
		var id = $(this).attr('ided');
		socket.emit('rmvmsg', {id:id});
		$('#shout_text').sceditor('instance').val('').focus();
		$('#shout_text').attr("data-type", "shout");
		$('#cancel_edit').remove();
		$('#del_shout').remove();
		$.modal.close();
	});

	socket.on('rmvmsg', function (data) {
		if (data) {
			$('div.wrapShout').children('div.'+data.id+'').remove();
		}
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#del_no', function (e) {
		e.preventDefault();
		$('#shout_text').sceditor('instance').val('').focus();
		$('#shout_text').attr("data-type", "shout");
		$('#cancel_edit').remove();
		$('#del_shout').remove();
		$.modal.close();
	});

	function buildpml(nicks,uid,i) {
		$("#pmlselector").append('<option value="'+parseInt(uid)+'" data-i="'+parseInt(i)+'">'+nicks+'</option>');
	}

	function pmlfunc(docs) {
		pmdata = docs;
		heightwin = 120;
		$('body').append( '<div class="pmlmod"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+pm_tolan.trim()+':</strong></div></td></tr><td class="trow1"><select id="pmlselector" style="width:100%"></select></td></table></div><td><button id="ok_select" style="margin:4px;">'+pm_lan+'</button></td></div>' );
		for (var i = docs.length-1; i >= 0; i--) {
			buildpml(docs[i].nicks, parseInt(docs[i].uid), i);
		}
		$("#pmlselector").select2();
		$('.pmlmod').modal({ zIndex: 7 });
	}

	($.fn.on || $.fn.live).call($(document), 'click', '#ok_select', function (e) {
		e.preventDefault();
		if ($('#pmlselector option:selected').val()!=null) {
			uid = $('#pmlselector option:selected').val();
			index = $('#pmlselector option:selected').attr('data-i');
			nick = pmdata[index].nicks;
			if (parseInt(dcusrname)) {
				nick = nick.replace(/(<([^>]+)>)/ig,"");
			}
			genpmfun(uid,nick);
		}
		$.modal.close();
	});

	function soundfunc() {
		heightwin = 120;
		$('body').append( '<div class="sound"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+sound_lan+'</strong></div></td></tr><tr><td class="tcat">'+volume_lan+':</td></tr><tr><td class="trow1" style="text-align:center;">'+min_lan+'<input id="s_volume" type="range" min="0" max="1" step="0.05" value="'+shoutvol+'"/>'+max_lan+'</td></tr></table></div><td></div>' );
		var soundinput = document.getElementById("s_volume");
		soundinput.addEventListener("input", function() {
			var sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
			if (!sb_sty) {
				sb_sty = {};
			}
			sb_sty['sound'] = soundinput.value;
			localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
			shoutvol = soundinput.value;
		}, false);
		$('.sound').modal({ zIndex: 7 });
	}

	var sound = [
		'<a class="sceditor-button" title="'+sound_lan+'" id="sound">',
			'<div style="background-image: url('+rootpath+'/images/sound.png); opacity: 1; cursor: pointer;">'+sound_lan+'</div>',
		'</a>'
	];
	$(sound.join('')).appendTo('.sceditor-group:last');

	($.fn.on || $.fn.live).call($(document), 'click', '#sound', function (e) {
		soundfunc();
	});

	var pmlist = [
		'<a class="sceditor-button" title="'+pm_lan+'" id="pml">',
			'<div style="background-image: url('+rootpath+'/images/new_pm.png); opacity: 1; cursor: pointer;">'+pm_lan+'</div>',
		'</a>'
	];
	$(pmlist.join('')).appendTo('.sceditor-group:last');

	($.fn.on || $.fn.live).call($(document), 'click', '#pml', function (e) {
		socket.emit('getpml', function (data) {});
		socket.once('getpml', function (docs) {
			pmlfunc(docs);
		});
	});

	if (parseInt(actcolor)) {
		var colorpicker = [
			'<input type="color" value="'+colorshout+'" id="font_color">'
		];
		$(colorpicker.join('')).appendTo('.sceditor-group:last');

		var theInput = document.getElementById("font_color");
		theInput.addEventListener("input", function() {
			var sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
			if (!sb_sty) {
				sb_sty = {};
			}
			sb_sty['color'] = theInput.value;
			localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
			if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(theInput.value)) {
				colorshout = theInput.value;
			}
		}, false);
	}

	var log = [
		'<a class="sceditor-button" title="'+log_msglan+'" id="log">',
			'<div style="background-image: url('+rootpath+'/images/log.png); opacity: 1; cursor: pointer;">'+log_msglan+'</div>',
		'</a>'
	];
	$(log.join('')).appendTo('.sceditor-group:last');

	($.fn.on || $.fn.live).call($(document), 'click', '#htmlgenerator', function (e) {
		e.preventDefault();
		var elHtml = document.getElementsByClassName('loglist')[0].innerHTML,
		link = document.createElement('a'),
		mimeType = 'text/html',
		now = moment().utcOffset(parseInt(zoneset)).format(zoneformt);
		link.id = "loglink",
		link.setAttribute('download', 'log('+document.getElementById('pagecount').innerHTML+')('+now+').html');
		link.setAttribute('href', 'data:' + mimeType  +	 ';charset=utf-8,' + encodeURIComponent(elHtml));
		document.getElementsByClassName('loglist')[0].appendChild(link);
		$('a#loglink')[0].click();
	});
	
	function logofffunc() {
		heightwin = 120;
		$('body').append( '<div class="logoff"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+logofflang+':</strong></div></td></tr><td class="trow1">'+conf_questlan+'</td></table></div><td><button id="logoff_yes" style="margin:4px;">'+shout_yeslan+'</button><button id="no_ans" style="margin:4px;">'+shout_nolan+'</button></td></div>' );
		$('.logoff').modal({ zIndex: 7 });
	}

	var logoff = [
		'<a class="sceditor-button" title="'+logofflang+'" id="logoff">',
			'<div style="background-image: url('+rootpath+'/images/logoff.png); opacity: 1; cursor: pointer;">'+logofflang+'</div>',
		'</a>'
	];
	$(logoff.join('')).appendTo('.sceditor-group:last');

	($.fn.on || $.fn.live).call($(document), 'click', '#logoff', function (e) {
		logofffunc();
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#logoff_yes', function (e) {
		e.preventDefault();
		msb_token = JSON.parse(localStorage.getItem('msb_token'));
		if (msb_token) {
			localStorage.removeItem('msb_token');
		}
		sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
		if (!sb_sty) {
			sb_sty = {};
		}
		sb_sty['logoff'] = 1;
		localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
		location.reload();
	});
		
	($.fn.on || $.fn.live).call($(document), 'click', '#no_ans', function (e) {
		e.preventDefault();
		$.modal.close();
	});

	($.fn.on || $.fn.live).call($(document), 'dblclick', '.msgShout', function (e) {
		var id = $(this).attr('data-ided');
		function edtfunc(msg, uid){
			msg = revescapeHtml(msg);
			if (uid == msbvar.mybbuid || $.inArray(parseInt(msbvar.mybbusergroup), msbvar.miunamodgroups.split(',').map(function(modgrup){return Number(modgrup);}))!=-1) {
				$('#shout_text').attr( {"data-type": "edit", "data-id": id} );
				$('#shout_text').sceditor('instance').val(msg);
				if(!$('#cancel_edit').length) {
					$('#miunashoutbox-form').append('<button id="cancel_edit" style="margin:4px;">'+cancel_editlan+'</button><button id="del_shout" style="margin:4px;" data-delid='+id+'>'+shout_delan+'</button>');
				}
			}
			else {
				if(!$('#upd_alert').length) {
					$('<div/>', { id: 'upd_alert', class: 'bottom-right' }).appendTo('body');
				}
				setTimeout(function() {
					$('#upd_alert').jGrowl(perm_msglan, { life: 500 });
				},200);
			}
		}
		socket.emit('readonemsg', {id:id});
		socket.once('readonemsg', function (docs) {
			edtfunc(docs.msg, parseInt(docs.uid));
		});
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#cancel_edit', function (e) {
		e.preventDefault();
		$('#shout_text').sceditor('instance').val('').focus();
		if ($('.pmtab.selected').length) {
			uid = $(this).attr('data-uidpmtab');
			nickto = $(this).children('.pmuser').html();
			$('#shout_text').attr({"data-type":"pm", "data-tbuid":uid, "data-nicktopm":nickto});
		}
		else {
			$('#shout_text').attr("data-type", "shout");
		}
		$('#cancel_edit').remove();
		$('#del_shout').remove();
	});

	($.fn.on || $.fn.live).call($(document), 'click', '.username_msgShout', function (e) {
		e.preventDefault();
		var uid = $(this).parent().attr('data-uid'),
		nick = $(this).html();
		genpmfun(uid,nick);
	});

	($.fn.on || $.fn.live).call($(document), 'click', '.usron', function (e) {
		e.preventDefault();
		var uid = $(this).attr('data-uid'),
		nick = $(this).html();
		genpmfun(uid,nick);
	});

	($.fn.on || $.fn.live).call($(document), 'click', '.pm_inf', function (e) {
		e.preventDefault();
	});

	($.fn.on || $.fn.live).call($(document), 'click', '.closetab', function (e) {
		e.preventDefault();
		var uid = $(this).parent().attr('data-uidpmtab');
		$(this).parent().remove();
		$("[data-uidpm="+uid+"]").remove();
		$(".tabShout").removeClass( "selected" );
		$(".shouttab").addClass( "selected" );
		$('.wrapShout').hide();
		$('.shoutarea').show();
		if(direction!='top'){
			$(".shoutarea").animate({
				scrollTop: ($(".shoutarea")[0].scrollHeight)
			}, 10);
		}
		$('#shout_text').attr("data-type", "shout");
	});

	($.fn.on || $.fn.live).call($(document), 'click', '.pmuser', function (e) {
		e.preventDefault();
		var uid = $(this).parent().attr('data-uidpmtab'),
		nick = $(this).html().trim();
		$(".tabShout").removeClass( "selected" );
		$(this).parent().addClass( "selected" );
		$('.wrapShout').hide();
		$("[data-uidpm="+uid+"]").show();
		if(direction!='top'){
			$('[data-uidpm='+uid+']').animate({
				scrollTop: ($('[data-uidpm='+uid+']')[0].scrollHeight)
			}, 10);
		}
		$('#shout_text').attr({"data-type": "pm", "data-tbuid": uid, "data-nicktopm": nick});
	});

	($.fn.on || $.fn.live).call($(document), 'click', '.shouttab', function (e) {
		e.preventDefault();
		$(".tabShout").removeClass( "selected" );
		$(".shouttab").addClass( "selected" );
		$('.wrapShout').hide();
		$('.shoutarea').show();
			if(direction!='top'){
				$(".shoutarea").animate({
					scrollTop: ($(".shoutarea")[0].scrollHeight)
				}, 10);
			}
		$('#shout_text').attr("data-type", "shout");
	});

	($.fn.on || $.fn.live).call($(document), 'click', '.actusr', function (e) {
		e.preventDefault();
		$(".tabShout").removeClass( "selected" );
		$(".actusr").addClass( "selected" );
		$('.numusr').html('<div id="onnow"></div>');
		Object.keys(usrlist).map(function(key){displaylistuser(usrlist[key],key)});
		function displaylistuser(usrlist,key){
			if (parseInt(dcusrname)) {
				usrlist = usrlist.replace(/(<([^>]+)>)/ig,"");
			}
			$("#onnow").prepend('<span class="usron" data-uid="'+parseInt(key)+'">'+usrlist+'</span>, ');
		};
		var onowlist = $('#onnow').html();
		if (onowlist) {
			$('#onnow').html(onowlist.slice(0, -2));
		};
		$('.wrapShout').hide();
		$('.numusr').show();
	});
}

$(document).ready(function($) {
	'use strict';

	var $document = $(document);

	/***********************
	 * Add custom MyBB CSS *
	 ***********************/
	$('<style type="text/css">' +
		'.sceditor-dropdown { text-align: ' + ($('body').css('direction') === 'rtl' ? 'right' :'left') + '; }' +
	'</style>').appendTo('body');

	/***********************
	 * Add Spoiler command *
	 ***********************/
	$.sceditor.plugins.bbcode.bbcode.set("spoiler", {
		format: '[spoiler]{0}[/spoiler]',
		html: '[spoiler]{0}[/spoiler]'
	});

	$.sceditor.command.set("spoiler", {
		_dropDown: function (editor, caller, html) {
			var $content;

			$content = $(
				'<div>' +
					'<label for="des">' + editor._('Description (optional):') + '</label> ' +
					'<input type="text" id="des" />' +
				'</div>' +
				'<div><input type="button" class="button" value="' + editor._('Insert') + '" /></div>'
			);

			$content.find('.button').click(function (e) {
				var	   description = $content.find('#des').val(),
					descriptionAttr = '',
					before = '[spoiler]',
					end = '[/spoiler]';

				if (description) {
				   descriptionAttr = '=' + description + '';
				   before = '[spoiler'+ descriptionAttr +']';
				}

				if (html) {
					before = before + html + end;
					end	   = null;
				}

				editor.insert(before, end);
				editor.closeDropDown(true);
				e.preventDefault();
			});

			editor.createDropDown(caller, 'insertspoiler', $content);
		},
		exec: function () {
			this.wysiwygEditorInsertHtml('[spoiler]', '[/spoiler]');
		},
		txtExec: ['[spoiler]', '[/spoiler]'],
		tooltip: ''+add_spolang+''
	});

	/*************
	 * Imgur Tag *
	 *************/
	$.sceditor.command.set("imgur", {
		exec: function ()
		{
			document.querySelector('textarea').insertAdjacentHTML( 'afterEnd', '<input class="imgur" style="visibility:hidden;position:absolute;top:0;" type="file" onchange="upload(this.files[0])" accept="image/*">' );
			document.querySelector('input.imgur').click();
		},
		txtExec: function()
		{
			document.querySelector('textarea').insertAdjacentHTML( 'afterEnd', '<input class="imgur" style="visibility:hidden;position:absolute;top:0;" type="file" onchange="upload(this.files[0])" accept="image/*">' );
			document.querySelector('input.imgur').click();
		},
		tooltip: ''+upimgurlang+''
	});

	$.sceditor.plugins.bbcode.bbcode.set("imgur", {
		tags: {
			pre: null
		},
		format: function ()
		{
			document.querySelector('textarea').insertAdjacentHTML( 'afterEnd', '<input class="imgur" style="visibility:hidden;position:absolute;top:0;" type="file" onchange="upload(this.files[0])" accept="image/*">' );
			document.querySelector('input.imgur').click();
		},
		html: function ()
		{
			document.querySelector('textarea').insertAdjacentHTML( 'afterEnd', '<input class="imgur" style="visibility:hidden;position:absolute;top:0;" type="file" onchange="upload(this.files[0])" accept="image/*">' );
			document.querySelector('input.imgur').click();
		}
	});

	/*************************************
	 * Remove last bits of table support *
	 *************************************/
	$.sceditor.command.remove('table');
	$.sceditor.plugins.bbcode.bbcode.remove('table')
					.remove('tr')
					.remove('th')
					.remove('td');
});

/*****************************
 * Add imgur upload function *
 *****************************/
function upload(file) {

	/* Is the file an image? */
	if (!file || !file.type.match(/image.*/)) return;

	/* It is! */
	document.body.className = "uploading";
	var d = document.querySelector(".sceditor-button-imgur div");
	d.className = d.className + " imgurup";

	/* Lets build a FormData object*/
	var fd = new FormData(); // I wrote about it: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
	fd.append("image", file); // Append the file
	var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
	xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
	xhr.onload = function() {
		var code = JSON.parse(xhr.responseText).data.link;
		$('#shout_text').data('sceditor').insert(code);
		var d = document.querySelector(".sceditor-button-imgur div.imgurup");
		d.className = d.className - " imgurup";
		document.querySelector('input.imgur').remove();
	}
	// Ok, I don't handle the errors. An exercice for the reader.
	xhr.setRequestHeader('Authorization', 'Client-ID '+imgurapi+'');
	/* And now, we send the formdata */
	xhr.send(fd);
};
