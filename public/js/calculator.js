let currentInput = "";
let previousInput = "";
let operator = "";

const display = document.getElementById("display");

// DISPLAY UPDATE
function updateDisplay() {

    if (operator && previousInput !== "") {

        display.innerHTML =
            previousInput + " " + operator + " " + currentInput + " ₹";

    } else {

        display.innerHTML = (currentInput || "0") + " ₹";
    }
}

// NUMBER APPEND
function appendNum(num) {

    currentInput += num;

    updateDisplay();
}

// OPERATOR SET
function setOp(op) {

    if (currentInput === "") return;

    previousInput = currentInput;
    operator = op;
    currentInput = "";

    updateDisplay();
}

// CALCULATE
function calculate() {

    if (
        previousInput === "" ||
        currentInput === "" ||
        operator === ""
    ) return;

    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);

    let result;

    switch (operator) {

        case "+":
            result = prev + current;
            break;

        case "-":
            result = prev - current;
            break;

        case "*":
            result = prev * current;
            break;

        case "/":
            result = prev / current;
            break;
    }

    display.innerHTML =
        previousInput +
        " " +
        operator +
        " " +
        currentInput +
        " = " +
        result +
        " ₹";

    currentInput = result.toString();
    previousInput = "";
    operator = "";

    saveResult();
}

// CLEAR
function clearCalc() {

    currentInput = "";
    previousInput = "";
    operator = "";

    display.innerHTML = "0 ₹";
}

// BACKSPACE
function backspace() {

    if (currentInput.length > 0) {

        currentInput = currentInput.slice(0, -1);

    } else if (operator !== "") {

        operator = "";

    } else if (previousInput.length > 0) {

        previousInput = previousInput.slice(0, -1);
    }

    updateDisplay();
}

// KEYBOARD SUPPORT
document.addEventListener("keydown", (e) => {

    // NUMBERS
    if (!isNaN(e.key)) {
        appendNum(e.key);
    }

    // DECIMAL
    if (e.key === ".") {
        appendNum(".");
    }

    // OPERATORS
    if (e.key === "+") {
        setOp("+");
    }

    if (e.key === "-") {
        setOp("-");
    }

    if (e.key === "*") {
        setOp("*");
    }

    if (e.key === "/") {
        setOp("/");
    }

    // ENTER
    if (e.key === "Enter") {
        calculate();
    }

    // BACKSPACE
    if (e.key === "Backspace") {
        backspace();
    }

    // ESCAPE
    if (e.key === "Escape") {
        clearCalc();
    }
});

// LATE FEE
function applyLateFee() {

    let days = prompt("Enter Days");

    currentInput = (days * 5).toString();

    updateDisplay();

    saveResult();
}

// PRINT COST
function applyPrintCost() {

    let pages = prompt("Enter Pages");

    currentInput = (pages * 2).toString();

    updateDisplay();

    saveResult();
}

// DISCOUNT
function applyDiscount() {

    currentInput = (
        parseFloat(currentInput || 0) * 0.8
    ).toString();

    updateDisplay();

    saveResult();
}

// PENALTY
function applyPenalty() {

    let amount = prompt("Enter Penalty");

    currentInput = amount;

    updateDisplay();

    saveResult();
}

// SAVE RESULT
async function saveResult() {

    await fetch("/save", {

        method: "POST",

        headers: {
            "Content-Type":
                "application/x-www-form-urlencoded"
        },

        body: `result=${currentInput}`
    });
}

// INITIAL DISPLAY
updateDisplay();
