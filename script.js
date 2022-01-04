//TODO: fix jsPDF format
//TODO: fix array to match jsPDF format
//TODO: clean up code and remove unnecessary code
//FIXME: fix createFile function with jspdf regular table or auto-table
const { jsPDF } = window.jspdf;
import * as global from "./GlobalVariables.js";
import enter_name from "./Button/enterName.js";
import addItem from "./Button/addItem.js";

global.getFromLocalStorage();

if (localStorage.getItem("name") != null) {
  global.changeName(localStorage.getItem("name"));
}

if (global.grocerylist.length > 0) {
  global.changeId(global.grocerylist.length);
  global.listFoundScene.classList.remove("d-none");

  var centerNameListFound = document.getElementById("center-name-list-found");
  centerNameListFound.innerText = `Welcome back, ${global.name}!\n Would you like to create a new list or continue?`;
} else {
  global.clearStartScene.classList.remove("d-none");
}

function createListScene() {
  global.listFoundScene.classList.add("d-none");
  global.clearStartScene.classList.remove("d-none");
  localStorage.clear();
}

global.saveToLocalStorage();

function continueWithOldList() {
  //change text and buttons
  global.topLeftName.innerText = global.name + "\n Grocery List";

  addItemsFromGroceryList();

  global.clearStartScene.classList.add("d-none");
  global.creatingList.classList.remove("d-none");
  global.listFoundScene.classList.add("d-none");
}

//FIXME: make work with newa array format
function addItemsFromGroceryList() {
  global.grocerylist.map((object) => {
    var groceryItem = object.item;
    var numItem = object.amount;

    //create label to append
    var label = document.createElement("li");
    label.id = object.id;

    label.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "flex-wrap",
      "p-2"
    );

    var number = document.createElement("p");
    number.classList.add("badge", "bg-primary", "my-auto");

    //change value according to user input on item
    label.innerHTML = groceryItem;
    number.innerHTML = numItem;

    label.appendChild(number);
    label.onclick = function (e) {
      e.preventDefault();
      var grocerylist = global.grocerylist;

      var [x] = label.innerHTML.split("<", 1);
      console.log(x);

      grocerylist = grocerylist.filter((obj) => {
        return obj.item != x;
      });

      global.changeGroceryList(grocerylist);
      global.saveToLocalStorage();
      global.calculateTotal();
      label.remove();
    };

    //3. append label to the div
    global.div.prepend(label);
  });

  global.calculateTotal();
}

//funciton create_list() start the process for the list
function create_list() {
  //check if there is a value: require a value

  if (global.nameInputText.value.length != 0) {
    //change value
    global.topLeftName.innerText = name + " Grocery List";

    //change button visibility
    changeButtonVisibility("2");

    //reset and change more text
    global.nameInputText.value = "";
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

function create_file() {
  //create variables needed to start
  var d = new Date();
  var doc = new jsPDF();

  var headers = [{header: "Item", dataKey: "item"},{header: "Amount" , dataKey:'amount'}];

  //create text for date
  var date = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();

  // //set heading and size of title on the pdf file
  doc.setFontSize(22);
  doc.text(20, 10, "Grocery List");
  doc.text(150, 10, date);
  
  doc.autoTable({
    headStyles: { fillColor: 0 },
    margin: { top: 20 },
    body: global.grocerylist,
    columns: headers,
  });

  // create, save and downloable to user
  var docName = date + "_grocerylist.pdf";
  doc.save(docName);
}

//event listeners
global.enterNameButton.addEventListener("click", enter_name);
global.addItemButton.addEventListener("click", addItem);
global.downloadButton.addEventListener("click", create_file);
global.continueButton.addEventListener("click", continueWithOldList);
global.clearListButton.addEventListener("click", createListScene);
