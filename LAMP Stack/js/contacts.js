const urlBase = 'http://thisisforourclass.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// Global variable to keep count of contacts. Used in table
let contactsCnt = 0;

function searchContact()
{
    let requestedContact = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";
    
    // tmp is an object with key and value pairs
    let tmp = {search:requestedContact, userId:userId};
	let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

// var elSearchContact = document.getElementById("searchContact");
// elSearchContact.addEventListener('click', searchContact, false);

function toggleContactForm()
{
    var form = document.getElementById("addContact");
    var contactsTable = document.getElementById("contactsTable");
    var searchBar = document.getElementById("searchBar");

    if (form.classList.contains('d-none'))
    {
        console.log("Form is not visible!");
        
        form.classList.remove('d-none');
        contactsTable.classList.add('d-none');
        searchBar.classList.add('d-none');
    }
    else
    {
        console.log("Form is visible!");
        
        form.classList.add('d-none');
        contactsTable.classList.remove('d-none');
        searchBar.classList.remove('d-none');
    }

    // Calls add contact function when submit button is clicked
    var submitBtn = document.getElementById("submitContactFormBtn");
    submitBtn.addEventListener('click', addContact, false);
}

var elContactForm = document.getElementById("newContact");

if (elContactForm != null)
{
    console.log("Got element");
    elContactForm.addEventListener('click', toggleContactForm, false);
    // event.preventDefault();
}
else
{
    console.log("Still null");
}

function addContact()
{
    toggleContactForm();
    
    // document.getElementById() returns a reference to the variable and then we access the value member with .value
    let contactFirstName = document.getElementById("newContactFirstName").value;
    let contactLastName = document.getElementById("newContactLastName").value;
    let email = document.getElementById("newContactEmail").value;
    let phoneNum = document.getElementById("newContactPhoneNumber").value;

    // Resets form fields to default (i.e., empty)
    document.getElementById("addContact").reset();

    let table = document.getElementById("cTable");
    // let newRow = table.insertRow(table.rows.length);
    let newRow = table.insertRow();

    // Populate row cells from left to right. BAD WAY TO DO THIS BECAUSE OF innerHTML, it does rewrites
    // newRow.insertCell(0).innerHTML = ++contactsCnt;
    // newRow.insertCell(1).innerHTML = '<button><id class="fa fa-star"></id></button>'; // will need to make button better
    // newRow.insertCell(2).innerHTML = contactFirstName;
    // newRow.insertCell(3).innerHTML = contactLastName;
    // newRow.insertCell(4).innerHTML = email;
    // newRow.insertCell(5).innerHTML = phoneNum;
    // newRow.insertCell(6).innerHTML = 
    // '<button class="edit-contact-btn"><id class="fa fa-pen-to-square"></id></button>' +
    // '<button class="delete-contact-btn"><id class="fa fa-trash"></id></button>'

    // Populate row cells from left to right.
    newRow.insertCell(0).textContent = ++contactsCnt;
    
    let favBtn = document.createElement('button');
    favBtn.className = 'btn';
    let favIcon = document.createElement('i');
    favIcon.className = 'fa fa-star';
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
    editIcon.className = 'fa fa-pen-to-square';
    editBtn.appendChild(editIcon);

    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn';
    let deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa fa-trash';
    deleteBtn.appendChild(deleteIcon);

    actionBtns.appendChild(editBtn);
    actionBtns.appendChild(deleteBtn);
    // Append grouped buttons to the row (i.e., inserting the buttons into cell 6)
    actionsCell.appendChild(actionBtns);


    // Attach event listeners
    editBtn.addEventListener('click', function() {
        // Handle edit functionality here
        console.log('Edit button clicked for:', contactFirstName, contactLastName);
    });

    deleteBtn.addEventListener('click', function() {
        // Handle delete functionality here
        table.deleteRow(newRow.rowIndex); //automatically deletes row. 
        // Implement a pop up 
        console.log('Delete button clicked for:', contactFirstName, contactLastName);
    });

    // Insert code that checks if variables are valid

    let tmp = {
        UserID: userId, 
        FirstName: contactFirstName,
        LastName: contactLastName,
        Email: email,
        Phone: phoneNum
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
    {
        xhr.onreadystatechange = function () 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                console.log("Contact has been added");
                // Clear input fields in form 
                // document.getElementById("addContact").reset();
                // reload contacts table and switch view to show
                
                // NEED TO IMPLEMENT THESE TWO FUNCTIONS
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } 
    catch (err) 
    {
        console.log(err.message);
    }
}

function loadContacts() {
    let tmp = {
        search: "",
        userId: userId
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
                for (let i = 0; i < jsonObject.results.length; i++)
                {
                    newRow.insertCell(0).innerHTML = contactsCnt;
                    newRow.insertCell(1).innerHTML = '<button"><id class="fa fa-star"></id></button>'; // will need to make button better
                    newRow.insertCell(2).innerHTML = jsonObject.results[i].FirstName;
                    newRow.insertCell(3).innerHTML = jsonObject.results[i].LastName;
                    newRow.insertCell(4).innerHTML = jsonObject.results[i].Email;
                    newRow.insertCell(5).innerHTML = jsonObject.result[i].Phone;
                    newRow.insertCell(6).innerHTML = '<button class="edit-contact-btn"><id class="fa fa-pen-to-square"></id></button>' +
                    '<button class="delete-contact-btn"><id class="fa fa-trash"></id></button>'
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact()
{
    let table = document.getElementById("cTable");
    table.deleteRow()
}

function refreshContacts()
{}

// Event listener for refresh contacts
// var refreshContact = document.getElementById("refresh");
// refreshContact.addEventListener('click', refreshContacts, false);

function editContact()
{

}

function openProfile()
{
}

function gotoHome()
{
}