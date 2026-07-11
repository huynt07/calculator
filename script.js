let tokens = [];
let currentInput = "0";
let justEvaluated = false;
let awaitingNewNumber = false;

const display = document.querySelector('.display');

function buttonClick(value){
    if(isNaN(value)){
        handleSymbol(value);
    }
    else{
        handleNumber(value);
    }
    updateDisplay();
}

function updateDisplay(){
    const parts = tokens.slice();
    if(!(awaitingNewNumber && currentInput === '0')){
        parts.push(currentInput);
    }
    display.innerText = parts.join(' ');
    display.scrollLeft = display.scrollWidth; // tu dong cuon toi cuoi (ben phai)
}

function isOperator(symbol){
    return symbol === '+' || symbol === '−' || symbol === '×' || symbol === '÷';
}

function handleSymbol(symbol){
    switch(symbol){
        case 'C':
            currentInput = '0';
            tokens = [];
            justEvaluated = false;
            awaitingNewNumber = false;
            break;
        case '=':
            handleEquals();
            break;
        case '⌫':
            handleBackspace();
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

function handleBackspace(){
    if(awaitingNewNumber && tokens.length > 0){
        tokens.pop();
        currentInput = tokens.pop();
        awaitingNewNumber = false;
        return;
    }

    if(currentInput.length === 1){
        currentInput = '0';
    }
    else{
        currentInput = currentInput.substring(0, currentInput.length - 1);
    }
}

function handleMath(symbol){
    if(currentInput === '0' && tokens.length > 0 && isOperator(tokens[tokens.length - 1])){
        tokens[tokens.length - 1] = symbol;
        return;
    }

    if(currentInput === '0' && tokens.length === 0){
        return;
    }

    if(justEvaluated){
        tokens = [];
        justEvaluated = false;
    }

    tokens.push(currentInput);
    tokens.push(symbol);
    currentInput = '0';
    awaitingNewNumber = true;
}

function handleEquals(){
    if(tokens.length === 0){
        return;
    }
    tokens.push(currentInput);

    const result = evaluateExpression(tokens);
    currentInput = result.toString();
    tokens = [];
    justEvaluated = true;
    awaitingNewNumber = false;
}

// Ham dung chung: duyet mang dang [so, toan_tu, so, toan_tu, so, ...]
// va rut gon nhung cap thoa toan_tu nam trong "operators", theo dung cong thuc "apply".
// Dung chung cho ca 2 buoc (nhan/chia truoc, cong/tru sau) thay vi lap code 2 lan.
function reduceByOperators(items, operators, apply){
    const result = [items[0]];
    for(let i = 1; i < items.length; i += 2){
        const operator = items[i];
        const number = items[i + 1];

        if(operators.includes(operator)){
            const previous = result.pop();
            result.push(apply(operator, previous, number));
        }
        else{
            result.push(operator, number);
        }
    }
    return result;
}

function evaluateExpression(exprTokens){
    const numericTokens = exprTokens.map((token, i) => i % 2 === 0 ? parseFloat(token) : token);

    const afterMulDiv = reduceByOperators(numericTokens, ['×', '÷'], (operator, a, b) =>
        operator === '×' ? a * b : a / b
    );
    const afterAddSub = reduceByOperators(afterMulDiv, ['+', '−'], (operator, a, b) =>
        operator === '+' ? a + b : a - b
    );

    return afterAddSub[0];
}

function handleDecimal(){
    if(awaitingNewNumber){
        awaitingNewNumber = false;
    }
    if(!currentInput.includes('.')){
        currentInput += '.';
    }
}

function handleNumber(numberString){
    if(justEvaluated){
        tokens = [];
        currentInput = '0';
        justEvaluated = false;
    }

    if(awaitingNewNumber){
        awaitingNewNumber = false;
    }

    if(currentInput === "0"){
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