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

		let fileInp = modal.find('[name="images"]')[0].files;
		let file = fileInp.length > 0 ? fileInp[0] : null;

		console.log("START UPLOAD FILE");

		showGBlockMessage('Adding Product...');

		uploadFile(file, (err, res) => {
			console.log("END UPLOAD FILE");
			if(err) {
				hideGBlockMessage('Error Uploading Image...');
				return;
			}

			console.log("START ADD PRODUCT");

			data.images = [];
			if(res && res.length)
				data.images = [res];

			console.log("DATA==>",data);

			$.ajax({
				url: apiUrl + "api/product/add",
				type: 'POST',
				data: data,
				success: function (res) {
					console.log(res);
					if (res.status === 'Success') {
						// modal.find('.form-control[name]').val("");
						modal.find('[name]').val("");
						// modal.trigger("reset");
						hideGBlockMessage('Product Added Successfully');
					} else {
						hideGBlockMessage('Error Adding Product: ' + res.message);
					}
				},
				error: function (err) {
					console.log("ERR:", err);
					hideGBlockMessage("Error Adding Product");
				}
			});
		});
	}

	function init() {
		let categorySel = $(".categoryList");
		categorySel.select2();
		CategoryManager.load((x) => {
			categoryList.forEach((c) => {
				console.log(c);
				let newOption = new Option(c.name, c._id, false, false);
				categorySel.append(newOption);
			});
			categorySel.trigger('change');
		});
	}

	function initProductList() {
		let categoryListGroup = $(".categoryListGroup");
		let categoryListTemplate = $(".categoryListTemplate").clone();

		categoryListGroup.empty();
		CategoryManager.load((x) => {
			categoryList.forEach((c) => {
				console.log(c);
				let catTemplate = $('<li class="list-group-item border-0 p-0"> <a href="javascript:void(0)" onclick="ProductManager.loadProducts(\''+c._id+'\')"><i class="fe fe-chevron-right"></i> '+c.name+' </a><span class="product-label">0</span> </li>');
				categoryListGroup.append(catTemplate);
			});

			if(categoryList.length > 0) {
				loadProducts(categoryList[0]._id);
			}
		});
	}

	function loadProducts(cid) {
		let productListGroup = $(".productListGroup");
		let productListTemplate = $(".productListTemplate").clone().removeClass('productListTemplate');

		productListGroup.empty();

		$.ajax({
			url: apiUrl + "api/product",
			type: 'POST',
			data: {cid: cid},
			success: function (res) {
				console.log(res);
				if (res.status === 'Success') {
					let products = res.data;
					products.forEach((p) => {
						let temp = productListTemplate.clone();
						temp.find('.productName').html(p.name);
						// temp.find('.productDescription').html(p.description || "");
						temp.find('.productPrice').html("Rs." + p.price);
						if(p.images.length > 0)
							temp.find('.productImage').attr('src',imageHostUrl + p.images[0]);
						productListGroup.append(temp);
					});
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	return {
		init,
		initProductList,
		add,
		loadProducts,
	}
})();

//Product Manager End