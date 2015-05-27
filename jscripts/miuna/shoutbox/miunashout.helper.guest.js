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

function imgconv(key) {
	$("div."+key+", [data-idpos="+key+"]").find( "a[href*='.jpg'], a[href*='.gif'], a[href*='.png']" ).each(function(e) {
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
	if ($.inArray(parseInt(gid), msbvar.miunamodgroups.split(',').map(function(modgrupshout){return Number(modgrupshout);}))!=-1) {
		coloruser = moduser_color;
	}
	else {
		coloruser = commonuser_color;
	}
	if (coloruser.trim()) {
		stylecluser = 'style="color:'+coloruser+'"'
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
		pmspan = "<span class='pm_inf'>["+lanpm+" "+escapeHtml(nickto)+"] </span>";
	}
	if(type == 'shout' || type == 'pmshout') {
		$(""+area+"")[preapp]("<div class='msgShout "+count+" "+escapeHtml(key)+"' data-uid="+parseInt(uid)+" data-ided="+escapeHtml(key)+">"+usravatar+"<span class='time_msgShout'><span>[</span>"+hour+"<span>]</span></span>"+pmspan+"<span class='username_msgShout' "+stylecluser+">"+escapeHtml(username)+"</span>:<span class='content_msgShout' "+shoutcolor+">"+message+"</span></div>");
	}
	if(type == 'system' || type == 'pmsystem') {
		$(""+area+"")[preapp]("<div class='msgShout "+count+" "+escapeHtml(key)+"' data-uid="+parseInt(uid)+" data-ided="+escapeHtml(key)+">"+usravatar+""+pmspan+"*<span class='username_msgShout' "+stylecluser+">"+escapeHtml(username)+"</span><span class='content_msgShout' "+shoutcolor+">"+message+"</span>*</div>");
	}
	if(cur==0) {
		if (reqtype == 'lognext' || reqtype == 'logback') {
			if(parseInt(actaimg)) {
				imgconvlog();
			}
			if(direction!='top') {
				scrollmiunalog();
			}
		}
		else {
			if(parseInt(actaimg)) {
				imgconv(count);
			}
			if(direction!='top') {
				scrollmiuna(key,scrollarea,ckold,count);
			}
		}
	}
}

function miunashout() {
	var usrlist = '',
	uidlist = '',
	connected = false;

	function addParticipantsMessage (data) {
		$('.actusr').text(''+usractlan+' '+Object.keys(data.usernames).length+'');
	}

	socket.once('login', function (data) {
		connected = true;
		addParticipantsMessage(data);
		usrlist = data.usernames;
		uidlist = data.uidlist;
		socket.emit('getoldmsg', {ns: numshouts, uid:msbvar.mybbuid});
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
	
	socket.emit('add user', {nick:msbvar.mybbusername, uidts:parseInt(msbvar.mybbuid)});	

	socket.emit('getnot', function (data) {});
	socket.once('getnot', function (data) {
		if (data) {
			$(".notshow").text(escapeHtml(data.not));
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

	function displayMsg(reqtype, message, username, uidp, uid, gid, colorsht, avatar, nickto, edt, type, key, created, ckold, cur){
		var hour = moment(created).utcOffset(parseInt(zoneset)).format(zoneformt);
		message = regexmiuna(escapeHtml(revescapeHtml(message))),
		nums = numshouts;
		if (reqtype=='lognext' || reqtype=='logback') {
			nums = mpp;
		}
		shoutgenerator(reqtype,key,uidp,uid,gid,colorsht,avatar,hour,username,nickto,message,type,ckold,direction,nums,cur);
		if (uidlist[uid]==1) {
			$("[data-uid="+uid+"]").find(".time_msgShout span").css("color",on_color);
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
		$('div.'+key+'').children('.content_msgShout').html(message);
		$("div."+key+"").css("background-color",edt_color);
	}

	socket.on('updmsg', function (data) {
		if (data) {
			updmsg(data.newmsg, data.id);
		}
	});

	socket.on('rmvmsg', function (data) {
		if (data) {
			$('div.wrapShout').children('div.'+data.id+'').remove();
		}
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
		Object.keys(usrlist).map(function(key){displaylistuser(usrlist[key])});
		function displaylistuser(usrlist){
			$("#onnow").prepend('<span class="usron">'+escapeHtml(usrlist)+', </span>');
		};
		var lstusrname = $('.usron:last').html();
		if (lstusrname) {
			$('.usron:last').html(lstusrname.slice(0, -2));
		}
		$('.wrapShout').hide();
		$('.numusr').show();
	});
}