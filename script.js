let runningTotal = 0;   // tong ket qua da tinh duoc tu truoc
let currentInput = "0"; // so dang hien thi tren man hinh (nguoi dung dang go)
let currentOperator = null; // phep tinh dang cho xu ly: + - x /

const display = document.querySelector('.display');

function buttonClick(value){
    if(isNaN(value)){
        handleSymbol(value);
    }
    else{
        handleNumber(value);
    }
    display.innerText = currentInput;
}

function handleSymbol(symbol){
    switch(symbol){
        case 'C':
            currentInput = '0';
            runningTotal = 0;
            currentOperator = null;
            break;
        case '=':
            if(currentOperator === null){
                return;
            }
            flushOperator(parseFloat(currentInput));
            currentOperator = null;
            break;
        case '⌫':
            if(currentInput.length === 1) {
                currentInput = '0';
            }
            else{
                currentInput = currentInput.substring(0, currentInput.length - 1);
            }
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            handleMath(symbol);
            break;
        case ',':
            handleDecimal();
            break;
    }
}

function handleMath(symbol){
    if(currentInput === '0'){
        return;
    }
    const inputNumber = parseFloat(currentInput);
    if(currentOperator === null){
        runningTotal = inputNumber;
    }
    else{
        flushOperator(inputNumber);
    }
    currentOperator = symbol;
    currentInput = '0';
}

function flushOperator(inputNumber){
    if(currentOperator === '+'){
        runningTotal += inputNumber;
    }
    else if(currentOperator === '−'){
        runningTotal -= inputNumber;
    }
    else if(currentOperator === '×'){
        runningTotal *= inputNumber;
    }
    else if(currentOperator === '÷'){
        runningTotal /= inputNumber;
    }
    currentInput = runningTotal.toString();
}

function handleDecimal(){
    if(!currentInput.includes('.')){
        currentInput += '.';
    }
}

function handleNumber(numberString){
    if (currentInput === "0"){
        currentInput = numberString;
    }
    else{
        currentInput += numberString;
    }
}

function init(){
    document.querySelector('.keyboard').addEventListener('click', function(event){
        buttonClick(event.target.innerText.trim());
    })
}
init();