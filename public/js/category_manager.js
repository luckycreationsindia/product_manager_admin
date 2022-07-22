//Category Manager Start

let categoryList = [];
let isUpdateCategory = false;

let CategoryManager = (function () {
	let imageSelector;

	function preFillCategoryData() {
		if(!isUpdateCategory) return;
		let cid = pageParams.id;
		loadSingleCategory(cid, function (err, category) {
			if(err || !category) return;
			let modal = $('#add-category-form');
			modal.find('[name="name"]').val(category.name);
			modal.find('[name="description"]').val(category.description);
			modal.find('[name="status"]').prop('checked', category.status).trigger('change');
			if(category.images && category.images.length) {
				let image = category.images[0];
				imageSelector.addImagesFromPath([imageHostUrl + image]);
				imageSelector.refreshPreviewPanel();
			}
		});
	}

	function add() {
		let modal = $('#add-category-form');
		let data = modal.serializeObject();

		showGBlockMessage('Adding Category...');

		let f = imageSelector.cachedFileArray[0] || "";

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
		let modal = $('#add-category-form');
		let data = modal.serializeObject();

		let f = imageSelector.cachedFileArray[0] || "";

		showGBlockMessage('Updating Category...');

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
			url: apiUrl + `api/category/${isUpdate ? "update" : "add"}`,
			type: 'POST',
			data: data,
			success: function (res) {
				console.log(res);
				if (res.status === 'Success') {
					// modal.find('.form-control[name]').val("");
					$('#add-category-form').find('[name]').val("");
					// modal.trigger("reset");
					hideGBlockMessage(isUpdate ? 'Category Updated Successfully' : 'Category Added Successfully');

					if(isUpdate) history.back();
				} else {
					hideGBlockMessage(isUpdate ? 'Error Updating Category: ' + res.message : 'Error Adding Category: ' + res.message);
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	function load(cb) {
		let categoryListGroup, categoryListTemplate;

		if(currentHash === 'list-category') {
			categoryListGroup = $(".categoryListGroup");
			categoryListTemplate = $(".categoryListTemplate").clone().removeClass('categoryListTemplate');

			categoryListGroup.empty();
		}

		$.ajax({
			url: apiUrl + "api/category",
			type: 'GET',
			success: function (res) {
				if (res.status === 'Success') {
					categoryList = res.data;
					if(cb) return cb(categoryList);
					if(currentHash === 'list-category') {
						categoryList.forEach((c) => {
							let temp = categoryListTemplate.clone();
							temp.find('.categoryName').html(c.name);
							temp.find('.categoryName').on('click', function () {
								location.href = '#add-category?isUpdate=true&id=' + c._id;
							});
							// temp.find('.productDescription').html(p.description || "");
							if(c.images.length > 0 && c.images[0] !== '')
								temp.find('.categoryImage').attr('src', imageHostUrl + c.images[0]);
							categoryListGroup.append(temp);
						});
					}
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	function loadSingleCategory(cid, cb) {
		$.ajax({
			url: apiUrl + "api/category/" + cid,
			type: 'GET',
			success: function (res) {
				console.log(res);
				if (res.status === 'Success') {
					cb(null, res.data);
				} else {
					cb("Error", res.message);
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
				cb("Error", err.message);
			}
		});
	}

	function init() {
		imageSelector = new FileUploadWithPreview('imageSelector');
		preFillCategoryData();
	}

	function initCategoryList() {
		load();
	}

	return {
		load,
		add,
		update,
		init,
		initCategoryList
	}
})();

//Category Manager End