
//BUDGET CONTROLLER
var budgetController = (function() {
    // Some Code 
})();

//UI CONTROLLER
var UIController = (function() {

})();


//GLOBAL APP CONTROLLER
var appController = (function(budgetCtrl, UICtrl) {

    var ctrlEvent = function () {
        // 1. Get Input Values
        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI

        console.log('It Works!');

    }

    document.querySelector('.add__btn').addEventListener('click', ctrlEvent);

    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 || event.which === 13) {
            ctrlEvent();
        }
    })
})(budgetController, UIController);
