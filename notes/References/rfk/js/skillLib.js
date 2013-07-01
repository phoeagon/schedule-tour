var skillCount = skills.length;

function saveSkill() {
    var html = $('#skillList').attr('class');
    if (Modernizr.localstorage) {
        localStorage.setItem("skillList", html);
    } else {}
}

function loadSkill() {
    var html = "";
    if (Modernizr.localstorage) {
        html = localStorage.getItem("skillList");
        $("#skillList").addClass(html);
    } else {}
}

function hasSkill( skill ){
    return $('#skillList').hasClass( skill );
}
function addSkill( skill ){
    $('#skillList').addClass( skill );
    saveSkill();
    restrictModeOptions();
}
function removeSkill( skill ){
    $('#skillList').removeClass( skill );
    saveSkill();
    restrictModeOptions();
}
function getSkillIdByTag( tag ){
    for (var i=0;i<skillCount;++i)
        if ( skills[i].tag == tag )
            return i;
    return -1;
}
function createSkillGalleryTable( tableId ) {
    var generatedHTML = "";

    if (tableId == undefined) generatedHTML = "<table>";
    else generatedHTML = "<table id=\"" + tableId + "\">";

    var cellCount = 0;
    var row = skillCount;
    for (var i = 0; i < row; ++i) {
        generatedHTML += "<tr id=\"row" + (i + 1) + "\">";
        
        generatedHTML += "<td id=\"skill_img" + (cellCount) + "\">";
        generatedHTML += "</td>";
        generatedHTML += "<td class=\"dscb\" id=\"skill_text" + (cellCount) + "\">";
        generatedHTML += "</td>";
        ++cellCount;
        
        generatedHTML += "</tr>";
    }
    generatedHTML += "</table>";
    return generatedHTML;
}
function fillSkillDataCell( skillId ) {
    if ( skillId < 0 || skillId >= skillCount) return;
    var imgHTML = "<img class=\"skill_icon\" id=\"skillImg" + skillId + "\" alt=\"" + skills[skillId].name + "\" src=\"./img/skill/" + skills[skillId].src + "\"/>";
    $('#skill_img' + skillId).html(imgHTML);
    var nameHTML = "<font class=\"bold\">";
    nameHTML += skills[skillId].name;
    nameHTML += "</font><br/>";
    nameHTML += skills[skillId].text+"<br/>Price:&nbsp;"+skills[skillId].cost+" Karma<br/>"
    nameHTML += "<font class=\"bold\" id=\"skillStatus" + skillId + "\"></font>";
    $('#skill_text' + skillId).html(nameHTML);
}
function setSkillStatus() {
    loadSkill();
    for (var i = 0; i < skillCount; ++i)
        setSingleSkillCell(i);
}
function setSingleSkillCell(i){
    if (checkSkillGotten(i))
    {
        $('#skillStatus' + i).text('Acquired');
        $('#skill_text'+i).addClass('pinkDiv');
    } else {
        $('#skillImg' + i).addClass('grayscale ');
        $('#skillStatus' + i).text('[to get]');
        $('#skill_text'+i).attr("onClick","javascript:buySkill("+i+");" );
    }
}
function checkSkillGotten(skillId) {
    if (skillId < 0 || skillId >= skills.length) return false;
    var tagId = skills[ skillId ].tag ;
    return $('#skillList').hasClass(tagId);
}
function showSkillGallery() {
    setPause();
    $('#skill_gallery').removeClass('hide');
    $('#skill_gallery').addClass('animated fadeIn');
    if ($("#skillImg1").length == 0)
        fillSkillGalleryDiv();
    setSkillStatus();
    setTimeout(function () {
        $('#skill_gallery').removeClass('animated fadeIn');
    }, 2000);
}
function hideSkillGallery(){
    revertPause();
    $('#skill_gallery').addClass('animated fadeOut');
    setTimeout(function () {
        $('#skill_gallery').addClass('hide');
        $('#skill_gallery').removeClass('animated fadeOut');
    }, 300);
}
function fillSkillGalleryDiv() { 
    $('#skill_gallery_table').html(createSkillGalleryTable());
    for (var i = 0; i < skillCount; ++i)
    fillSkillDataCell(i);
}
function buySkill( skillId ){
    if ( checkSkillGotten( skillId ) )
        alert("You've already got this skill!");
    else{
        var karma = getKarma();
        var price = skills[ skillId ].cost;
        if ( karma>=price ){
            if(confirm("This item will cost "+price+" of your "
                +karma+" Karma Points. Continue?") ){
                    deltaKarma( -price );    // change karma
                    flushKarma();   // write to localStorage
                    addSkill(skills[ skillId ].tag);    //add skill
                    saveSkill();    // SAVE SKILL
                    fillSkillDataCell(skillId);
                    setSingleSkillCell(skillId);
                }
            }else{
                alert("You don't have enough Karma!");
            }
    }
}
//showSkillGallery();
