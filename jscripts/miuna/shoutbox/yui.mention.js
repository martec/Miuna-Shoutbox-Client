var ment_settings = {
	at: "@",
	searchKey: "text",
	displayTpl: "<li>${text}</li>",
	insertTpl: '${atwho-at}"${text}"',
	startWithSpace: true,
	maxLen: maxnamelength,
	callbacks: {
		remoteFilter: function(query, callback) {
			if (query.length > 2) {
				$.getJSON('xmlhttp.php?action=get_users', {query: query}, function(data) {
					callback(data);
				});			
			}
			else {
				callback([]);
			}
		}
	}
}
$(document).ready(function() {
	if ($('#shout_text').length) {
		$('#shout_text').atwho(ment_settings);
	}
});