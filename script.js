
const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let expression = "";

function updateDisplay() {
    resultDisplay.textContent = currentInput;
    expressionDisplay.textContent = expression;
}

function inputNumber(number) {
    if (waitingForSecondNumber) {
        currentInput = number;
        waitingForSecondNumber = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput.length < 15) {
        currentInput += number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondNumber) {
        currentInput = "0.";
        waitingForSecondNumber = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return b === 0 ? null : a / b;
        default:
            return b;
    }
}

function chooseOperator(nextOperator) {
    const inputValue = Number(currentInput);

    if (operator && !waitingForSecondNumber) {
        const result = calculate(
            firstNumber,
            inputValue,
            operator
        );

        if (result === null || !Number.isFinite(result)) {
            currentInput = "Error";
            expression = "Cannot divide by zero";
            firstNumber = null;
            operator = null;
            waitingForSecondNumber = true;
            updateDisplay();
            return;
        }

        currentInput = String(Number(result.toPrecision(10)));
    } else {
        firstNumber = inputValue;
    }

    operator = nextOperator;
    expression = `${currentInput} ${nextOperator}`;
    waitingForSecondNumber = true;
    updateDisplay();
}

function showResult() {
    if (operator === null || waitingForSecondNumber) return;

    const secondNumber = Number(currentInput);
    const first = firstNumber;
    const op = operator;
    const result = calculate(first, secondNumber, op);

    expression = `${first} ${op} ${secondNumber} =`;
    currentInput = result === null || !Number.isFinite(result)
        ? "Error"
        : String(Number(result.toPrecision(10)));

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = true;
    updateDisplay();
}

function clearCalculator() {
    currentInput = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    expression = "";
    updateDisplay();
}

function changeSign() {
    if (currentInput === "0" || currentInput === "Error") return;

    currentInput = String(Number(currentInput) * -1);
    updateDisplay();
}

function calculatePercent() {
    if (currentInput === "Error") return;

    currentInput = String(Number(currentInput) / 100);
    updateDisplay();
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.number !== undefined) {
        if (currentInput === "Error") clearCalculator();
        inputNumber(button.dataset.number);
        return;
    }

    const action = button.dataset.action;

    if (action === "clear") {
        clearCalculator();
    } else if (action === "decimal") {
        if (currentInput === "Error") clearCalculator();
        inputDecimal();
    } else if (action === "sign") {
        changeSign();
    } else if (action === "percent") {
        calculatePercent();
    } else if (action === "equals") {
        showResult();
    } else if (button.dataset.operator) {
        if (currentInput === "Error") clearCalculator();
        chooseOperator(button.dataset.operator);
    }
});

updateDisplay();
