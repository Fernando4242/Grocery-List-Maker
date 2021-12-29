/*
  TO-DO:
  - check max item count and generate new one
  - make jspdf look prettier
  - make functionality smoother
  - make website prettier
  - another interface 
  - add old array into page as labels when user accepts to use old array
  - embed pdf into webpage
  - set starting id different
  - add button to clear form
  - add icons
  - add footer
  - redo remove function since it does not remove the correct one
*/

//using jsPDF to create a pdf file
window.jsPDF = window.jspdf.jsPDF;

//varibles used all around the code
var nameInputText = document.getElementById("name-input");
var topLeftName = document.getElementById("top-left-name");
var centerName = document.getElementById("center-name");
var enterNameButton = document.getElementById("enter-name-button");
var createListButton = document.getElementById("create-list-button");
var addItemButton = document.getElementById("add-item-button");
var downloadButton = document.getElementById("download");
var inputs = document.getElementById("inputs");
var clearStartScene = document.getElementById("clear-start-scene");
var listFoundScene = document.getElementById("list-found-scene");
var creatingList = document.getElementById("working-on-list");
var span = document.getElementById("range-text");
var bar = document.getElementById("customRange2");
var itemInput = document.getElementById("item-input");

//get value list
var div = document.getElementById("list");

//grocery list to append input from user
var grocerylist = [];
var id = 0;
var name = "";

getFromLocalStorage();
// localStorage.setItem("name",name);

if (localStorage.getItem("name") != null) {
  name = localStorage.getItem("name");
}

if (grocerylist.length > 0) {
  id = grocerylist.length;
  listFoundScene.classList.remove("d-none");

  var centerNameListFound = document.getElementById("center-name-list-found");
  centerNameListFound.innerText = `Welcome back, ${name}!\n Would you like to create a new list or continue?`;
} else {
  clearStartScene.classList.remove("d-none");
}

function createListScene() {
  listFoundScene.classList.add("d-none");
  clearStartScene.classList.remove("d-none");
  localStorage.clear();
}

saveToLocalStorage();

//function enter_name() to get user input, to change text, and buttons
function enter_name() {
  //check if there is value : require a value

  if (nameInputText.value.length != 0) {
    //grab input
    name = nameInputText.value;
    grocerylist = [];
    id = 0;

    //change text and buttons
    topLeftName.innerText = name + " Grocery List";

    nameInputText.placeholder = "Ex: Milk (Character Limit : 40)";
    clearStartScene.classList.add("d-none");
    creatingList.classList.remove("d-none");
    listFoundScene.classList.add("d-none");
  } else {
    //alert user
    alert("Enter a value in the field");
  }
}

function continueWithOldList() {
  //change text and buttons
  topLeftName.innerText = name + " Grocery List";

  addItemsFromGroceryList();

  nameInputText.placeholder = "Ex: Milk (Character Limit : 40)";
  clearStartScene.classList.add("d-none");
  creatingList.classList.remove("d-none");
  listFoundScene.classList.add("d-none");
}

function addItemsFromGroceryList() {
  grocerylist.map((object) => {
    var groceryItem = object[0];
    var numItem = object[1];

    //create label to append
    var label = document.createElement("li");
    label.id = object[2];

    label.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    //create more tags to append into screen
    // input = document.createElement("input"),
    // span = document.createElement("p");
    number = document.createElement("p");
    // input.type = "checkbox";

    //change value according to user input on item
    label.innerHTML = groceryItem;
    number.innerHTML = numItem;

    label.appendChild(number);
    label.onclick = function (e) {
      e.preventDefault();

      var [x] = (label.innerHTML).split('<', 1);
      console.log(x);

      grocerylist = grocerylist.filter( value => {
        return value[0] != x;
      });

      saveToLocalStorage();
      label.remove();
    };

    //3. append label to the div
    div.appendChild(label);
  });
}

//funciton create_list() start the process for the list
function create_list() {
  //check if there is a value: require a value

  if (nameInputText.value.length != 0) {
    //change value
    topLeftName.innerText = name + " Grocery List";

    //change button visibility
    changeButtonVisibility("2");

    //reset and change more text
    nameInputText.value = "";
    centerName.innerText = "Add Item To List";
    numItemText.classList.remove("hidden");
    downloadButton.classList.remove("hidden");
    inputs.classList.remove("inputs-start");
    inputs.classList.add("inputs-add-item");
  } else {
    //alert user for input
    alert("Enter a value in the field");
  }
}

//function addItem() to add items (user input) to list and append to screen
function addItem() {
  //check if there is value : require a value
  if (itemInput.value.length != 0) {
    //capatalize first letter
    var groceryItem = capitalize(itemInput.value);
    var numItem = parseInt(bar.value);

    //create label to append
    var label = document.createElement("li");
    label.id = id;

    label.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    //create more tags to append into screen
    // input = document.createElement("input"),
    // span = document.createElement("p");
    number = document.createElement("p");
    // input.type = "checkbox";

    let duplicateValue = checkDuplicate(groceryItem);

    //check if value was entered
    if (isNaN(numItem)) {
      numItem = 1;
    }

    if (duplicateValue != -1) {
      addToItem(duplicateValue, numItem);
      changeLabelHTML(duplicateValue, grocerylist[duplicateValue][2]);
      saveToLocalStorage();
    } else {
      //change value according to user input on item
      label.innerHTML = groceryItem;
      number.innerHTML = numItem;

      //push to list
      grocerylist.push([groceryItem, numItem, id]);
      console.table(grocerylist);

      //1. append input tag (checkbox) to label
      // label.appendChild(input);

      //2. append span tag (hold user input text) to label
      // label.appendChild(span);

      label.appendChild(number);
      label.onclick = function (e) {
        e.preventDefault();
  
        var [x] = (label.innerHTML).split('<', 1);
        console.log(x);
  
        grocerylist = grocerylist.filter( value => {
          return value[0] != x;
        });
  
        saveToLocalStorage();
        label.remove();
      };

      //3. append label to the div
      div.appendChild(label);

      saveToLocalStorage();
    }

    id++;
  } else {
    //alert user
    alert("Enter a value in the field");
  }

  //reset and print to console for checking
  itemInput.value = "";
  bar.value = 1;
  span.innerText = 1;
}

function removeItem({ e, label }) {
  e.preventDefault();
  console.log(label.innerHTML);

  grocerylist = array.filter(function (value, index, arr) {
    console.log(value);
    return value[0] != label.innerHTML;
  });

  saveToLocalStorage();
  label.remove();
}

//function create_file() to create a pdf file holding the values the user inputed (uses a library that was not written by me)
function create_file() {
  //create variables needed to start
  var d = new Date();
  var doc = new jsPDF();

  //create text for date
  date = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();

  //set heading and size of title on the pdf file
  doc.setFontSize(22);
  doc.text(20, 10, "Grocery List");
  doc.text(90, 10, date);

  var space = 20;

  //loop over array and append to file
  for (i = 0; i < grocerylist.length; i++) {
    doc.text(20, (space += 10), grocerylist[i][0]);
    doc.text(20, (space += 10), grocerylist[i][1].toString());
  }

  // create, save and downloable to user
  var docName = date + "_grocerylist.pdf";
  // doc.save(docName);
  doc.output("dataurlnewwindow");
}

function changeButtonVisibility(option) {
  switch (option) {
    case "1":
      // code block
      nameInputText.classList.add("hidden");
      enterNameButton.classList.add("hidden");
      createListButton.classList.remove("hidden");
      break;
    case "2":
      // code block
      //change button visibility
      createListButton.classList.add("hidden");
      topLeftName.classList.remove("hidden");
      nameInputText.classList.remove("hidden");
      addItemButton.classList.remove("hidden");
      break;
  }
}

function checkDuplicate(item) {
  var idFound = -1;

  grocerylist.map((data, idx) => {
    if (data[0] == item) {
      idFound = idx;
      return;
    }
  });

  return idFound;
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

function addToItem(index, value) {
  grocerylist[index][1] += value;
}

function changeLabelHTML(duplicateValue, index) {
  var tempLabel = document.getElementById(`${index}`);
  var tempChild = tempLabel.getElementsByTagName("p")[0];

  //change innerHtml
  tempChild.innerHTML = grocerylist[duplicateValue][1];
}

function saveToLocalStorage() {
  localStorage.setItem("List", JSON.stringify(grocerylist));
  localStorage.setItem("name", name);
  // //test save
  // console.log(JSON.parse(localStorage.getItem("List")));
}

function getFromLocalStorage() {
  console.log(localStorage.length);

  if (localStorage.length == 2) {
    var tempArray = JSON.parse(localStorage.getItem("List"));

    if (tempArray != null) {
      grocerylist = Array.from(tempArray);
    }
  }

  console.log(grocerylist);
}

function createLabel() {}

function handleChange() {
  span.innerHTML = bar.value;
}
