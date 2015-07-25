function addemot(emot, emoturl, qse_area, type) {
	area = '';
	if (type) {
		area = '.yuieditor-emoticons-more_'+qse_area+'';
	}
	else {
		area = '.yuieditor-emoticons_'+qse_area+'';
	}
	$(area).append('<li><a class="yuieditor-emoticons" title="'+emot+'" onclick="editor.insert_text(\' '+emot+' \',\'\', \''+qse_area+'\');$(\'.yuieditor-dropdown\').hide()"><img src="'+emoturl+'" alt="'+emot+'"></a></li>');
}
function createemotlist(qse_area) {
	if (document.getElementsByClassName('yuieditor-emoticons_'+qse_area+'')[0].innerHTML === "") {
		for (var i in emoticons.dropdown) {
			addemot(i, emoticons.dropdown[i], qse_area, 0);
		}
	}
}
function createemotlistmore(qse_area) {
	$('.yuieditor-more-'+qse_area+'').remove();
	$('.yuieditor-emoticons-more_'+qse_area+'').show();
	if (document.getElementsByClassName('yuieditor-emoticons-more_'+qse_area+'')[0].innerHTML === "") {
		for (var i in emoticons.more) {
			addemot(i, emoticons.more[i], qse_area, 1);
		}
	}
}
function emotbutgen(qse_area) {
	return '<a class="yuieditor-button yuieditor-button-emoticon" id="yuieditor-emoticons_'+qse_area+'" data-area="'+qse_area+'" accesskey="y" title="'+yuivar['Insert an emoticon']+'"><div></div></a>';
}
function descbut(type,type2,val,description,ext,qse_area) {
	if (type2==0) {
		if(val) {
			if(description) {
				editor.insert_text('['+type+'='+val+']'+description+'','[/'+type+']', ''+qse_area+'');
			}
			else {
				if(type!='video'){
					editor.insert_text('['+type+'='+val+']','[/'+type+']', ''+qse_area+'');
				}
			}
		}
	}
	if (type2==1) {
		if(description) {
			editor.insert_text('['+type+'='+description+']','[/'+type+']', ''+qse_area+'');
		}
		else {
			editor.insert_text('['+type+']','[/'+type+']', ''+qse_area+'');
		}
	}
	if (type2==2) {
		if(ext && val) {
			if(description) {
				editor.insert_text('['+type+'='+val+'x'+ext+']'+description+'','[/'+type+']', ''+qse_area+'');
			}
			else {
				editor.insert_text('['+type+'='+val+'x'+ext+']','[/'+type+']', ''+qse_area+'');
			}
		}
		else {
			if(description) {
				editor.insert_text('['+type+']'+description+'','[/'+type+']', ''+qse_area+'');
			}
			else {
				editor.insert_text('['+type+']','[/'+type+']', ''+qse_area+'');
			}		
		}
	}
	if (type2==3) {
		editor.insert_text('['+type+']\n[*]','\n[/'+type+']', ''+qse_area+'');
	}
	if (type2==4) {
		editor.insert_text('['+type+'=1]\n[*]','\n[/'+type+']', ''+qse_area+'');
	}
};
function simpbutgen(type,key,butname,type2,desc,qse_area,title) {
	return '<a class="yuieditor-button yuieditor-button-'+type+'" accesskey="'+key+'" onclick="descbut(\''+butname+'\',\''+type2+'\',\'\',\''+desc+'\',\'\',\''+qse_area+'\')" title="'+title+'"><div></div></a>';
}
function toolbar(qse_area) {
	button = '<div id="yuieditor-color_'+qse_area+'_popup" class="yuieditor-dropdown yuieditor-color-picker" style="display: none;">'+
			'<div class="color_palette_placeholder_'+qse_area+'" data-local="'+qse_area+'" data-orientation="h" data-height="7" data-width="10" data-bbcode="true"></div>'+
	'</div>'+
	'<div id="yuieditor-emoticons_'+qse_area+'_popup" class="yuieditor-dropdown yuieditor-insertemoticon yuieditor-insertemoticon-popup" style="display: none;">'+
			'<ul class="yuieditor-insertemoticon yuieditor-emoticons-ul yuieditor-emoticons_'+qse_area+'"></ul>'+
			'<ul class="yuieditor-insertemoticon yuieditor-emoticons-ul yuieditor-emoticons-more_'+qse_area+'" style="display: none;"></ul>'+
	'</div>'+
	'<div class="yuieditor-toolbar">'+
		'<div class="yuieditor-group yuieditor-group_'+qse_area+'">'+
		'</div>'+
	'</div>';
	return button;
};
($.fn.on || $.fn.live).call($(document), 'click', '.yuieditor-button-emoticon', function (e) {
	e.preventDefault();
	qse_area = $(this).attr('data-area');
	$('.yuieditor-emoticons-more_'+qse_area+'').hide();
	createemotlist(qse_area);
	if (!document.getElementsByClassName('yuieditor-more-'+qse_area+'')[0]) {
		$('#yuieditor-emoticons_'+qse_area+'_popup').append('<a class="yuieditor-more yuieditor-more-'+qse_area+'" data-area="'+qse_area+'">'+yuivar.More+'</a>');
	}
});
($.fn.on || $.fn.live).call($(document), 'click', '.yuieditor-more', function (e) {
	e.preventDefault();
	qse_area = $(this).attr('data-area')
	createemotlistmore(qse_area);
});
editor = (function() {
 	return {
 		init: function() {
 			return true;
 		},
 		insert_text: function(d, h, i) {
 			var g, f, e = document.getElementById(i);
 			if (!e) {
 				return false;
 			}
 			if (document.selection && document.selection.createRange) {
 				e.focus();
 				g = document.selection.createRange();
 				g.text = d + g.text + h;
 				e.focus();
 			} else {
 				if (e.selectionStart || e.selectionStart === 0) {
 					var c = e.selectionStart,
 						b = e.selectionEnd,
 						a = e.scrollTop;
 					e.value = e.value.substring(0, c) + d + e.value.substring(c, b) + h + e.value.substring(b, e.value.length);
 					if (d.charAt(d.length - 2) === "=") {
 						e.selectionStart = (c + d.length - 1);
 					} else {
 						if (c === b) {
 							e.selectionStart = b + d.length;
 						} else {
 							e.selectionStart = b + d.length + h.length;
 						}
 					}
 					e.selectionEnd = e.selectionStart;
 					e.scrollTop = a;
 					e.focus();
 				} else {
 					e.value += d + h;
 					e.focus();
 				}
 			}
 		}
 	};
 }())
 
 /**
* Get the HTML for a color palette table.
*
* @param string dir Palette direction - either v or h
* @param int width Palette cell width.
* @param int height Palette cell height.
*/
colorPalette = function(dir, width, height) {
	var r = 0, 
		g = 0, 
		b = 0,
		numberList = new Array(6),
		color = '',
		html = '';

	numberList[0] = '00';
	numberList[1] = '40';
	numberList[2] = '80';
	numberList[3] = 'BF';
	numberList[4] = 'FF';

	var tableClass = (dir == 'h') ? 'horizontal-palette' : 'vertical-palette';
	html += '<table class="not-responsive colour-palette ' + tableClass + '" style="width: auto;">';

	for (r = 0; r < 5; r++) {
		if (dir == 'h') {
			html += '<tr>';
		}

		for (g = 0; g < 5; g++) {
			if (dir == 'v') {
				html += '<tr>';
			}

			for (b = 0; b < 5; b++) {
				color = String(numberList[r]) + String(numberList[g]) + String(numberList[b]);
				html += '<td style="background-color: #' + color + '; width: ' + width + 'px; height: ' + height + 'px;">';
				html += '<a href="#" data-color="' + color + '" style="display: block; width: ' + width + 'px; height: ' + height + 'px; " alt="#' + color + '" title="#' + color + '"></a>';
				html += '</td>';
			}

			if (dir == 'v') {
				html += '</tr>';
			}
		}

		if (dir == 'h') {
			html += '</tr>';
		}
	}
	html += '</table>';
	return html;
};

/**
* Register a color palette.
*
* @param object el jQuery object for the palette container.
*/
registerPalette = function(el,area) {
	var	orientation	= el.attr('data-orientation'),
		height		= el.attr('data-height'),
		width		= el.attr('data-width'),
		target		= el.attr('data-target'),
		bbcode		= el.attr('data-bbcode');

	// Insert the palette HTML into the container.
	el.html(colorPalette(orientation, width, height));

	// Attach event handler when a palette cell is clicked.
	$(el).on('click', 'a', function(e) {
		var color = $(this).attr('data-color');

		var sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
		if (!sb_sty) {
			sb_sty = {};
		}
		color = '#'+color+'';
		sb_sty['color'] = color;
		localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
		if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)) {
			colorshout = color;
		}
		e.preventDefault();
	});
}