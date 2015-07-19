function imgur(qse_area) {
	if(!document.getElementsByClassName("imgur").length) {
		document.querySelector('textarea').insertAdjacentHTML( 'afterEnd', '<input class="imgur" style="visibility:hidden;height:0px;width:0px;" type="file" onchange="upload(this.files[0],'+qse_area.id+')" accept="image/*">' );
	}
	document.querySelector('input.imgur').click();
}
function imgurbutgen(qse_area) {
	return '<a class="yuieditor-button yuieditor-button-imgur" onclick="imgur('+qse_area+');" title="imgur"><div></div></a>';
}
function fontbutgen(qse_area) {
	return	'<a class="yuieditor-button yuieditor-button-font" id="yuieditor-font_'+qse_area+'" title="'+yuivar['Font Name']+'"><div></div></a>'+
			'<div id="yuieditor-font_'+qse_area+'_popup" class="yuieditor-dropdown yuieditor-font-picker" style="display: none;"><div>'+
			'</div>';
}
function fontsizebutgen(qse_area) {
	return	'<a class="yuieditor-button yuieditor-button-size" id="yuieditor-size_'+qse_area+'" title="'+yuivar['Font Size']+'"><div></div></a>'+
			'<div id="yuieditor-size_'+qse_area+'_popup" class="yuieditor-dropdown yuieditor-fontsize-picker" style="display: none;"><div>'+
			'</div>';
}
function savsty(type,id) {
	sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
	if (!sb_sty) {
		sb_sty = {};
	}
	sb_sty[type] = id;
	if (type=='font') {
		fontype = id;
	}
	else {
		fontsize = id;
	}
	localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
}
function savbold() {
	msb_bold = '0';
	sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
	if (sb_sty) {
		if (parseInt(sb_sty['bold'])==0 || isNaN(parseInt(sb_sty['bold']))) {
			msb_bold = '1';
		}
		else {
			msb_bold = '0';
		}
	}
	if (!sb_sty) {
		sb_sty = {};
	}
	sb_sty['bold'] = msb_bold;
	fontbold = msb_bold;
	localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
}
$(document).ready(function() {
	$(toolbar('shout_text')).insertBefore("#shout_text");
	buttons('shout_text');
	$('#yuieditor-font_shout_text').popupMenu();
	$('#yuieditor-size_shout_text').popupMenu();
	$('#yuieditor-emoticons_shout_text').popupMenu(false);
	function buttons(qse_area) {
		if (parseInt(actbold)) {
			but = '<a class="yuieditor-button yuieditor-button-bold" accesskey="b" onclick="savbold()" title="'+yuivar.Bold+'"><div></div></a>';
			$(but).appendTo('.yuieditor-group_'+qse_area+':last');
		}
		if (!parseInt(destyl)) {
			$(fontbutgen(qse_area)).appendTo('.yuieditor-group_'+qse_area+':last');
			$(fontsizebutgen(qse_area)).appendTo('.yuieditor-group_'+qse_area+':last');
			font_rls = msbfontype.split(',');
			for (var i = 0; i < font_rls.length; i++) {
				$('#yuieditor-font_'+qse_area+'_popup div').append('<a class="yuieditor-font-option" onclick="savsty(\'font\',\''+i+'\')"><font face="'+font_rls[i].trim()+'">'+font_rls[i].trim()+'</font></a></div>');
			}
			size_rls = msbfontsize.split(',');
			for (var i = 0; i < size_rls.length; i++) {
				$('#yuieditor-size_'+qse_area+'_popup div').append('<a class="yuieditor-fontsize-option" onclick="savsty(\'size\',\''+i+'\')"><font>'+size_rls[i].trim()+' px</font></a>');
			}
		}
		$(simpbutgen('spoiler','s','spoiler',1,'',qse_area,spo_lan)).appendTo('.yuieditor-group_'+qse_area+':last');
		$(emotbutgen(qse_area)).appendTo('.yuieditor-group_'+qse_area+':last');
		$(imgurbutgen(qse_area)).appendTo('.yuieditor-group_'+qse_area+':last');
	}
});

/*****************************
 * Add imgur upload function *
 *****************************/
function upload(file,qse_area) {
	/* Is the file an image? */
	if (!file || !file.type.match(/image.*/)) return;

	/* It is! */
	document.body.className = "uploading";
	var d = document.querySelector(".yuieditor-button-imgur div");
	d.className = d.className + " imgurup";

	/* Lets build a FormData object*/
	var fd = new FormData(); // I wrote about it: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
	fd.append("image", file); // Append the file
	var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
	xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
	xhr.onload = function() {
		editor.insert_text(JSON.parse(xhr.responseText).data.link,'',qse_area.id);
		var d = document.querySelector(".yuieditor-button-imgur div.imgurup");
		d.className = d.className - " imgurup";
		document.querySelector('input.imgur').remove();
	}
	// Ok, I don't handle the errors. An exercice for the reader.
	xhr.setRequestHeader('Authorization', 'Client-ID '+iclid+'');
	/* And now, we send the formdata */
	xhr.send(fd);
};