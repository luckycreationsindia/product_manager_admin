//Category Manager Start

let categoryList = [];

let CategoryManager = (function () {
	function load(cb) {
		$.ajax({
			url: apiUrl + "api/category",
			type: 'GET',
			success: function (res) {
				if (res.status === 'Success') {
					categoryList = res.data;
					if(cb) cb(res.data);
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	function init() {

	}

	return {
		load,
		init
	}
})();

//Category Manager End