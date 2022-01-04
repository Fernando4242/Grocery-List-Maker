import * as global from "../GlobalVariables.js";

var span = document.getElementById("range-text");
var bar = document.getElementById("customRange2");
var itemInput = document.getElementById("item-input");

//FIXME: make work with newa array format
export default function addItem() {
  var grocerylist = Array.from(global.grocerylist);
  //check if there is value : require a value
  if (itemInput.value.length != 0 && !itemInput.value.includes(";")) {
    //capatalize first letter
    var groceryItem = capitalize(itemInput.value);
    var numItem = bar.value;

    //create label to append
    var label = document.createElement("li");
    label.id = global.id;

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
    var number = document.createElement("p");
    number.classList.add("badge", "bg-primary", "my-auto");
    // input.type = "checkbox";

    let duplicateValue = checkDuplicate(groceryItem);

    //check if value was entered
    if (isNaN(numItem)) {
      numItem = "1";
    }

    if (duplicateValue != -1) {
      addToItem(duplicateValue, numItem);
      
      console.log(duplicateValue);
      console.log(global.grocerylist);

      changeLabelHTML(duplicateValue, (global.grocerylist[duplicateValue]).id);
      global.saveToLocalStorage();
    } else {
      //change value according to user input on item
      label.innerHTML = groceryItem;
      number.innerHTML = numItem;

      //push to list
      grocerylist.push({item:groceryItem, amount: numItem, id: global.id});
      console.table(grocerylist);

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

      global.changeGroceryList(grocerylist);
      global.saveToLocalStorage();
    }

    global.calculateTotal();
    global.changeId(global.id + 1);
  } else {
    //alert user
    alert("Enter a valid input");
  }

  //reset and print to console for checking
  itemInput.value = "";
  bar.value = 1;
  span.innerText = 1;
}

//FIXME: make work with newa array format
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

//FIXME: make work with newa array format
function addToItem(index, value) {
  var num = parseInt((global.grocerylist[index]).amount);
  console.log(num);

  num = num + Number(value);

  console.log(num);
  global.grocerylist[index].amount = num.toString();
  console.log(global.grocerylist[index].amount);
}

//FIXME: make work with newa array format
function changeLabelHTML(duplicateValue, index) {
  var tempLabel = document.getElementById(`${index}`);
  console.log(tempLabel);

  var tempChild = tempLabel.getElementsByTagName("p")[0];


  //change innerHtml
  tempChild.innerHTML = global.grocerylist[duplicateValue].amount;
}

//FIXME: make work with new array format
function checkDuplicate(item) {
  var idFound = -1;

  global.grocerylist.map((data, idx) => {
    if (data.item == item) {
      idFound = idx;
      return;
    }
  });

  return idFound;
}

function handleChange() {
  span.innerHTML = bar.value;
}

bar.addEventListener("change", handleChange);
