//Banner Manager Start

let bannerList = [];
let isUpdateBanner = false;

let BannerManager = (function () {
	let imageSelector;

	function preFillBannerData() {
		if(!isUpdateBanner) return;
		let bid = pageParams.id;
		loadSingleBanner(bid, function (err, banner) {
			if(err || !banner) return;
			let modal = $('#add-banner-form');
			modal.find('[name="name"]').val(banner.name);
			modal.find('[name="description"]').val(banner.description);
			modal.find('[name="status"]').prop('checked', banner.status).trigger('change');
			if(banner.image && banner.image.length) {
				let image = banner.image;
				imageSelector.addImagesFromPath([imageHostUrl + image]);
				imageSelector.refreshPreviewPanel();
			}
		});
	}

	function add() {
		let modal = $('#add-banner-form');
		let data = modal.serializeObject();

		showGBlockMessage('Adding Banner...');

		let f = imageSelector.cachedFileArray[0] || "";

		if(f) {
			uploadFile(new File([f], f.name), (err, res) => {
				if (err) {
					hideGBlockMessage('Error Uploading Image...');
					return;
				}

				data.image = res;
				addOrUpdate(data, false);
			});
		} else {
			addOrUpdate(data, false);
		}
	}

	function update() {
		let modal = $('#add-banner-form');
		let data = modal.serializeObject();

		let f = imageSelector.cachedFileArray[0] || "";

		showGBlockMessage('Updating Banner...');

		if(f) {
			uploadFile(new File([f], f.name), (err, res) => {
				if (err) {
					hideGBlockMessage('Error Uploading Image...');
					return;
				}

				data.image = res;
				addOrUpdate(data, true);
			});
		} else {
			addOrUpdate(data, true);
		}
	}

	function addOrUpdate(data, isUpdate = false) {
		$.ajax({
			url: apiUrl + `api/banner/${isUpdate ? "update" : "add"}`,
			type: 'POST',
			data: data,
			success: function (res) {
				console.log(res);
				if (res.status === 'Success') {
					// modal.find('.form-control[name]').val("");
					$('#add-banner-form').find('[name]').val("");
					// modal.trigger("reset");
					hideGBlockMessage(isUpdate ? 'Banner Updated Successfully' : 'Banner Added Successfully');

					if(isUpdate) history.back();
				} else {
					hideGBlockMessage(isUpdate ? 'Error Updating Banner: ' + res.message : 'Error Adding Banner: ' + res.message);
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	function load(cb) {
		$.ajax({
			url: apiUrl + "api/banner",
			type: 'GET',
			success: function (res) {
				if (res.status === 'Success') {
					bannerList = res.data;
					if(cb) cb(res.data);
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	function loadSingleBanner(bid, cb) {
		$.ajax({
			url: apiUrl + "api/banner/" + bid,
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

	function initBannerList() {
		let bannerListGroup = $(".bannerListGroup");
		let bannerListTemplate = $(".bannerListTemplate").clone().removeClass('bannerListTemplate');

		bannerListGroup.empty();

		load(function (banners) {
			banners.forEach((p) => {
				console.log(p)
				let temp = bannerListTemplate.clone();
				temp.find('.bannerName').html(p.name);
				temp.find('.bannerName').on('click', function () {
					location.href = '#add-banner?isUpdate=true&id=' + p._id;
				});
				// temp.find('.bannerDescription').html(p.description || "");
				temp.find('.bannerImage').attr('src', imageHostUrl + p.image);
				bannerListGroup.append(temp);
			});
		});
	}

	function init() {
		imageSelector = new FileUploadWithPreview('imageSelector');
		preFillBannerData();
	}

	return {
		load,
		add,
		update,
		init,
		initBannerList
	}
})();

//Banner Manager End