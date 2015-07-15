function imgur(qse_area) {
	if(!document.getElementsByClassName("imgur").length) {
		document.querySelector('textarea').insertAdjacentHTML( 'afterEnd', '<input class="imgur" style="visibility:hidden;height:0px;width:0px;" type="file" onchange="upload(this.files[0],'+qse_area.id+')" accept="image/*">' );
	}
	document.querySelector('input.imgur').click();
}
function imgurbutgen(qse_area) {
	return '<a class="yuieditor-button yuieditor-button-imgur" onclick="imgur('+qse_area+');" title="imgur"><div></div></a>';
}
$(document).ready(function() {
	$(toolbar('shout_text')).insertBefore("#shout_text");
	buttons('shout_text');
	$('#yuieditor-emoticons_shout_text').popupMenu(false);
	function buttons(qse_area) {
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
		var code = '[img]' + JSON.parse(xhr.responseText).data.link + '[/img]';
		editor.insert_text(code,'',qse_area.id);
		var d = document.querySelector(".yuieditor-button-imgur div.imgurup");
		d.className = d.className - " imgurup";
		document.querySelector('input.imgur').remove();
	}
	// Ok, I don't handle the errors. An exercice for the reader.
	xhr.setRequestHeader('Authorization', 'Client-ID '+iclid+'');
	/* And now, we send the formdata */
	xhr.send(fd);
};