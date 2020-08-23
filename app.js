
//BUDGET CONTROLLER
var budgetController = (function () {
    var Expenses = function (id, description, val) {
        this.id = id;
        this.description = description;
        this.value = val;
        this.percentage = -1;
    };

    Expenses.prototype.calcPercentages = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome)*100);
        } else {
            this.percentage = -1;
        }
    }

    Expenses.prototype.getPercentages = function() {
        return this.percentage;
    } 

    var Incomes = function (id, description, val) {
        this.id = id;
        this.description = description;
        this.value = val;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (curr) {
            sum += curr.value
        });

        //set the total value based upon exp or inc
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItems[type].map(function (curr) {
                return curr.id;
            });

            // find the index of id    
            index = ids.indexOf(id);

            // remove the selected element from data structure
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function () {
            // claculate the total incomes and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the budget Income - Expense
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the total percentage of Income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(curr) {
                curr.calcPercentages(data.totals.inc);
            });
        },
        getPercentage: function() {
            var perArr = data.allItems.exp.map(function(curr) {
                            return curr.getPercentages();
                        });
            return perArr;        
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        containerLabel: '.container'
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;

            //create html string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%d%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> <div></div>'
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%d%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
            }

            //replace placeholder text with actual values
            newHtml = html.replace('%d%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //add list in the UI
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function (selectorID) {
            var removeEl = document.getElementById(selectorID);
            removeEl.parentNode.removeChild(removeEl);
        },
        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            //loop over the whole fields array and set the empty value
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
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

        document.querySelector(DOM.containerLabel).addEventListener('click', ctrlDeleteItem);
    }

    var updateBudget = function () {
        // 1. claculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. display the budget on UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function() {
        // 1. calculates the percentages from budget controller
        budgetCtrl.calculatePercentages();

        // 2. Read the percentages
        var percentages = budgetCtrl.getPercentage();

        // 3. update the percentages for each expenses in UI
        console.log(percentages);
    }

    var ctrlEvent = function () {

        var input, newItem;

        // 1. Get Input Values
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the input fields
            UICtrl.clearFields();

            // 5. Calculate the updated budget
            updateBudget();

            // 6. Calculates and updates the percentages
            updatePercentages();
        }
    };

    //delete Item
    var ctrlDeleteItem = function (event) {
        var itemId, splitId, type, ID;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemId);

            // 3. Update budget and show the update budgetUI
            updateBudget();

            // 4. Calculates and updates the percentages
            updatePercentages();
        }
    }

    return {
        init: function () {
            console.log('Application has started!');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
        }
    }
})(budgetController, UIController);

appController.init();
