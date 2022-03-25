//Product Manager Start

let ProductManager = (function () {
	function add() {
		let modal = $('#add-product-form');
		let data = {};
		modal.find('.form-control[name]').each(function (e) {
			let key = $(this).attr('name');
			let val = $(this).val() || "";
			if (Array.isArray(val))
				val = val.toString();
			data[key] = val;
		});

		let file = modal.find('[name="images"]');

		uploadFile(file[0].files[0], (err, res) => {
			if(err) {
				return;
			}

			data.images = [res];

			console.log("DATA==>",data);

			$.ajax({
				url: apiUrl + "api/product/add",
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

	function init() {
		let categorySel = $(".categoryList");
		categorySel.select2();
		CategoryManager.load((x) => {
			console.log("GOT CATEGORIES:" + categoryList);
			categoryList.forEach((c) => {
				console.log(c);
				let newOption = new Option(c.name, c._id, false, false);
				categorySel.append(newOption);
			});
			categorySel.trigger('change');
		});
	}

	return {
		init,
		add
	}
})();

//Product Manager End