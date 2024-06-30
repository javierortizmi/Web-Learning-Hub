"use strict";

// Error matrix to store the strings that will be displayed
let errors = [];

function validateNumber() {     // Validating the phone number
    let validNumber = true;

    // Number Input
    let phoneFirstPartValue = document.getElementById('phoneFirstPart').value;
    if (phoneFirstPartValue.length != 3 || isNaN(phoneFirstPartValue)) {
        validNumber = false;
    }

    let phoneSecondPartValue = document.getElementById('phoneSecondPart').value;
    if (phoneSecondPartValue.length != 3 || isNaN(phoneSecondPartValue)) {
        validNumber = false;
    }

    let phoneThirdPartValue = document.getElementById('phoneThirdPart').value;
    if (phoneThirdPartValue.length != 4 || isNaN(phoneThirdPartValue)) {
        validNumber = false;
    }

    if (!validNumber) {
        errors.push("Invalid phone number");
    }
}

function validateConditions() {     // Validating the conditions
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let atLeastOneChecked = false;

    // Checking if at least one checkbox is checked
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            atLeastOneChecked = true;
        }
    });

    if (atLeastOneChecked) {
        // Dont add errors
        console.log('At least one checkbox is checked.');
    } else {
        // Add errors
        console.log('Please check at least one checkbox.');
        errors.push("No conditions selected");
    }

    atLeastOneChecked = false;

    // Checking if the 'None' checkbox is checked, there are no other checks
    for (let i = 0; i < checkboxes.length-1;i++) {
        if (checkboxes[i].checked) {
            atLeastOneChecked = true;
        }
    }

    if (atLeastOneChecked && checkboxes[checkboxes.length - 1].checked) {
        // Add errors
        errors.push("Invalid conditions selection");
    }
}

function validateTimePeriod() {     // Validating the Time Period
    let radioInputs = document.querySelectorAll('input[type="radio"]');
    let atLeastOneChecked = false;

    // Checking if at least one radio button is checked
    radioInputs.forEach(function(radioInput) {
        if (radioInput.checked) {
            atLeastOneChecked = true;
        }
    });

    if (atLeastOneChecked) {
        // Dont add errors
        console.log('At least one radio is checked.');
    } else {
        // Add errors
        console.log('Please check at least one radio.');
        errors.push("No time period selected");
    }
}

function validateStudentId() {      // Validating the Student ID
    let validId = true;

    // Validating first four digits
    let firstFourDigits = document.getElementById('firstFourDigits').value;
    if (firstFourDigits[0] !== 'A') {
        validId = false;
    }
    for (let i=1; i<firstFourDigits.length;i++) {
        if (isNaN(firstFourDigits[i])) {
            validId = false;
        }
    }

    // Validating second four digits
    let secondFourDigits = document.getElementById('secondFourDigits').value;
    if (secondFourDigits[0] !== 'B') {
        validId = false;
    }
    for (let i=1; i<secondFourDigits.length;i++) {
        if (isNaN(secondFourDigits[i])) {
            validId = false;
        }
    }

    if (!validId) {
        errors.push("Invalid study id");
    }
}

window.onsubmit = function dataValidation() {   // When submit the form
    // Execute all the validations
    validateNumber();
    validateConditions();
    validateTimePeriod();
    validateStudentId(); 

    // Log all the errors
    console.log(errors);

    // If there are no errors ask for confirmation
    if (errors.length === 0) {  
        let answer = window.confirm("Do you want to submit the form data?");
        if (answer) {
            return true
        }
        else return false
    }
    else {  // If there are errors, join them in a string and print in an alert
        window.alert(errors.join("\n"));
        errors = [];
        return false
    }
}