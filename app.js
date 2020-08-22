
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;

            //create html string with placeholder text
            if(type === 'inc') {
               element = DOMStrings.incomeContainer;
               html = '<div class="item clearfix" id="income-%d%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> <div></div>'
            } else if(type === 'exp') {
               element = DOMStrings.expensesContainer;
               html = '<div class="item clearfix" id="expense-%d%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
            }

            //replace placeholder text with actual values
            newHtml = html.replace('%d%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //add list in the UI
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' +DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            //loop over the whole fields array and set the empty value
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
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

    var updateBudget = function() {
        // 1. claculate the budget

        // 2. return the budget

        // 3. update budget UI
    }

    var ctrlEvent = function () {

        var input, newItem;

        // 1. Get Input Values
        input = UICtrl.getInput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the input fields
            UICtrl.clearFields();

            // 5. Calculate the updated budget
            updateBudget();
        }
    }

    return {
        init: function () {
            console.log('Application has started!');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

appController.init();
