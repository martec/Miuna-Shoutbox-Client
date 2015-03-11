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
			res = patt.exec(mentregex[i]);
			if (nick.toUpperCase() == String(res).toUpperCase()) {
				return 1;
			}
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
	$("div."+type+", [data-idpos="+type+"]").find( "a[href*='.jpg'], a[href*='.gif'], a[href*='.png']" ).each(function(e) {
		var imgsrc = $(this).attr('href');
		if (!$(this).children("img").length) {
			$(this).empty().append( '<img src="'+ imgsrc +'" style="max-width:80px; max-height:80px" />' );
		}
	});
}

function imgconvlog() {
	$("div.msglog").find( "a[href*='.jpg'], a[href*='.gif'], a[href*='.png']" ).each(function(e) {
		var imgsrc = $(this).attr('href');
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
		$("div."+imgarea+" img, [data-idpos="+key+"] img").one("load", function() {
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

function shoutgenerator(reqtype,key,uidp,uid,hour,username,nickto,stylesheet,message,type,ckold,direction,numshouts,cur) {
	var preapp = lanpm = pmspan = area = scrollarea = count = '';
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
	if ((reqtype == 'shout' || reqtype == 'lognext' || reqtype == 'logback') && (type == 'pmshout' || type == 'pmsystem')) {
		pmspan = "<span class='pm_inf'>["+lanpm+" "+nickto+"] </span>";
	}
	if(type == 'shout' || type == 'pmshout') {
		$(""+area+"")[preapp]("<div class='msgShout "+count+" "+key+"' data-uid="+uid+" data-ided="+key+"><span class='time_msgShout'><span>[</span>"+hour+"<span>]</span></span>"+pmspan+"<span class='username_msgShout'>"+username+"</span>:<span class='content_msgShout' style='"+stylesheet+"'>"+message+"</span></div>");
	}
	if(type == 'system' || type == 'pmsystem') {
		$(""+area+"")[preapp]("<div class='msgShout "+count+" "+key+"' data-uid="+uid+" data-ided="+key+">"+pmspan+"*<span class='username_msgShout'>"+username+"</span><span class='content_msgShout' style='"+stylesheet+"'>"+message+"</span>*</div>");
	}
	if(cur==0) {
		if (reqtype == 'lognext' || reqtype == 'logback') {
			imgconvlog();
			if(direction!='top') {
				scrollmiunalog();
			}
		}
		else {
			imgconv(count);
			if(direction!='top') {
				scrollmiuna(key,scrollarea,ckold,count);
			}
		}
	}
}

function miunashout(mybbuid, mybbusername, name_link, mybbusergroup, miunamodgroups) {
	var notban = '1',
	timeafter = floodtime,
	flooddetect,
	usercss = '',
	usrlist = '',
	uidlist = '',
	pmdata = '',
	connected = false;

	if (parseInt(destyle)) {
		usercss = defstyle;
	}
	else {
		sb_sty_ft = JSON.parse(localStorage.getItem('sb_st_ft'));
		if (sb_sty_ft) {
			usercss = escapeHtml(sb_sty_ft['ft_sty']);
		}
	}

	($.fn.on || $.fn.live).call($(document), 'click', '#update', function (e) {
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
		sb_sty['color'] = $("#font_color").val();
		sb_sty['size'] = $("#fontsize option:selected").val();
		sb_sty['font'] = $("#fontsty option:selected").val();
		sb_sty['bold'] = $("#Bold option:selected").val();
		sb_sty['em'] = $("#Italic option:selected").val();
		sb_sty['und'] = $("#Underline option:selected").val();
		sb_sty['strike'] = $("#Strike option:selected").val();
		localStorage.setItem('sb_st_lc', JSON.stringify(sb_sty));

		if ($("#Bold option:selected").val()==1) {
			bold = "bold";
		}
		if ($("#Italic option:selected").val()==1) {
			em = "italic";
		}
		if ($("#Underline option:selected").val()==1) {
			und = "underline";
		}
		if ($("#Strike option:selected").val()==1) {
			strike = "line-through";
		}

		var fmtsty = "color: "+sb_sty['color']+";font-size: "+sb_sty['size']+"px;font-family: "+sb_sty['font']+";font-weight: "+bold+"; font-style: "+em+"; text-decoration: "+und+"; text-decoration: "+strike+";";
		sb_sty_ft['ft_sty'] = fmtsty;
		localStorage.setItem('sb_st_ft', JSON.stringify(sb_sty_ft));
		if(!$('#upd_alert').length) {
			$('<div/>', { id: 'upd_alert', class: 'bottom-right' }).appendTo('body');
		}
		setTimeout(function() {
			$('#upd_alert').jGrowl(''+updconfiglan+'', { life: 500 });
		},200);
		if (sb_sty_ft) {
			usercss = escapeHtml(sb_sty_ft['ft_sty']);
		}
		$.modal.close();
	});

	function addParticipantsMessage (data) {
		$('.actusr').text(''+usractlan+' '+Object.keys(data.usernames).length+'');
	}

	socket.once('login', function (data) {
		connected = true;
		addParticipantsMessage(data);
		usrlist = data.usernames;
		uidlist = data.uidlist;
		socket.emit('getoldmsg', {ns:numshouts, uid:mybbuid});
		socket.emit('updpml', {uid:mybbuid, nick:name_link, nicks:mybbusername});
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

	socket.emit('add user', {nick:name_link, uidts:parseInt(mybbuid)});

	socket.emit('getnot', function (data) {});
	socket.once('getnot', function (data) {
		if (data) {
			$(".notshow").text(data.not);
		}
	});

	socket.emit('getbanl', function (data) {});
	socket.once('getbanl', function (data) {
		if (data) {
			var listban = data.ban;
			if ($.inArray(parseInt(mybbuid), listban.split(',').map(function(listban){return Number(listban);}))!=-1) {
				notban = 0;
			}
		}
	});

	socket.on('updnot', function (data) {
		if (data) {
			$(".notshow").text(data.not);
		}
		else {
			$(".notshow").text('');
		}
	});

	socket.on('updbanl', function (data) {
		if (data) {
			var listban = data.ban;
			if ($.inArray(parseInt(mybbuid), listban.split(',').map(function(listban){return Number(listban);}))!=-1) {
				notban = 0;
			}
			else {
				notban = 1;
			}
		}
		else {
			notban = 1;
		}
	});

	$('#shout_text').sceditor('instance').bind('keypress', function(e) {
		if(e.which == 13) {
			if (timeafter >= floodtime) {
				if (notban) {
					stopflood();
					flooddetect = setInterval(function() {
						timeafter += 1;
					}, 1000);
					if ($('#shout_text').attr('data-type')=='shout') {

						var msg = escapeHtml($('#shout_text').sceditor('instance').val());

						if(msg == '' || msg == null) {
							$('#shout_text').sceditor('instance').val('').focus();
							return false;
						}
						else {
							$('#shout_text').sceditor('instance').val('').focus();
							if ( /^\/me[\s]+(.*)$/.test(msg) ) {
								socket.emit('message', {nick:name_link, msg:msg.slice(4), nickto:0, uid:parseInt(mybbuid), uidto:0, suid:''+parseInt(mybbuid)+',0',stylesheet:usercss, type: 'system'});
							}
							else {
								socket.emit('message', {nick:name_link, msg:msg, nickto:0, uid:parseInt(mybbuid), uidto:0, suid:''+parseInt(mybbuid)+',0',stylesheet:usercss, type: 'shout'});
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
								socket.emit('message', {nick:name_link, msg:msg.slice(4), nickto:nick_to, uid:parseInt(mybbuid), uidto:uid_to, suid:''+parseInt(mybbuid)+','+uid_to+'', stylesheet:usercss, type: 'pmsystem'});
							}
							else {
								socket.emit('message', {nick:name_link, msg:msg, nickto:nick_to, uid:parseInt(mybbuid), uidto:uid_to, suid:''+parseInt(mybbuid)+','+uid_to+'', stylesheet:usercss, type: 'pmshout'});
							}
							return false;
						}
					}
					else if ($('#shout_text').attr('data-type')=='edit') {
						var msg = escapeHtml($('#shout_text').sceditor('instance').val());

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
						$('<div/>', { id: 'upd_alert', class: 'bottom-right' }).appendTo('body');
					}
					setTimeout(function() {
						$('#upd_alert').jGrowl(usr_banlang, { life: 500 });
					},200);
					return;
				}
			}
			else {
				if(!$('#upd_alert').length) {
					$('<div/>', { id: 'upd_alert', class: 'bottom-right' }).appendTo('body');
				}
				setTimeout(function() {
					diftime = floodtime - timeafter;
					$('#upd_alert').jGrowl(flood_msglan+diftime+secounds_msglan, { life: 500 });
				},50);
				return;
			}
		}
	});

	function stopflood() {
		if(typeof flooddetect!='undefined') {
			clearInterval(flooddetect);
			timeafter = 0;
		}
	}

	function displayMsg(reqtype, message, username, uidp, uid, nickto, edt, stylesheet, type, key, created, ckold, cur){
		var hour = moment(created).utcOffset(parseInt(zoneset)).format(zoneformt);
		message = regexmiuna(message),
		nums = numshouts;
		if (reqtype=='lognext' || reqtype=='logback') {
			nums = mpp;
		}
		shoutgenerator(reqtype,key,uidp,uid,hour,username,nickto,stylesheet,message,type,ckold,direction,nums,cur);
		if (uidlist[uid]==1) {
			$("[data-uid="+uid+"]").find(".time_msgShout span").css("color",on_color);
		}
		if (regexment(message,mybbusername)) {
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

	function checkMsg(req, msg, nick, nickto, uid, uidto, edt, stylesheet, type, _id, created, ckold, cur) {
		var mtype = 'shout';
		if (req=='lognext' || req=='logback') {
			mtype = req;
		}
		if (nickto==0) {
			displayMsg(mtype, msg, nick, uid, uid, nickto, edt, stylesheet, type, _id, created, ckold, cur);
		}
		else {
			if (uid==mybbuid) {
				if (req=="msg" || req=='lognext' || req=='logback') {
					displayMsg(mtype, msg, nick, uidto, uid, nickto, edt, stylesheet, type, _id, created, ckold, cur);
				}
				if ($("[data-uidpm="+uidto+"]").length && req!='lognext' && req!='logback') {
					displayMsg("pm", msg, nick, uidto, uid, nickto, edt, stylesheet, type, _id, created, ckold, cur);
				}
				else {
					return;
				}
			}
			else if (uidto==mybbuid) {
				if (req=="msg" || req=='lognext' || req=='logback') {
					displayMsg(mtype, msg, nick, uid, uid, nickto, edt, stylesheet, type, _id, created, ckold, cur);
				}
				if($("[data-uidpm="+uid+"]").length && req!='lognext' && req!='logback') {
					displayMsg("pm", msg, nick, uid, uid, nickto, edt, stylesheet, type, _id, created, ckold, cur);
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
			checkMsg("msg", docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].uidto, docs[i].edt, docs[i].stylesheet, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
		}
	});

	socket.on('message', function(data){
		checkMsg("msg", data.msg, data.nick, data.nickto, data.uid, data.uidto, data.edt, data.stylesheet, data.type, data._id, data.created, 'new', 0);
	});

	function updmsg(message, key){
		message = regexmiuna(message);
		setTimeout(function() {
			imgconv(key);
			if ($('.shoutarea').children().hasClass(key)) {
				scrollmiuna(key,direction,'.shoutarea','new');
			}
			if (typeof $('div.'+key+'').parent('.pmarea').attr('data-uidpm') !== "undefined") {
				area2 = "[data-uidpm="+$('div.'+key+'').parent('.pmarea').attr('data-uidpm')+"]";
				scrollmiuna(key,direction,area2,'new');
			}
		},50);
		var menttest = regexment(message,mybbusername);
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
			updmsg(data.newmsg, data.id);
		}
	});

	function logfunc() {
		socket.emit('logfpgmsg', {mpp:mpp, uid:mybbuid});
		socket.once('logfpgmsg', function(docs){
			for (var i = docs.length-1; i >= 0; i--) {
				checkMsg('lognext', docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].uidto, docs[i].edt, docs[i].stylesheet, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
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
			pagebase = Math.ceil(npostbase/mpp);
			npost = npostbase + pagebase;
			page = Math.ceil(npost/mpp);
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

		socket.emit('countmsg', {uid:mybbuid});
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

			socket.emit('logmsgnext', {id:prevpagefirstid, mpp:mpp, uid:mybbuid});
			socket.once('logmsgnext', function (docs) {
				for (var i = docs.length-1; i >= 0; i--) {
					checkMsg('lognext', docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].uidto, docs[i].edt, docs[i].stylesheet, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
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

			socket.emit('logmsgback', {id:prevpagelastid, mpp:mpp, uid:mybbuid});
			socket.once('logmsgback', function (docs) {
				for (var i = docs.length-1; i >= 0; i--) {
					checkMsg('logback', docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].uidto, docs[i].edt, docs[i].stylesheet, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
				}
			});
		}
	});

	function genpmfun(uid,nick){
		if (mybbuid!=uid) {
			if (!$("[data-uidpmtab="+uid+"]").length) {
				$(".tabShout").removeClass( "selected" );
				$('.wrapShout').hide();
				$('.shoutarea').before( ' <div class="pmtab tabShout selected" data-uidpmtab="'+uid+'"><span class="pmuser" >'+nick+' </span>[<a href="#" class="closetab">x</a>]</div>' ).hide();
				$('.shoutarea').after( '<div class="pmarea wrapShout" data-uidpm="'+uid+'" style="height:'+shout_height+'px;"></div>' );
				$('#shout_text').attr({"data-type": "pm", "data-tbuid": uid, "data-nicktopm": nick});
				socket.emit('getoldpmmsg', {ns: numshouts, suid1:''+parseInt(mybbuid)+','+uid+'', suid2:''+uid+','+parseInt(mybbuid)+''});
				socket.once('load old pm msgs', function(docs){
					for (var i = docs.length-1; i >= 0; i--) {
						checkMsg("pm", docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].uidto, docs[i].edt, docs[i].stylesheet, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
					}
				});
			}
			else {
				$(".tabShout").removeClass( "selected" );
				$("[data-uidpmtab="+uid+"]").addClass( "selected" );
				$('.wrapShout').hide();
				$("[data-uidpm="+uid+"]").show();
				$('#shout_text').attr({"data-type": "pm", "data-tbuid": uid, "data-nicktopm": nick});
				if(direction!='top'){
					$('[data-uidpm='+uid+']').animate({
						scrollTop: ($('[data-uidpm='+uid+']')[0].scrollHeight)
					}, 10);
				}
			}
		}
	}

	if ($.inArray(parseInt(mybbusergroup), miunamodgroups.split(',').map(function(modgrup){return Number(modgrup);}))!=-1) {
		function prunefunc() {
			heightwin = 120;
			$('body').append( '<div class="prune"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+prune_shoutlan+':</strong></div></td></tr><td class="trow1">'+conf_questlan+'</td></table></div><td><button id="prune_yes" style="margin:4px;">'+shout_yeslan+'</button><button id="del_no" style="margin:4px;">'+shout_nolan+'</button></td></div>' );
			$('.prune').modal({ zIndex: 7 });
		}

		function banusr(listban) {
			heightwin = 120;
			$('body').append( '<div class="banlist"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+ban_msglan+':</strong></div></td></tr><td class="trow1"><textarea id="ban_list" style="width:97%;height: '+heightwin*0.3+'px;" >'+listban+'</textarea></td></table></div><td><button id="sv_banlist" style="margin:4px;">'+shout_savelan+'</button></td></div>' );
			$('.banlist').modal({ zIndex: 7 });
		}

		function noticefunc(notice) {
			heightwin = 120;
			$('body').append( '<div class="noticemod"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+not_msglan+':</strong></div></td></tr><td class="trow1"><textarea id="noticetext" style="width:97%;height: '+heightwin*0.3+'px;" >'+notice+'</textarea></td></table></div><td><button id="sv_notice" style="margin:4px;">'+shout_savelan+'</button></td></div>' );
			$('.noticemod').modal({ zIndex: 7 });
		}

		var banbut = [
			'<a class="sceditor-button" title="'+ban_msglan+'" id="banusr">',
				'<div style="background-image: url('+rootpath+'/images/buddy_delete.png); opacity: 1; cursor: pointer;">'+ban_msglan+'</div>',
			'</a>'
		];
		$(banbut.join('')).appendTo('.sceditor-group:last');

		($.fn.on || $.fn.live).call($(document), 'click', '#banusr', function (e) {
			socket.emit('getbanl', function (data) {});
			socket.once('getbanl', function (data) {
				var listban = '';
				if (data) {
					var listban = data.ban;
				}
				banusr(listban);
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
					notice = data.not;
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

		($.fn.on || $.fn.live).call($(document), 'click', '#sv_banlist', function (e) {
			e.preventDefault();
			socket.emit('message', {nick:name_link, msg:banlist_modmsglan, nickto:0, uid:parseInt(mybbuid), uidto:0, suid:''+parseInt(mybbuid)+',0',stylesheet:usercss, type: 'system'});
			var newlist = escapeHtml($('#ban_list').val());
			socket.emit('updbanl', {ban:newlist});
			$.modal.close();
		});

		($.fn.on || $.fn.live).call($(document), 'click', '#sv_notice', function (e) {
			e.preventDefault();
			socket.emit('message', {nick:name_link, msg:not_modmsglan, nickto:0, uid:parseInt(mybbuid), uidto:0, suid:''+parseInt(mybbuid)+',0',stylesheet:usercss, type: 'system'});
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
					socket.emit('message', {nick:name_link, msg:shout_prunedmsglan, nickto:0, uid:parseInt(mybbuid), uidto:0, suid:''+parseInt(mybbuid)+',0',stylesheet:usercss, type: 'system'});
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
		$("#pmlselector").append('<option value="'+uid+'" data-i="'+i+'">'+nicks+'</option>');
	}

	function pmlfunc(docs) {
		pmdata = docs;
		heightwin = 120;
		$('body').append( '<div class="pmlmod"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+pm_tolan.trim()+':</strong></div></td></tr><td class="trow1"><select id="pmlselector"></select></td></table></div><td><button id="ok_select" style="margin:4px;">'+pm_lan+'</button></td></div>' );
		for (var i = docs.length-1; i >= 0; i--) {
			buildpml(docs[i].nicks, docs[i].uid, i);
		}
		$("#pmlselector").select2();
		$('.pmlmod').modal({ zIndex: 7 });
	}

	($.fn.on || $.fn.live).call($(document), 'click', '#ok_select', function (e) {
		e.preventDefault();
		if ($('#pmlselector option:selected').val()!=null) {
			uid = $('#pmlselector option:selected').val();
			index = $('#pmlselector option:selected').attr('data-i');
			nick = pmdata[index].nick;
			genpmfun(uid,nick);
		}
		$.modal.close();
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

	var options = [
		'<a class="sceditor-button" title="'+opt_msglan+'" id="opt">',
			'<div style="background-image: url('+rootpath+'/images/config.png); opacity: 1; cursor: pointer;">'+opt_msglan+'</div>',
		'</a>'
	];
	if (!parseInt(destyle)) {
		$(options.join('')).appendTo('.sceditor-group:last');
	}

	($.fn.on || $.fn.live).call($(document), 'click', '#opt', function (e) {
		$('body').append( '<div id="optpop" style="width: 330px; height:440px"><span id="loadconfarea"></span></div>' );
		$('#loadconfarea').load(''+rootpath+'/usercp.php?action=miuna_config #confload', function() {
			sb_sty = JSON.parse(localStorage.getItem('sb_st_lc'));
			if (!sb_sty) {
				return;
			}
			else {
				$("#Bold").find("option[value=" + sb_sty['bold'] +"]").attr('selected', true);
				$("#Italic").find("option[value=" + sb_sty['em'] +"]").attr('selected', true);
				$("#Underline").find("option[value=" + sb_sty['und'] +"]").attr('selected', true);
				$("#Strike").find("option[value=" + sb_sty['strike'] +"]").attr('selected', true);
				if (sb_sty['color']!=undefined) {
					$("#font_color").val(""+ sb_sty['color'] +"");
				}
				$("#fontsize").find("option[value=" + sb_sty['size'] +"]").attr('selected', true);
				$("#fontsty").find("option[value='" + sb_sty['font'] +"']").attr('selected', true);
			}
		});
		$('#optpop').modal({ zIndex: 7 });
	});

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

	($.fn.on || $.fn.live).call($(document), 'dblclick', '.msgShout', function (e) {
		var id = $(this).attr('data-ided');
		function edtfunc(msg, uid){
			msg = revescapeHtml(msg);
			if (uid == mybbuid || $.inArray(parseInt(mybbusergroup), miunamodgroups.split(',').map(function(modgrup){return Number(modgrup);}))!=-1) {
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
			edtfunc(docs.msg, docs.uid);
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
			$("#onnow").prepend('<span class="usron" data-uid="'+key+'">'+usrlist+'</span>, ');
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
