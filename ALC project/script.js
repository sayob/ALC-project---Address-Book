//events
window.onload = onPageLoad();

function onPageLoad() {
    $('#empty').hide();
    loaddefault();
}
//method clears all contacts from the session
$('#clearbutton').click(function () {
    localStorage.clear();
    alert('Contact cleared');
    location.reload();
});

//global method for saving items in session.
function saveit(name, value) {
    localStorage[name] = value;
}

//global method for retireving items stored in session.
function getit(name) {
    return localStorage[name] || 'empty';
}

//global method for deleting items from session.
function deleteit(name) {
    localStorage.removeItem(name);
    location.reload();
}

//handles the deletion of contacts as triggered from the UI.
$('#btn-delete-contact').click(function () {
    deleteContact();
});

//handles events when edit button is clicked on view-page div.
$('#edit').click(function () {
    console.log('in edit');
    $('#fld-edit-name').val($('#view-name').html());
    $('#fld-edit-phone').val($('#view-phone').html());
    $('#fld-edit-email').val($('#view-email').html());
});

//handles action after a contact is edited.
$('#btn-update-contact').click(function () {
    updateContact();
    location.reload();
});

//handles initial data saving for contact.
$('#btn-save-contact').click(function () {
    addContact();
    location.reload();
});

//handles contact click from main div.
$('.contactitem').click(function () {
    console.log('I hit');
    //fetch the guid from the atrribute of the HTML Anchor element.
    var indexguid = $(this).attr('guid');
    console.log(indexguid);
    setcurrentindex(indexguid);

    //set contents of page-view.
    var currentData = getit(indexguid);
    var dataParse = JSON.parse(currentData);
    $('#view-name').html(dataParse.name);
    $('#view-phone').html(dataParse.phone);
    $('#view-email').html(dataParse.email)

    console.log(JSON.stringify(dataParse));

    //optionally set the current view for some mobile devices optimization.
    viewer = $('#page-view');
    $.mobile.changePage(viewer);

});
function addContact() {
    //perform checks and data validation.
    if ($('#fld-name').val() == "" || $('#fld-phone').val() == "" || $('#fld-email').val() == "") {
        alert('Fill name, phone and email correctly');
        return;
    }
    var emailRegn = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!emailRegn.test($('#fld-email').val())) {
        alert("Invalid Email");
        event.preventDefault();
        return;
    }
    //generate new guid for contact
    var newguid = guid();
    var contactindexerstringprep = getit('index');
    var contactindexerstring = JSON.parse(contactindexerstringprep);
    //add the current email to the index and store.
    contactindexerstring.push(newguid);
    saveit('index', JSON.stringify(contactindexerstring));
    //process saving the contact
    var contact = { "name": $('#fld-name').val(), "phone": $('#fld-phone').val(), "email": $('#fld-email').val(), "guid": newguid };
    var myContactJSON = JSON.stringify(contact);
    console.log($('#fld-name').val());
    console.log($('#fld-phone').val());
    console.log($('#fld-email').val());
    console.log(myContactJSON);
    saveit(newguid, myContactJSON);
    //reload page to display updated contacts.
    location.reload();
}
function setnewindex() {
    $('#empty').show();
    $('#clearbutton').hide();
    console.log('contact is empty');
    var newarray = [""];
    saveit('index', JSON.stringify(newarray));
    console.log(JSON.stringify(newarray));
    console.log('created new cookie.');

    //test get the just saved cookie.
    // console.log('testing saved guid');
    // var savedindex = getit('index');
    // console.log(savedindex); 
}
function loaddefault() {
    //load all contact.
    //get the indexer cokie
    var getcc = getit('index');
    console.log(getcc);
    if (getcc == "empty") {
        setnewindex();
        return;
    }
    refreshcontacts();
    console.log('cookie isnt empty');
}
function refreshcontacts() {
    var getcc = getit('index');
    if (getcc == 'empty' || getcc == '[""]') {
        $('#empty').show();
        $('#clearbutton').hide();
        return;
    }
    var indexcookie = JSON.parse(getcc);
    console.log(indexcookie);
    for (var i = 1; i < indexcookie.length; i++) {
        console.log(indexcookie[i]);
        var getter = getit(indexcookie[i]);
        var pulledcontact = JSON.parse(getter);
        console.log(pulledcontact);
        var contactname = pulledcontact.name;
        console.log(contactname);
        var contactguid = pulledcontact.guid;
        console.log(contactguid);
        var newli = createli(contactname, contactguid);
        var contactlist = $('#all-contacts');
        contactlist.append(newli);
    }
}
function editContact() {

}

function updateContact() {
    if ($('#fld-edit-name').val() == "" || $('#fld-edit-phone').val() == "" || $('#fld-edit-email').val() == "") {
        alert('Fill name, phone and email correctly');
        event.preventDefault();
        return;
    }
    var emailRegn = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!emailRegn.test($('#fld-edit-email').val())) {
        alert("Invalid Email");
        event.preventDefault();
        return;
    }
    //get the current index to be edited
    var currentedit = getit('current');

    var contact = { "name": $('#fld-edit-name').val(), "phone": $('#fld-edit-phone').val(), "email": $('#fld-edit-email').val(), "guid": currentedit };
    var editmyContactJSON = JSON.stringify(contact);
    console.log($('#fld-edit-name').val());
    console.log($('#fld-edit-phone').val());
    console.log($('#fld-edit-email').val());
    console.log(editmyContactJSON);

    //update the jsonString into cookies/cache/local session storage.
    saveit(currentedit, editmyContactJSON);
    //refreshcontacts();
    location.reload();
}
function deleteContact() {
    //get the current index to be deleted
    var currentdel = getit('current');
    //fetch the indexer
    var getcc = getit('index');
    var indexcookie = JSON.parse(getcc);
    //remove the contact from the indexer by guid property
    for (var i = indexcookie.length - 1; i >= 0; i--) {
        if (indexcookie[i] === currentdel) {
            indexcookie.splice(i, 1);
            // break;       //<-- Uncomment  if only the first term has to be removed
        }
    }
    //save the new index
    saveit('index', JSON.stringify(indexcookie));
    //delete the cookie
    deleteit(currentdel);
    // refreshcontacts();
    location.reload();
}
function getcurrentindex() {
    return getit('current');
}
function setcurrentindex(index) {
    saveit('current', index);
}
//create a new HTML Anchor element and append into the List Item.
function createli(name, guid) {
    var li, a;
    li = $(document.createElement('li'));
    a = $(document.createElement('a'));
    a.attr('href', '#page-view');
    a.attr('guid', guid);
    $(a).addClass('contactitem');
    a.text(name);
    li.append(a);
    return li;
}
//generate a new non-standard guid for uniquely identifying contacts.
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
