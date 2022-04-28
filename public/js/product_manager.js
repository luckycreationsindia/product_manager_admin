//Product Manager Start

let clickedProduct = null;
let isUpdateProduct = false;

let ProductManager = (function () {
	let imageSelector;

	function preFillProductData() {
		if(!isUpdateProduct) return;
		let modal = $('#add-product-form');
		modal.find('[name="name"]').val(clickedProduct.name);
		modal.find('[name="description"]').val(clickedProduct.description);
		modal.find('[name="price"]').val(clickedProduct.price);
		modal.find('[name="size"]').val(clickedProduct.size);
		modal.find('[name="category"]').val(clickedProduct.category).trigger('change');
		if(clickedProduct.images && clickedProduct.images.length) {
			let image = clickedProduct.images[0];
			imageSelector.addImagesFromPath([imageHostUrl + image]);
			imageSelector.refreshPreviewPanel();
		}
	}

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

		// let file = modal.find('[name="images"]');
		let f = imageSelector.cachedFileArray[0] || "";

		// let fileInp = modal.find('[name="images"]')[0].files;
		// let file = fileInp.length > 0 ? fileInp[0] : null;

		showGBlockMessage('Adding Product...');

		if(f) {
			data.images = [];
			uploadFile(new File([f], f.name), (err, res) => {
				if (err) {
					hideGBlockMessage('Error Uploading Image...');
					return;
				}

				data.images = [];
				if(res && res.length)
					data.images = [res];
				addOrUpdate(data, false);
			});
		} else {
			addOrUpdate(data, false);
		}
	}

	function update() {
		let modal = $('#add-product-form');
		let data = {};
		modal.find('.form-control[name]').each(function (e) {
			let key = $(this).attr('name');
			let val = $(this).val() || "";
			if (Array.isArray(val))
				val = val.toString();
			data[key] = val;
		});

		let f = imageSelector.cachedFileArray[0] || "";

		showGBlockMessage('Updating Product...');

		if(f) {
			data.images = [];
			uploadFile(new File([f], f.name), (err, res) => {
				if (err) {
					hideGBlockMessage('Error Uploading Image...');
					return;
				}

				data.images = [];
				if(res && res.length)
					data.images = [res];
				addOrUpdate(data, true);
			});
		} else {
			addOrUpdate(data, true);
		}
	}

	function addOrUpdate(data, isUpdate = false) {
		if(!data.images) data.images = [];
		$.ajax({
			url: apiUrl + `api/product/${isUpdate ? "update" : "add"}`,
			type: 'POST',
			data: data,
			success: function (res) {
				console.log(res);
				if (res.status === 'Success') {
					// modal.find('.form-control[name]').val("");
					$('#add-product-form').find('[name]').val("");
					// modal.trigger("reset");
					hideGBlockMessage(isUpdate ? 'Product Updated Successfully' : 'Product Added Successfully');

					if(isUpdate) history.back();
				} else {
					hideGBlockMessage(isUpdate ? 'Error Updating Product: ' + res.message : 'Error Adding Product: ' + res.message);
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	function init() {
		imageSelector = new FileUploadWithPreview('imageSelector');
		let categorySel = $(".categoryList");
		categorySel.select2();
		CategoryManager.load((x) => {
			categoryList.forEach((c) => {
				console.log(c);
				let newOption = new Option(c.name, c._id, false, false);
				categorySel.append(newOption);
			});
			categorySel.trigger('change');
			preFillProductData();
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
			url: apiUrl + "api/product/loadAll",
			type: 'POST',
			data: {cid: cid},
			success: function (res) {
				console.log(res);
				if (res.status === 'Success') {
					let products = res.data;
					products.forEach((p) => {
						let temp = productListTemplate.clone();
						temp.find('.productName').html(p.name);
						temp.find('.productName').on('click', function () {
							clickedProduct = p;
							location.href = '#add-product?isUpdate=true&id=' + p._id;
						});
						// temp.find('.productDescription').html(p.description || "");
						temp.find('.productPrice').html("Rs." + p.price);
						temp.find('.productSize').html(p.size);
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
		update,
		loadProducts,
	}
})();

//Product Manager End