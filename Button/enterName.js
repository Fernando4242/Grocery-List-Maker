import * as global from "../GlobalVariables.js";

//function enter_name() to get user input, to change text, and buttons
export default function enter_name() {
  //check if there is value : require a value
  if (global.nameInputText.value.length != 0) {
    //grab input
    global.changeName(global.nameInputText.value);
    global.changeGroceryList([]);
    global.changeId(0);
    console.log(global.id);

    //change text and buttons
    global.topLeftName.innerText = global.name + "\n Grocery List";

    global.clearStartScene.classList.add("d-none");
    global.creatingList.classList.remove("d-none");
    global.listFoundScene.classList.add("d-none");
    global.saveToLocalStorage();
    global.calculateTotal();
  } else {
    //alert user
    alert("Enter a value in the field");
  }
}


