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

function imgconv(key) {
	$("div."+key+", [data-idpos="+key+"]").find( "a[href*='.jpg'], a[href*='.gif'], a[href*='.png']" ).each(function(e) {
		var imgsrc = $(this).attr('href');
		if (!$(this).children("img").length) {
			$(this).empty().append( '<img src="'+ imgsrc +'" style="max-width:80px; max-height:80px" />' );
		}
	});
}

function scrollmiuna(key,direction,area,ckold) {
	if (direction!='top' && ($(""+area+"").scrollTop() + $(""+area+"")[0].offsetHeight) > ($(""+area+"")[0].scrollHeight - 90) || ckold=='old') {
		$("div."+key+" img, [data-idpos="+key+"] img").one("load", function() {
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

function shoutgenerator(reqtype,key,uidp,uid,hour,username,nickto,stylesheet,message,type,ckold,direction,numshouts) {
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
		  if (direction!='top' && ($(""+scrollarea+"").scrollTop() + $(""+scrollarea+"")[0].offsetHeight) > ($(""+scrollarea+"")[0].scrollHeight - 90) || ckold=='old') {
				$(""+scrollarea+"").animate({scrollTop: ($(""+scrollarea+"")[0].scrollHeight)}, 10);
		  }
	}
	if(type == 'system' || type == 'pmsystem') {
			$(""+area+"")[preapp]("<div class='msgShout "+count+" "+key+"' data-uid="+uid+" data-ided="+key+">"+pmspan+"*<span class='username_msgShout'>"+username+"</span><span class='content_msgShout' style='"+stylesheet+"'>"+message+"</span>*</div>");
			 if (direction!='top' && ($(""+scrollarea+"").scrollTop() + $(""+scrollarea+"")[0].offsetHeight) > ($(""+scrollarea+"")[0].scrollHeight - 90) || ckold=='old') {
				$(""+scrollarea+"").animate({scrollTop: ($(""+scrollarea+"")[0].scrollHeight)}, 10);
		  }
	}
	imgconv(key);
	scrollmiuna(key,direction,scrollarea,ckold);
}

function miunashout(mybbuid, mybbusername, name_link, mybbusergroup, miunamodgroups) {
	var notban = '1',
	timeafter = floodtime,
	flooddetect,
	usercss = '',
	usrlist = '',
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
		socket.emit('getoldmsg', {ns: numshouts, uid:mybbuid});
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

	socket.on('updnot', function (data) {
		if (data) {
			$(".notshow").text(data.not);
		}
		else {
			$(".notshow").text('');
		}
	});

	function displayMsg(reqtype, message, username, uidp, uid, nickto, edt, stylesheet, type, key, created, ckold){
		var hour = moment(created).utcOffset(parseInt(zoneset)).format(zoneformt);
		message = regexmiuna(message),
		nums = numshouts;
		if (reqtype=='log') {
			nums = mpp;
		}
		shoutgenerator(reqtype,key,uidp,uid,hour,username,nickto,stylesheet,message,type,ckold,direction,nums);
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

	function checkMsg(req, msg, nick, nickto, uid, uidto, edt, stylesheet, type, _id, created, ckold) {
		var mtype = 'shout';
		if (req=='lognext' || req=='logback') {
			mtype = req;
		}
		if (nickto==0) {
			displayMsg(mtype, msg, nick, uid, uid, nickto, edt, stylesheet, type, _id, created, ckold);
		}
		else {
			if (uid==mybbuid) {
				if (req=="msg" || req=='lognext' || req=='logback') {
					displayMsg(mtype, msg, nick, uidto, uid, nickto, edt, stylesheet, type, _id, created, ckold);
				}
				if ($("[data-uidpm="+uidto+"]").length && req!='lognext' && req!='logback') {
					displayMsg("pm", msg, nick, uidto, uid, nickto, edt, stylesheet, type, _id, created, ckold);
				}
				else {
					return;
				}
			}
			else if (uidto==mybbuid) {
				if (req=="msg" || req=='lognext' || req=='logback') {
					displayMsg(mtype, msg, nick, uid, uid, nickto, edt, stylesheet, type, _id, created, ckold);
				}
				if($("[data-uidpm="+uid+"]").length && req!='lognext' && req!='logback') {
					displayMsg("pm", msg, nick, uid, uid, nickto, edt, stylesheet, type, _id, created, ckold);
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
			checkMsg("msg", docs[i].msg, docs[i].nick, docs[i].nickto, docs[i].uid, docs[i].uidto, docs[i].edt, docs[i].stylesheet, docs[i].type, docs[i]._id, docs[i].created, 'old');
		}
	});

	socket.on('message', function(data){
		checkMsg("msg", data.msg, data.nick, data.nickto, data.uid, data.uidto, data.edt, data.stylesheet, data.type, data._id, data.created, 'new');
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
			$("#onnow").prepend('<span class="usron">'+usrlist+', </span>');
		};
		var lstusrname = $('.usron:last').html();
		if (lstusrname) {
			$('.usron:last').html(lstusrname.slice(0, -2));
		}
		$('.wrapShout').hide();
		$('.numusr').show();
	});
}