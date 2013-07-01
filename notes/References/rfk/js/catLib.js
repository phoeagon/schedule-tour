/* implementation of the Cat Gallery*/
var catBreedCount = cats.length;

function displayCatAcquireNotify( catId ) {
    if (catId < 0 || catId > catBreedCount) return;
    $('#cat_discover_img').attr('src', './img/cat/' + cats[catId].src);
    $('#cat_discover_breed_name').text(cats[catId].name);

    $('#cat_discovery').removeClass('hide');
    $('#cat_discovery').removeClass('animated fadeOut');
    $('#cat_discovery').addClass('animated fadeIn');
}

function hideCatAcquireNotify() {
    $('#cat_discovery').removeClass('animated fadeIn');
    $('#cat_discovery').addClass('animated fadeOut');
    $('#cat_discovery').addClass('hide');
}

function randomAcquireCatAndNotify() {
    const GET_CAT_CHANCE = 0.3;
    if (Math.random() < GET_CAT_CHANCE) {
        // found a cat
        var catId = randomInteger(catBreedCount - 1);
        if (!checkCatGotten(catId)) {
            displayCatAcquireNotify( catId );
            $('#catGotList').addClass('kitten' + catId);
            saveCatGallery();
            return true;
        }
    }
    return false;
}

function lotteryCat ( score , catCount ){
    if ( score >= (catCount + .5)*SCORE.KITTEN )
        if (randomAcquireCatAndNotify())
            {}
}

function catGalleryImagePreloader() {}

function createCatGalleryTable(tableId) {
    var generatedHTML = "";
    const COL_PER_ROW = 3;
    var row = Math.ceil(cats.length / COL_PER_ROW);
    var roundedCatLength = row * COL_PER_ROW;

    if (tableId == undefined) generatedHTML = "<table>";
    else generatedHTML = "<table id=\"" + tableId + "\">";

    var cellCount = 0;
    for (var i = 0; i < row; ++i) {
        generatedHTML += "<tr id=\"row" + (i + 1) + "\">";
        for (var j = 0; j < COL_PER_ROW; ++j) {
            generatedHTML += "<td id=\"img" + (cellCount) + "\">";
            generatedHTML += "</td>";
            generatedHTML += "<td class=\"dscb\" id=\"dscb" + (cellCount) + "\">";
            generatedHTML += "</td>";
            ++cellCount;
        }
        generatedHTML += "</tr>";
    }
    generatedHTML += "</table>";
    return generatedHTML;
}

function fillCatDataCell(catId) {
    if (catId < 0 || catId >= cats.length) return;
    var imgHTML = "<img class=\"cat_icon\" id=\"kittenImg" + catId + "\" alt=\"" + cats[catId].name + "\" src=\"./img/cat/" + cats[catId].src + "\"/>";
    $('#img' + catId).html(imgHTML);
    var nameHTML = "<font class=\"italic\">";
    nameHTML += cats[catId].name;
    nameHTML += "</font><br/>";
    nameHTML += "<font class=\"bold\" id=\"catGottenStatus" + catId + "\"></font>";
    $('#dscb' + catId).html(nameHTML);
}
//alert($('#cat_gallery').html());
function saveCatGallery() {
    var html = $('#catGotList').attr('class');
    if (Modernizr.localstorage) {
        localStorage.setItem("catGotList", html);
    } else {}
}

function loadCatGallery() {
    var html = "";
    if (Modernizr.localstorage) {
        html = localStorage.getItem("catGotList");
        $("#catGotList").addClass(html);
    } else {}
}

function checkCatGotten(catId) {
    if (catId < 0 || catId >= cats.length) return false;
    var tagId = "kitten" + catId;
    return ($('#catGotList').hasClass(tagId));
}

function setCatStatus() {
    loadCatGallery();
    for (var i = 0; i < catBreedCount; ++i)
        setSingleCatStatus( i );
}
function setSingleCatStatus( i ){
    if (checkCatGotten(i)){
        $('#catGottenStatus' + i).text('Got');
        $('#dscb'+i).addClass('pinkDiv');
    } else {
        $('#kittenImg' + i).addClass('grayscale ');
        $('#catGottenStatus' + i).text('[locked]');
    }
}
function showCatGallery() {
    setPause();
    $('#cat_gallery').removeClass('hide');
    $('#cat_gallery').addClass('animated fadeIn');
    if ($("#kittenImg1").length == 0)
        fillCatGalleryDiv();
    setCatStatus();
    setTimeout(function () {
        $('#cat_gallery').removeClass('animated fadeIn');
    }, 2000);
}
function hideCatGallery(){
    revertPause();
    $('#cat_gallery').addClass('animated fadeOut');
    setTimeout(function () {
        $('#cat_gallery').addClass('hide');
        $('#cat_gallery').removeClass('animated fadeOut');
    }, 300);
}
function fillCatGalleryDiv() {
    $('#cat_gallery_table').html(createCatGalleryTable());
    for (var i = 0; i < catBreedCount; ++i)
    fillCatDataCell(i);
}
//showCatGallery();
//alert($('#catGotList').attr('class'));
	var simulateKeyPress;
	var simulateKeyPressRelease;
