let currentHash = "";
let currentUserId = 0;
let currentUserWelcome = $(".currentUserWelcome");
let currentUser = null;
let currentUserRole = 0;
let firstLoadDone = false;
let apiUrl = "http://localhost:3030/";

$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
});

$(window).on('hashchange', function () {
    loadHashChange();
});

function loadHashChange() {
    console.log("HASH CHANGE CALLED");
    $(".slide-item").removeClass('active');
    if (currentUserId === 0) {
        console.log("USER ID 0");
        $(".pageloader").html('');
        if(!firstLoadDone) {
            firstLoadDone = true;
            getUserDetails((status) => {
                console.log("GET USER DETAILS IN FIRST LOAD:")
                if(!status) {
                    $.ajax({
                        url: "page/unauthorized",
                        type: 'GET',
                        success: function (res) {
                            hideGBlockMessage();
                            $(".pageloader").html(res);
                            $('[data-toggle="tooltip"]').tooltip();
                            // getUserDetails();
                        },
                        error: function (err) {
                            console.error("ERROR", err);
                            if (err.status === 401) {
                                hideGBlockMessage("Please Login");
                                $(".pageloader").html(err.responseText);
                                $('[data-toggle="tooltip"]').tooltip();
                                afterLogout();
                            } else {
                                console.log("ERR:", err);
                                hideGBlockMessage("Error");
                            }
                        }
                    });
                } else {
                    loadHashChange();
                }
            });
        } else {
            showGBlockMessage();
            $.ajax({
                url: "page/unauthorized",
                type: 'GET',
                success: function (res) {
                    hideGBlockMessage();
                    $(".pageloader").html(res);
                    $('[data-toggle="tooltip"]').tooltip();
                    getUserDetails();
                },
                error: function (err) {
                    console.error("ERROR", err);
                    if (err.status === 401) {
                        hideGBlockMessage("Please Login");
                        $(".pageloader").html(err.responseText);
                        $('[data-toggle="tooltip"]').tooltip();
                        afterLogout();
                    } else {
                        console.log("ERR:", err);
                        hideGBlockMessage("Error");
                    }
                }
            });
        }
    } else {
        showGBlockMessage();
        cleanHash();
        getPage();
    }
}

function cleanHash() {
    let page = window.location.hash;
    page = page.substr(1, page.length);
    currentHash = page;
    if (currentHash === "") currentHash = "home";
}

function getPage(cb) {
    let page = currentHash;
    $.ajax({
        url: "page/" + page,
        type: 'GET',
        success: function (res) {
            $(".pageloader").html(res);
            // $('.datetimepicker').datetimepicker();
            $('[data-toggle="tooltip"]').tooltip();
            if (cb == null) {
                if (page === "" || page === "#") {
                    console.log("DASHBOARD LOADED");
                } else if (page === "add-category") {
                    console.log("Add Category");
                } else if (page === "add-product") {
                    console.log("Add Product");
                    ProductManager.init();
                } else if (page === "usermanager") {
                }
                hideGBlockMessage();
            } else {
                cb();
            }
        },
        error: function (err) {
            console.log("ERR STATUS:", err.status);
            console.log("ERR MSG:", err.message);
            if (err.status === 401) {
                hideGBlockMessage("Please Login");
                console.log(err.message);
                $(".pageloader").html(err.responseText);
                $('[data-toggle="tooltip"]').tooltip();
                afterLogout();
            } else {
                hideGBlockMessage("Error");
                console.log("ERR:", err);
            }
        }
    });
}

function afterLogin() {
    // $(".user-menu").removeClass('hide');
    currentUserId = currentUser.id;
    let name = currentUser.first_name;
    if (name) {
        if (currentUser.last_name) {
            name += " " + currentUser.last_name;
        }
    } else {
        name = currentUser.email;
    }
    console.log("CURRENT USER NAME: " + name);
    currentUserWelcome.html(name);
    currentUserRole = currentUser.role;
    if (currentUserRole !== 1) {
        $(".adminMenu").addClass('hide');
    } else {
        $(".adminMenu").removeClass('hide');
    }
}

function afterLogout() {
    currentUser = null;
    currentUserId = 0;
    currentUserWelcome.html("");
    currentUserRole = 0;
}