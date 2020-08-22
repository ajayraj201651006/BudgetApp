
//BUDGET CONTROLLER
var budgetController = (function () {
    var Expenses = function (id, description, val) {
        this.id = id;
        this.description = description;
        this.value = val;
    };

    var Incomes = function (id, description, val) {
        this.id = id;
        this.description = description;
        this.value = val;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, value) {
            var newItem, ID;

            //Create unique ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //craete newItem based on 'exp' or 'inc'
            if (type === 'exp') {
                newItem = new Expenses(ID, des, value);
            } else if (type === 'inc') {
                newItem = new Incomes(ID, des, value);
            }

            //push the new item into our data structure
            data.allItems[type].push(newItem);

            //return new item
            return newItem;
        },
        testing: function () {
            return data;
        }
    }
})();

//UI CONTROLLER
var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDomStrings: function () {
            return DOMStrings;
        }
    }

})();


//GLOBAL APP CONTROLLER
var appController = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlEvent);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlEvent();
            }
        });
    }

    var ctrlEvent = function () {

        var input, newItem;

        // 1. Get Input Values
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
    }

    return {
        init: function () {
            console.log('Application has started!');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

appController.init();
