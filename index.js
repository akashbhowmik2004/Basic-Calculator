let display = document.getElementById('display');
let expression = document.getElementById('expression');
let currentInput = '0';
let fullExpression = '';
let lastWasOperator = false;
let justCalculated = false;

function updateDisplay() {
  display.textContent = currentInput;
  expression.textContent = fullExpression;
}

function inputNumber(num) {
  if (justCalculated) {
    // Start fresh after calculation
    currentInput = num;
    fullExpression = num;
    justCalculated = false;
  } else if (lastWasOperator || currentInput === '0') {
    currentInput = num;
    fullExpression += num;
  } else {
    currentInput += num;
    fullExpression += num;
  }
  lastWasOperator = false;
  updateDisplay();
}

function inputOperator(op) {
  if (justCalculated) {
    // Continue with the result
    fullExpression = currentInput + ' ' + getOperatorSymbol(op) + ' ';
    justCalculated = false;
  } else if (!lastWasOperator && fullExpression !== '') {
    // Calculate if there's a pending operation
    if (fullExpression.includes('+') || fullExpression.includes('-') ||
      fullExpression.includes('×') || fullExpression.includes('÷')) {
      calculate(false);
    }
    fullExpression += ' ' + getOperatorSymbol(op) + ' ';
  } else if (lastWasOperator) {
    // Replace the last operator
    fullExpression = fullExpression.slice(0, -3) + ' ' + getOperatorSymbol(op) + ' ';
  } else {
    fullExpression = currentInput + ' ' + getOperatorSymbol(op) + ' ';
  }

  lastWasOperator = true;
  updateDisplay();
}

function getOperatorSymbol(op) {
  switch (op) {
    case '+': return '+';
    case '-': return '-';
    case '*': return '×';
    case '/': return '÷';
    default: return op;
  }
}

function calculate(showResult = true) {
  if (fullExpression && !lastWasOperator) {
    try {
      // Replace symbols for evaluation
      let evalExpression = fullExpression.replace(/×/g, '*').replace(/÷/g, '/');
      let result = eval(evalExpression);

      if (result === Infinity || result === -Infinity || isNaN(result)) {
        currentInput = 'Error';
        fullExpression = '';
      } else {
        // Round to avoid floating point errors
        result = Math.round(result * 1000000000) / 1000000000;
        currentInput = result.toString();

        if (showResult) {
          fullExpression += ' = ' + result;
          justCalculated = true;
        }
      }
    } catch (error) {
      currentInput = 'Error';
      fullExpression = '';
    }
  }

  lastWasOperator = false;
  updateDisplay();

  if (showResult) {
    // Add pulse effect to equals button
    document.querySelector('.btn-equals').classList.add('pulse');
    setTimeout(() => {
      document.querySelector('.btn-equals').classList.remove('pulse');
    }, 1000);
  }
}

function clearDisplay() {
  currentInput = '0';
  fullExpression = '';
  lastWasOperator = false;
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  if (justCalculated) {
    clearDisplay();
    return;
  }

  if (fullExpression.length > 0) {
    fullExpression = fullExpression.slice(0, -1);

    if (fullExpression.endsWith(' ')) {
      fullExpression = fullExpression.trim();
      lastWasOperator = false;
    } else if (fullExpression.endsWith('+') || fullExpression.endsWith('-') ||
      fullExpression.endsWith('×') || fullExpression.endsWith('÷')) {
      lastWasOperator = true;
    }

    // Update current input to the last number in the expression
    let parts = fullExpression.split(/[+\-×÷]/);
    currentInput = parts[parts.length - 1].trim() || '0';

    if (currentInput === '') {
      currentInput = '0';
    }
  } else {
    currentInput = '0';
  }

  updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function (event) {
  const key = event.key;

  if (key >= '0' && key <= '9') {
    inputNumber(key);
  } else if (key === '.') {
    inputNumber('.');
  } else if (['+', '-', '*', '/'].includes(key)) {
    inputOperator(key);
  } else if (key === 'Enter' || key === '=') {
    calculate();
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    clearDisplay();
  } else if (key === 'Backspace') {
    deleteLast();
  }
});
