let input = document.querySelector(".calc-input");
let currentValue = "";
let previousValue = "";
let operator = "";
let buttons = document.querySelectorAll("button");

buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    let key = e.target.innerText;

    if (!isNaN(key) || key === ".") {
      currentValue += key;
      input.value = currentValue;
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
      operator = key;
      previousValue = currentValue;
      currentValue = "";
      input.value = operator;
    } else if (key === "=") {
      let result;
      let a = parseFloat(previousValue);
      let b = parseFloat(currentValue);

      switch (operator) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '*':
          result = a * b;
          break;
        case '/':
          result = b === 0 ? "Error" : a / b;
          break;
        default:
          result = "Invalid";
      }

      input.value = result;
      currentValue = result.toString(); 
    } else if (key === "AC") {
      currentValue = "";
      previousValue = "";
      operator = "";
      input.value = "";
    }
  });
});
