
function getSMS() {
	return $.ajax({
		url: testAPI,
		type: "POST",
		dataType: "json",
		timeout: 8000,
		cache: false
	})
}
