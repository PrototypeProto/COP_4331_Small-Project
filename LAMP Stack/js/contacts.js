const urlBase = 'http://thisisforourclass.xyz/LAMPAPI';
const extension = 'php';

// READ IN UserID!!!
let UserID = 0;
let FirstName = "";
let LastName = "";
let contactIDs = [];

// Global variable to keep count of contacts. Used in table
let contactsCnt = 0;

function searchContact() {
    let requestedContact = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    // tmp is an object with key and value pairs
    let tmp = { Search: requestedContact, UserID: localUserID() };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                // This might end up adding duplicates

                let table = document.getElementById("cTable");
                while (table.rows.length > 1) {
                    table.deleteRow(1); // Delete the row at index 1 (after the header row)
                }
                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactIDs[i] = jsonObject.results[i].ID;
                    let newRow = table.insertRow();
                    newRow.insertCell(0).innerHTML = i + 1;
                    newRow.insertCell(1).innerHTML = '<button"><id class="fa fa-star"></id></button>'; // will need to make button better
                    newRow.insertCell(2).innerHTML = jsonObject.results[i].FirstName;
                    newRow.insertCell(3).innerHTML = jsonObject.results[i].LastName;
                    newRow.insertCell(4).innerHTML = jsonObject.results[i].Email;
                    newRow.insertCell(5).innerHTML = jsonObject.results[i].Phone;
                    newRow.insertCell(6).innerHTML = '<button class="edit-contact-btn" id="editButton' + i + '" onclick="editContactRow(' + i + ')"><id class="fa fa-pen-to-square"></id></button>' +
                        '<button class="edit-contact-btn" id="saveEditButton' + i + '" onclick="saveContactRow(' + i + ')"><id class="fa fa-pen-to-square"></id></button>' +
                        '<button class="delete-contact-btn" onclick="deleteContactRow(' + i + ')"><id class="fa fa-trash"></id></button>';

                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

var elSearchContact = document.getElementById("searchContact");
elSearchContact.addEventListener('click', searchContact, false);

function toggleContactForm() {
    var form = document.getElementById("addContact");
    var contactsTable = document.getElementById("contactsTable");
    var searchBar = document.getElementById("searchBar");

    if (form.classList.contains('d-none')) {
        console.log("Form is not visible!");

        form.classList.remove('d-none');
        contactsTable.classList.add('d-none');
        searchBar.classList.add('d-none');
    }
    else {
        console.log("Form is visible!");

        form.classList.add('d-none');
        contactsTable.classList.remove('d-none');
        searchBar.classList.remove('d-none');
    }

    // Calls add contact function when submit button is clicked
    var submitBtn = document.getElementById("submitContactFormBtn");
    var cancelBtn = document.getElementById("cancelBtn");

    submitBtn.addEventListener('click', addContact, false);
    // Dont know if we can do this for the project
    cancelBtn.addEventListener('click', cancelInput, false);
}

var elContactForm = document.getElementById("newContact");

if (elContactForm != null) {
    console.log("Got element");
    elContactForm.addEventListener('click', toggleContactForm, false);
    // event.preventDefault();
}
else {
    console.log("Still null");
}

function cancelInput() {
    let cancelConfirmation = confirm('Are you sure you want to stop creating this contact?');

    if (cancelConfirmation == true) {
        var form = document.getElementById("addContact");
        form.reset();

        toggleContactForm();
    }
}

function addContact() {
    // document.getElementById() returns a reference to the variable and then we access the value member with .value
    let contactFirstName = document.getElementById("newContactFirstName").value;
    let contactLastName = document.getElementById("newContactLastName").value;
    let email = document.getElementById("newContactEmail").value;
    let phoneNum = document.getElementById("newContactPhoneNumber").value;

    if (!checkContactParam(contactFirstName, contactLastName, phoneNum, email)) {
        document.getElementById("addContactResult").innerHTML = "Invalid Contact Parameters";
        return;
    }

    toggleContactForm();

    // Resets form fields to default (i.e., empty)
    document.getElementById("addContact").reset();

    let table = document.getElementById("cTable");

    let newRow = table.insertRow();

    // Populate row cells from left to right.
    newRow.insertCell(0).textContent = ++contactsCnt;

    let favBtn = document.createElement('button');
    favBtn.className = 'btn';
    let favIcon = document.createElement('i');
    favIcon.className = 'fa fa-star text-warning';
    favBtn.appendChild(favIcon);

    newRow.insertCell(1).appendChild(favBtn);
    newRow.insertCell(2).textContent = contactFirstName;
    newRow.insertCell(3).textContent = contactLastName;
    newRow.insertCell(4).textContent = email;
    newRow.insertCell(5).textContent = phoneNum;

    // Create the button elements and their children, then append it to parent div element that groups the buttons closer together
    let actionsCell = newRow.insertCell(6);
    let actionBtns = document.createElement('div');
    actionBtns.className = 'btn-group';

    let editBtn = document.createElement('button');
    editBtn.className = 'btn';
    let editIcon = document.createElement('i');
    editIcon.className = 'fa fa-pen-to-square text-white';
    editBtn.appendChild(editIcon);

    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn';
    let deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa fa-trash text-danger';
    deleteBtn.appendChild(deleteIcon);

    actionBtns.appendChild(editBtn);
    actionBtns.appendChild(deleteBtn);
    // Append grouped buttons to the row (i.e., inserting the buttons into cell 6)
    actionsCell.appendChild(actionBtns);

    // Attach event listeners
    editBtn.addEventListener('click', function () {
        // Handle edit functionality here
        console.log('Edit button clicked for:', contactFirstName, contactLastName);
        var newFirstName = contactFirstName.innerText;
        contactFirstName = newFirstName;
    });

    deleteBtn.addEventListener('click', function () {
        // Deletes the contact from the row 
        let deletionConfirmation = confirm('Please confirm that you want to delete this contact');
        if (deletionConfirmation == true) {
            table.deleteRow(newRow.rowIndex); //automatically deletes row. 
            contactsCnt--;

            console.log('Delete button clicked for:', contactFirstName, contactLastName);
        }
    });

    // Insert code that checks if variables are valid

    let tmp = {
        UserID: localUserID(),
        FirstName: contactFirstName,
        LastName: contactLastName,
        Email: email,
        Phone: phoneNum
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been added");
                // Clear input fields in form 
                // document.getElementById("addContact").reset();
                // reload contacts table and switch view to show

                // NEED TO IMPLEMENT THESE TWO FUNCTIONS
                // should we be refreshing contacts after each add?
                //loadContacts();
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        console.log(err.message);
    }
}

function loadContacts() {
    console.log("Contacts Refreshed");
    let tmp = {
        Search: "",
        UserID: localUserID()
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                // This might end up adding duplicates

                let table = document.getElementById("cTable");
                while (table.rows.length > 1) {
                    table.deleteRow(1); // Delete the row at index 1 (after the header row)
                }
                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactIDs[i] = jsonObject.results[i].ID;
                    let newRow = table.insertRow();
                    newRow.insertCell(0).innerHTML = i + 1;
                    newRow.insertCell(1).innerHTML = '<button"><id class="fa fa-star"></id></button>'; // will need to make button better
                    newRow.insertCell(2).innerHTML = jsonObject.results[i].FirstName;
                    newRow.insertCell(3).innerHTML = jsonObject.results[i].LastName;
                    newRow.insertCell(4).innerHTML = jsonObject.results[i].Email;
                    newRow.insertCell(5).innerHTML = jsonObject.results[i].Phone;
                    newRow.insertCell(6).innerHTML = '<button class="edit-contact-btn" id="editButton' + i + '" onclick="editContactRow(' + i + ')"><id class="fa fa-pen-to-square"></id></button>' +
                        '<button class="edit-contact-btn" id="saveEditButton' + i + '" onclick="saveContactRow(' + i + ')"><id class="fa fa-pen-to-square"></id></button>' +
                        '<button class="delete-contact-btn" onclick="deleteContactRow(' + i + ')"><id class="fa fa-trash"></id></button>';

                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact() {
    let table = document.getElementById("cTable");
    table.deleteRow()
}

function refreshContacts() { }

// Event listener for refresh contacts
//var refreshContact = document.getElementById("refresh");
//refreshContact.addEventListener('click', loadContacts, false);

function editContact() {

}

function openProfile() {
}

function gotoHome() {
}


function doLogin() {
    FirstName = "";
    LastName = "";

    let Login = document.getElementById("loginName").value;
    let Password = document.getElementById("loginPassword").value;
    //	var hash = md5( password );

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { Login: Login, Password: Password };
    //	var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                UserID = jsonObject.id;
                setUserID(UserID)
                console.log(UserID);

                if (UserID < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                FirstName = jsonObject.firstName;
                LastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "contact.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "FirstName=" + FirstName + ",LastName=" + LastName + ",UserID=" + UserID + ";expires=" + date.toGMTString();
}

function readCookie() {
    UserID = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "FirstName") {
            FirstName = tokens[1];
        }
        else if (tokens[0] == "LastName") {
            LastName = tokens[1];
        }
        else if (tokens[0] == "UserID") {
            UserID = parseInt(tokens[1].trim());
        }
    }

    if (UserID < 0) {
        window.location.href = "index.html";
    }
    else {
        document.getElementById("userName").innerHTML = "Logged in as " + FirstName + " " + LastName;
    }
}

function doLogout() {
    UserID = 0;
    FirstName = "";
    LastName = "";
    document.cookie = "FirstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function doRegister() {
    FirstName = document.getElementById("firstName").value;
    LastName = document.getElementById("lastName").value;

    let Username = document.getElementById("registerUsername").value;
    let Password = document.getElementById("registerPassword").value;

    if (!checkRegisterParam(FirstName, LastName, Username, Password)) {
        document.getElementById("registerResult").innerHTML = "Invalid Registration";
        return;
    }

    document.getElementById("registerResult").innerHTML = "";

    let tmp = {
        FirstName: FirstName,
        LastName: LastName,
        Login: Username,
        Password: Password
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Signup.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {

            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {
                document.getElementById("registerResult").innerHTML = "User Already Exists";
                return;
            }

            if (this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                UserID = jsonObject.id;
                document.getElementById("registerResult").innerHTML = "User Registered";
                FirstName = jsonObject.FirstName;
                LastName = jsonObject.LastName;
                saveCookie();
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("registerResult").innerHTML = err.message;
    }
}

function loginHide() {
    const wrapper = document.querySelector('.wrapper');
    wrapper.classList.add('hide');
}

function checkRegisterParam(firstName, lastName, username, password) {
    var regexName = /^[a-zA-z]{1,50}$/;
    if (regexName.test(firstName) == false || regexName.test(lastName) == false) {
        return false;
    }

    var regexUser = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{3,18}$/;

    if (regexUser.test(username) == false) {
        return false;
    }

    var regexPass = /^([a-zA-Z0-9]|\!|\@|\#|\$|\%|\^|\&|\*){10,32}$/;

    if (regexPass.test(password) == false) {
        return false;
    }

    return true;
}

function checkContactParam(firstName, lastName, phone, email) {
    var regexName = /^[a-zA-z]{1,50}$/;
    if (regexName.test(firstName) == false || regexName.test(lastName) == false) {
        return false;
    }

    var regexPhone = /^(\d{3}-\d{3}-\d{4})(?:\s*x\d+)?$/;
    if (regexPhone.test(phone) == false) {
        return false;
    }
    var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regexEmail.test(email) == false) {
        return false;
    }

    return true;
}


function setUserID(id) {
    localStorage.setItem('localUserID', id);
}
function localUserID() {
    return localStorage.getItem('localUserID');
}

function deleteContactRow(i) {
    let table = document.getElementById("cTable");
    let row = table.rows[i + 1];
    let phone = row.cells[5].innerHTML;

    let popUpConfirm = confirm('Confirm deletion of contact?');
    if (popUpConfirm === true) {
        let tmp = {
            Phone: phone,
            UserID: localUserID()
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    console.log("Contact has been deleted");
                    //dont need to remove row if we just load all again
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }

    };

}

function saveContactRow(i) {
    let first = document.getElementById("editFirstInput" + i).value
    let last = document.getElementById("editLastInput" + i).value
    let email = document.getElementById("editEmailInput" + i).value
    let phone = document.getElementById("editPhoneInput" + i).value
    var contactID = contactIDs[i];


    let tmp = {
        FirstName: first,
        LastName: last,
        Email: email,
        Phone: phone,
        Favorite: 0,
        ID: contactID
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/EditContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}


function editContactRow(i) {
    document.getElementById("editButton" + i).style.display = "none";
    document.getElementById("saveEditButton" + i).style.display = "inline-block";


    let table = document.getElementById("cTable");
    let row = table.rows[i + 1];
    let first = row.cells[2];
    let last = row.cells[3];
    let email = row.cells[4];
    let phone = row.cells[5];

    var oldFirst = first.innerHTML;
    var oldLast = last.innerHTML;
    var oldEmail = email.innerHTML;
    var oldPhone = phone.innerHTML;

    first.innerHTML = "<input type='text' id='editFirstInput" + i + "' value='" + oldFirst + "'>";
    last.innerHTML = "<input type='text' id='editLastInput" + i + "' value='" + oldLast + "'>";
    email.innerHTML = "<input type='text' id='editEmailInput" + i + "' value='" + oldEmail + "'>";
    phone.innerHTML = "<input type='text' id='editPhoneInput" + i + "' value='" + oldPhone + "'>"
}