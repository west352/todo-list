// Keycode for the ENTER and ESC keys.
const ENTER_KEY = 13;
const ESC_KEY = 27;

// Initial todo items in a stringified format.
const stringifiedTodoItems = `
    [
        {
            "name": "This item is done",
            "done": true
        },
        {
            "name": "This item is not done",
            "done": false
        }
    ]
`;

/**
* Model describes how todo items are stored and
* specifies the methods that are used to modify the todo list.
*
* Note that model should NOT have interaction with the UI,
* i.e. no DOM manipulation here.
*
* Instead, the DOM should be updated in controller and view.
*/
const model = {
    items: JSON.parse(stringifiedTodoItems),

    /**
    * Count the total number of items
    * and the number of done items.
    * @return {Object} { numItems: ..., numDoneItems: ... }
    */
    countItems: function() {
        let numItems = 0;
        let numDoneItems = 0;
        numItems = this.items.length;
        this.items.forEach((item) => {
            if (item.done === true) {
                numDoneItems++;
            }
        });
        return {numItems, numDoneItems};
    },

    /**
    * Create a todo item, set it as undone and add it to the "items" array.
    * Items should have the following format:
    * { name: ..., done: true/false }
    * @param {string} name - the name of the new item
    */
    createItem: function(name) {
        let newItem = {name: name, done: false};
        model.items.push(newItem);
    },

    /**
    * Change the name of the specified todo item.
    * @param {Number} index - the index of the item in the zero-indexed "items" array
    * @param {string} name - the item's new name
    */
    changeItemName: function(index, name) {
        this.items[index].name = name;
    },

    /**
    * Delete the specified item.
    * @param {Number} index - the index of the item in the zero-indexed "items" array
    */
    deleteItem: function(index) {
        this.items.splice(index, 1);
    },

    /**
    * Delete all items.
    */
    deleteAllItems: function() {
        this.items.splice(0, this.items.length);
    },

    /**
    * Toggle the status of the specified item.
    * If it is done, change it to undone.
    * If it is undone, change it to done.
    * @param {Number} index - the index of the item in the zero-indexed "items" array
    */
    toggleItem: function(index) {
        this.items[index].done = !this.items[index].done;
    },

    /**
    * Toggle the status of all items.
    * If an item is done, change it to undone.
    * If an item is undone, change it to done.
    */
    toggleAllItems: function() {
        const {numItems, numDoneItems} = model.countItems();
        if (numItems === numDoneItems || numDoneItems === 0) {
            model.items.forEach((item, index) => {this.toggleItem(index)});
        } else {
            model.items.forEach(item => {
                if (!item.done) {
                    item.done = true;
                }
            })
        }
    },
};

/**
* Controller servers as a bridge between model and view.
*
* In every controller method, remember to update the UI
* by calling view.displayTodoItems().
*
* Difference between controller and view:
* Only event handling methods should be included in controller
* (e.g. methods that respond to an add-item event).
* Pure display methods and methods that are not
* directly related to the todo list
* should be included in view instead.
*/
const controller = {
    /**
    * Read the content from the input field
    * and create a new todo item.
    */
    createItem: function() {
        let newContent = document.getElementById("create-item-input");
        model.createItem(newContent.value);
        newContent.value = "";
        view.displayTodoItems();
    },

    /**
    * 2 keyboard events should be monitored:
    * pressing the ENTER key and pressing the ESC key.
    *
    * Update the name of the selected todo item
    * when the ENTER key is pressed.
    *
    * Exit editing mode and revert to the original name
    * when the ESC key is pressed.
    * @param {Event} event - the event paramter that is available to event handlers
    */
    updateItemNameOnKeyUp: function(event) {
        let selectedItemInput = event.target;
        let id = selectedItemInput.parentElement.id;
        let newName = selectedItemInput.value;
        if (event.code === ENTER_KEY && newName != "") {
            this.changeItemName(id, newName);
        } else if (event.code === ESC_KEY) {
            selectedItemInput.value = model.items[id].name;
            view.displayTodoItems();
        }
    },

    /**
    * Update the name of the selected todo item
    * when the user clicks on anything
    * that lies outside the input box.
    * @param {Event} event - the event paramter that is available to event handlers
    */
    updateItemNameOnFocusOut: function(event) {
        let selectedItemInput = event.target;
        let id = selectedItemInput.parentElement.id;
        let newName = selectedItemInput.value;
        if (newName != "") {
            this.changeItemName(id, newName);
        } else {
            this.deleteItem(id);
        }
    },

    /**
    * Change the name of the specified item.
    * @param {Number} index - the index of the item (index starts from zero)
    * @param {string} name - the item's new name
    */
    changeItemName: function(index, name) {
        model.changeItemName(index, name);
        view.displayTodoItems();
    },

    /**
    * Delete the specified item.
    * @param {Number} index - the index of the item (index starts from zero)
    */
    deleteItem: function(index) {
        model.deleteItem(index);
        view.displayTodoItems();
    },

    /**
    * Delete all items.
    */
    deleteAllItems: function() {
      let deleteConfirmed = confirm("This will delete all items in todo list");
      if (deleteConfirmed) {
          model.deleteAllItems();
          view.displayTodoItems();
      }
    },

    /**
    * Turn on the updating mode.
    * Display the update input and hide the todo item label.
    * @param {Event} event - the event paramter that is available to event handlers
    */
    turnOnUpdatingMode: function(event) {
        let selectedLabel = event.target;
        let selectedInput = selectedLabel.parentNode.querySelector(".update-item-input");
        view.hideDOMElement(selectedLabel);
        view.displayDOMElement(selectedInput);
        selectedInput.focus();
    },

    /**
    * Read the index of the selected item from the UI.
    * Toggle the status of the selected item.
    * If it is done, change it to undone.
    * If it is undone, change it to done.
    * @param {Event} event - the event paramter that is available to event handlers
    */
    toggleItem: function(event) {
        let selectedItem = event.target;
        let id = selectedItem.parentNode.id;
        model.toggleItem(id);
        view.displayTodoItems();
    },

    /**
    * Toggle the status of all items.
    * If an item is done, change it to undone.
    * If an item is undone, change it to done.
    */
    toggleAllItems: function() {
        model.toggleAllItems();
        view.displayTodoItems();
    },

    /**
    * Clear the input form that is used to add new items.
    */
    clearForm: function() {
        document.getElementById("create-item-input").value = "";
        let createItemForm = document.getElementById("create-item-form");
        createItemForm.reset();
        view.displayCreateItemButton();
    },
};

/**
* View contains methods that are responsible for displaying only but
* do not handle events (e.g. displayTodoItems).
* View also contains DOM manipulation methods where we can
* modified the appearance of UI elements and/or
* attach event listeners to them.
*/
const view = {
    /**
     * display the create input button if user is typing a new
     * todo item, otherwise hide the button when the create item input is empty.
     */
    displayCreateItemButton: function() {
        let createItemButton = document.getElementById("create-item-button");
        let createItemInput = document.getElementById("create-item-input");
        if (createItemInput.value.length > 0) {
            view.displayDOMElement(createItemButton);
        } else {
            view.hideDOMElement(createItemButton);
        }
    },

    /**
    * Render all todo items on the webpage.
    * This method is long and complex.
    * I have broken down the method into several smaller steps.
    * See the comments below.
    */
    displayTodoItems: function() {
        /**
        * If there is at least one item,
        * then display a button that is used to toggle the status of all items.
        * Otherwise, do not display.
        *
        * For each todo item, we should do the following:
        *
        * 1️⃣
        * Render a checkbox on the left.
        * If the item is done, the checkbox should be checked.
        * Otherwise, the checkbox should be empty;
        *
        * 2️⃣
        * Add an input box in order to edit the item's name.
        * Initially the input box should be invisible.
        * It becomes visible only when the user clicks on the item's name.
        *
        * 3️⃣
        * Display the item's name.
        * For a done item, its name should be displayed as stricken-through.
        *
        * 4️⃣
        * Display a delete button on the right.
        * Remember to attach appropriate event listener(s) to the button.
        */

        let toggleAllButton = document.getElementById("toggle-all-items-button");
       if (model.items.length > 0) {
           view.displayDOMElement(toggleAllButton);
       } else if (model.items.length === 0) {
           view.hideDOMElement(toggleAllButton);
       }

       let todoListUL = document.querySelector("ul");
       todoListUL.innerHTML = "";

       for (let i = 0; i < model.items.length; i++) {
           let listElement = document.createElement("li");
           listElement.setAttribute("id", `${i}`);  

           let checkBox = document.createElement("input");
           checkBox.setAttribute("type", "checkbox");
           checkBox.setAttribute("class", "toggle-item-checkbox");
           checkBox.addEventListener("change", controller.toggleItem);
           if (model.items[i].done) {
               checkBox.checked = true;
           } else {
               checkBox.checked = false;
           }

           let inputBox = document.createElement("input");
           inputBox.setAttribute("class", "update-item-input hide");
           inputBox.setAttribute("type", "text");
           inputBox.value = model.items[i].name;
           inputBox.addEventListener("keyup", controller.updateItemNameOnKeyUp.bind(controller));
           inputBox.addEventListener("focusout", controller.updateItemNameOnFocusOut.bind(controller));

           let itemLabel = document.createElement("label");
           itemLabel.setAttribute("class", "item-label");
           itemLabel.addEventListener("click", controller.turnOnUpdatingMode);
           itemLabel.innerHTML = model.items[i].name;
           if (model.items[i].done) {
               itemLabel.classList.add("item-strikethrough");
           } else {
               itemLabel.classList.remove("item-strikethrough");
           }

           let deleteButton = document.createElement("button");
           deleteButton.setAttribute("class", "x-button");
           deleteButton.innerHTML = "x";
           deleteButton.addEventListener("click", (event) => controller.deleteItem(i));
           
           listElement.appendChild(checkBox);
           listElement.appendChild(itemLabel);
           listElement.appendChild(inputBox);
           listElement.appendChild(deleteButton);
           todoListUL.insertBefore(listElement, todoListUL.childNodes[0]);
       }
    },

    /**
    * Display a DOM element.
    * @param {HTMLElement} domElement - the DOM element that you want to display
    */
    displayDOMElement: function(domElement) {
        domElement.classList.remove("hide");
    },

    /**
    * Hide a DOM element.
    * @param {HTMLElement} domElement - the DOM element that you want to hide
    */
    hideDOMElement: function(domElement) {
        domElement.classList.add("hide");
    }
};
view.displayTodoItems();