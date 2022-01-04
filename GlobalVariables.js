//varibles used all around the code
export var LOCAL_STORAGE_LISTNAME = "list";
export var LOCAL_STORAGE_USERNAME = "name";

export var nameInputText = document.getElementById("name-input");
export var topLeftName = document.getElementById("top-left-name");
export var centerName = document.getElementById("center-name");
export var enterNameButton = document.getElementById("enter-name-button");
export var createListButton = document.getElementById("create-list-button");
export var addItemButton = document.getElementById("add-item-button");
export var downloadButton = document.getElementById("download");
export var inputs = document.getElementById("inputs");
export var clearStartScene = document.getElementById("clear-start-scene");
export var listFoundScene = document.getElementById("list-found-scene");
export var creatingList = document.getElementById("working-on-list");
export var div = document.getElementById("list");
export var continueButton = document.getElementById("continue");
export var clearListButton = document.getElementById("clear");
export var itemTotal = document.getElementById("item-total");

//user variables
export var grocerylist = []; // [item,amount,index]
export var id = 0;
export var name = "";

//change functions
export function changeGroceryList(a) {
  grocerylist = a;
}

export function changeId(a) {
  id = a;
}

export function changeName(a) {
  name = a;
}

//FIXME: make work with newa array format
export function saveToLocalStorage() {
  localStorage.setItem("List", JSON.stringify(grocerylist));
  localStorage.setItem("name", name);
}

//FIXME: make work with newa array format
export function getFromLocalStorage() {
  console.log(localStorage.length);

  if (localStorage.length == 2) {
    try {
      var tempArray = JSON.parse(localStorage.getItem("List"));
      changeGroceryList(Array.from(tempArray));
    } catch (error) {
      changeGroceryList({});
    }
  }

  console.log(grocerylist);
}

export function calculateTotal() {
  let total = 0;

  grocerylist.map(item =>{
    total += Number(item.amount);
  });

  console.log("try");
  itemTotal.innerText = `Item Total: ${total}`;
}
