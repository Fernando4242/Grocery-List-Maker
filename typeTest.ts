//TODO: fix jsPDF format
//TODO: fix array to match jsPDF format
//TODO: clean up code and remove unnecessary code
//FIXME: fix createFile function with jspdf regular table or auto-table
const { jsPDF } = window.jspdf;
import x from "./scripts/enterName";

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

console.log(x);

//grocery list to append input from user
export var grocerylist = []; // [item,amount,index]
var id = 0;
var name = "";

getFromLocalStorage();

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

// //function enter_name() to get user input, to change text, and buttons
// function enter_name() {
//   //check if there is value : require a value

//   if (nameInputText.value.length != 0) {
//     //grab input
//     name = nameInputText.value;
//     grocerylist = [];
//     id = 0;

//     //change text and buttons
//     topLeftName.innerText = name + " Grocery List";

//     nameInputText.placeholder = "Ex: Milk (Character Limit : 40)";
//     clearStartScene.classList.add("d-none");
//     creatingList.classList.remove("d-none");
//     listFoundScene.classList.add("d-none");
//   } else {
//     //alert user
//     alert("Enter a value in the field");
//   }
// }

function continueWithOldList() {
  //change text and buttons
  topLeftName.innerText = name + " Grocery List";

  addItemsFromGroceryList();

  nameInputText.placeholder = "Ex: Milk (Character Limit : 40)";
  clearStartScene.classList.add("d-none");
  creatingList.classList.remove("d-none");
  listFoundScene.classList.add("d-none");
}

//FIXME: make work with newa array format
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
      "align-items-center",
      "flex-wrap",
      "p-2"
    );

    //create more tags to append into screen
    // input = document.createElement("input"),
    // span = document.createElement("p");
    number = document.createElement("span");
    number.classList.add("badge", "bg-primary", "my-auto");
    // input.type = "checkbox";

    //change value according to user input on item
    label.innerHTML = groceryItem;
    number.innerHTML = numItem;

    label.appendChild(number);
    label.onclick = function (e) {
      e.preventDefault();

      var [x] = label.innerHTML.split("<", 1);
      console.log(x);

      grocerylist = grocerylist.filter((value) => {
        return value[0] != x;
      });

      saveToLocalStorage();
      label.remove();
    };

    //3. append label to the div
    div.prepend(label);
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

//FIXME: make work with newa array format

//function addItem() to add items (user input) to list and append to screen
function addItem() {
  //check if there is value : require a value
  if (itemInput.value.length != 0 && !itemInput.value.includes(";")) {
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
      "align-items-center",
      "flex-wrap",
      "p-2"
    );

    //create more tags to append into screen
    // input = document.createElement("input"),
    // span = document.createElement("p");
    number = document.createElement("p");
    number.classList.add("badge", "bg-primary", "my-auto");
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

      label.appendChild(number);
      label.onclick = function (e) {
        e.preventDefault();

        var [x] = label.innerHTML.split("<", 1);
        console.log(x);

        grocerylist = grocerylist.filter((value) => {
          return value[0] != x;
        });

        saveToLocalStorage();
        label.remove();
      };

      //3. append label to the div
      div.prepend(label);

      saveToLocalStorage();
    }

    id++;
  } else {
    //alert user
    alert("Enter a valid input");
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




function create_file() {
  //create variables needed to start
  var d = new Date();
  var doc = new jsPDF();

  function createHeaders(keys) {
    return keys.map((key) => ({
      name: key,
      prompt: key,
      width: 100,
      align: "center",
      padding: 0,
    }));
  }

  var headers = createHeaders(["Item", "Amount"]);

  //create text for date
  date = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();

  //set heading and size of title on the pdf file
  doc.setFontSize(22);
  doc.text(20, 10, "Grocery List");
  doc.text(150, 10, date);

  grocerylist.push({ Item: "Milk", Amount: "2", Index: "0" });
  console.table(grocerylist);

  doc.table(20, 20, grocerylist, headers);

  // doc.table(20,20,grocerylist);

  // create, save and downloable to user
  var docName = date + "_grocerylist.pdf";
  doc.save(docName);
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

//FIXME: make work with newa array format

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

//FIXME: make work with newa array format
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

//FIXME: make work with newa array format
function addToItem(index, value) {
  grocerylist[index][1] += value;
}

//FIXME: make work with newa array format
function changeLabelHTML(duplicateValue, index) {
  var tempLabel = document.getElementById(`${index}`);
  var tempChild = tempLabel.getElementsByTagName("p")[0];

  //change innerHtml
  tempChild.innerHTML = grocerylist[duplicateValue][1];
}

//FIXME: make work with newa array format
function saveToLocalStorage() {
  localStorage.setItem("List", JSON.stringify(grocerylist));
  localStorage.setItem("name", name);
}

//FIXME: make work with newa array format
function getFromLocalStorage() {
  console.log(localStorage.length);

  if (localStorage.length == 2) {

    try {
      var tempArray = JSON.parse(localStorage.getItem("List"));
    } catch (error) {
      grocerylist = [];
    }

    if (tempArray != null) {
      grocerylist = Array.from(tempArray);
    }
  }

  console.log(grocerylist);
}

function handleChange() {
  span.innerHTML = bar.value;
}

// enterNameButton.addEventListener('click', enter_name);
