
//BUDGET CONTROLLER
var budgetController = (function() {
    // Some Code 
})();

//UI CONTROLLER
var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDomStrings: function() {
            return DOMStrings;
        }
    }

})();


//GLOBAL APP CONTROLLER
var appController = (function(budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDomStrings();

    var ctrlEvent = function () {
        
        // 1. Get Input Values
        var input = UICtrl.getInput();
        console.log(input);

        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
    }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlEvent);

    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 || event.which === 13) {
            ctrlEvent();
        }
    })
})(budgetController, UIController);
