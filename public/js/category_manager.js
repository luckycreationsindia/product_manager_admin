//Category Manager Start

let categoryList = [];

let CategoryManager = (function () {
	function add() {
		let modal = $('#add-category-form');
		let data = {};
		modal.find('.form-control[name]').each(function (e) {
			let key = $(this).attr('name');
			let val = $(this).val() || "";
			if (Array.isArray(val))
				val = val.toString();
			data[key] = val;
		});

		let file = modal.find('[name="images"]');
		let f = file[0].files[0] || "";
		uploadFile(f, (err, res) => {
			if(err) {
				return;
			}

			data.images = [res];

			console.log("DATA==>",data);

			$.ajax({
				url: apiUrl + "api/category/add",
				type: 'POST',
				data: data,
				success: function (res) {
					console.log(res);
					if (res.status === 'Success') {
					}
				},
				error: function (err) {
					console.log("ERR:", err);
					hideGBlockMessage("Error");
				}
			});
		});
	}

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
		add,
		init
	}
})();

//Category Manager End