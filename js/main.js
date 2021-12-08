'use strict'

// ------------------- GLOBAL VARIABLES ------------------------
var currentColorRGB = "rgb(255, 0, 0)";
var currentColorName = "RED";
var isPainting = false;

// ------------------- MAIN ------------------------
$(window).ready(() => initWindow());

// Standard javascript version
// window.onload = initWindow;

// ------------------- FUNCTIONS ------------------------
function initWindow() {
    // Get current html page name.
    var currentPage = location.pathname.split('/').pop();

    loadUserData();
    
    if (currentPage == "game.html") {
        loadGameBoard();
    }

    initEventHandlers();
}

/** Loads user data into the browsers localStorage.*/
function loadUserData() {
    let jsonStr = 
        '[{"id":1,"nombre" : "Iker","apellido" : "Arana","usuario":"iarana","contrasenia":"1234Abcd"},' +
        '{"id":2,"nombre" : "Andoni","apellido" : "Larrieta","usuario":"alarrieta","contrasenia":"5678Efgh"},' +
        '{"id":3,"nombre" : "Iker","apellido" : "Arana","usuario":"jolano","contrasenia":"9012Ijkl"}]';

    let jsonObj = JSON.parse(jsonStr);

    for (let user of jsonObj) {
        localStorage.setItem(user.usuario, JSON.stringify(user));
    }
}

/** Fills the board table with 30x30 cells.*/
function loadGameBoard() {
    var board = document.getElementById("gameBoard");
    var row;
    var cell;

    board.innerHTML = "";

    for (var i = 0; i < 30; i++) {
        row = board.insertRow(i);

        for (var j = 0; j < 30; j++) {
            cell = row.insertCell(j);
            cell.innerHTML = "";
        }
    }
}

/** Initializes event handlers for document objects.*/
function initEventHandlers() {
    $('#submitBtn').click(() => validateLoginForm());

    $("#colorRed").click(() => pickColor("#colorRed"));
    $("#colorYellow").click(() => pickColor("#colorYellow"));
    $("#colorGreen").click(() => pickColor("#colorGreen"));
    $("#colorBlue").click(() => pickColor("#colorBlue"));
    $("#colorWhite").click(() => pickColor("#colorWhite"));
    
    $("#gameBoard td").hover((event) => paintSquare(event.target));

    $("#gameBoard td").click((event) => {
        // Enable/Disable painting mode and paint the clicked square.
        isPainting = !isPainting;
        paintSquare(event.target);
    });
}

/**
 * Validates the input data of the login form.
 * @returns {boolean} True if validation is OK, otherwise false.
 */
function validateLoginForm() {
    var usernameInput = document.getElementById("usernameInput").value;
    var passwordInput = document.getElementById("passwordInput").value;
    var pattern;
    var jsonStr;
    var user;

    // Validate that username and password have been filled out.
    if (usernameInput == "" || passwordInput == "") {
        alert("A username and password must be specified.");
        return false;
    }

    jsonStr = localStorage.getItem(usernameInput); // Get user info from localStorage.

    // Validate that the username exists.
    if (jsonStr == null) {
        let errorMsg = "User '" + usernameInput + "' does not exist."; 

        alert(errorMsg);
        document.getElementById("loginForm").innerHTML += 
            "<br><br><span class='errorMsg'>" + errorMsg + "</span>";

        return false;
    }

    user = JSON.parse(jsonStr); // Get user object.

    // Validate that the specified password matches the users password.
    if (user.contrasenia != passwordInput) {
        alert("The password does not match the specified username.");
        return false;
    }
    
    // pattern = first letter of the users name + users surname (all in lower case).
    pattern = new RegExp("^" + user.nombre.charAt(0).toLowerCase() + user.apellido.toLowerCase() + "$");

    // Validate username format.
    if (!pattern.test(usernameInput)) {
        alert("The username does not match the patter.");
        return false;
    }

    // pattern = 4 numbers + 1 upper case letter + 3 lower case letters.
    pattern = new RegExp("^[0-9]{4}[A-Z][a-z]{3}$");

    // Validate password format.
    if (!pattern.test(passwordInput)) {
        alert("The password does not match the pattern.");
        return false;
    }

    return true;
}

/** Sets the current color to the users selection and shows it on screen.*/
function pickColor(colorPickerId) {
    currentColorRGB = $(colorPickerId).css("background-color");
    currentColorName = $(colorPickerId).attr('name');

    document.getElementById("colorIndicator").innerHTML = "SELECTED: " + currentColorName;
}

/**
 * Paints a square if the painting mode is on.
 * @param {string} squareId Id of the element that will be painted.
 */
function paintSquare(squareId) {
    if (isPainting) {
        $(squareId).css("background-color", currentColorRGB);
    }
}
