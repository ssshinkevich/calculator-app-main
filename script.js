const body = document.body;
const switcher = document.querySelector('.calculator__switcher-body');

let currentTheme = 1;
body.classList.add('theme-1');

switcher.addEventListener('click', () => {
  body.classList.remove(`theme-${currentTheme}`);
  currentTheme = currentTheme === 3 ? 1 : currentTheme + 1;
  body.classList.add(`theme-${currentTheme}`);

  const positions = {
    1: '0.8rem',
    2: '2rem',
    3: '3.2rem'
  };
  switcher.style.setProperty('--circle-left', positions[currentTheme]);
});

const screenHistory = document.getElementById("screen-history");
const screenMain = document.getElementById("screen-main");
const keys = document.querySelectorAll(".calculator__key");

let currentInput = "";
let previousInput = "";
let operator = null;
let resultDisplayed = false;

const MAX_FONT = 52;
const MIN_FONT = 16;

function updateMain(value) {
  screenMain.textContent = value || "0";

  screenMain.style.fontSize = MAX_FONT + "px";

  while (
    screenMain.scrollWidth > screenMain.clientWidth &&
    parseFloat(window.getComputedStyle(screenMain).fontSize) > MIN_FONT
  ) {
    let currentSize = parseFloat(window.getComputedStyle(screenMain).fontSize);
    screenMain.style.fontSize = (currentSize - 1) + "px";
  }
}

function updateHistory(value) {
  screenHistory.textContent = value || "";
}

keys.forEach((key) => {
  key.addEventListener("click", () => {
    const value = key.textContent;

    if (key.classList.contains("calculator__key--digit")) {
      if (resultDisplayed) {
        currentInput = "";
        previousInput = "";
        operator = null;
        updateHistory("");
        resultDisplayed = false;
      }
      if (currentInput.length >= 15) return;
      currentInput += value;
      updateMain(currentInput);

    } else if (key.classList.contains("calculator__key--decimal")) {
      if (resultDisplayed) { 
        currentInput = ""; 
        resultDisplayed = false; 
      }
      if (!currentInput.includes(".")) {
        currentInput += currentInput ? "." : "0.";
        updateMain(currentInput);
      }

    } else if (key.classList.contains("calculator__key--operator")) {
      if (resultDisplayed) {
        resultDisplayed = false;
      }
      if (!currentInput && !previousInput) return;

      if (previousInput && currentInput && operator) {
        calculate();
      }

      operator = value;
      previousInput = currentInput || previousInput;
      currentInput = "";
      updateHistory(`${previousInput} ${operator}`);
      updateMain("0");

    } else if (key.classList.contains("calculator__key--delete")) {
      currentInput = currentInput.slice(0, -1);
      updateMain(currentInput);

    } else if (key.classList.contains("calculator__key--reset")) {
      currentInput = "";
      previousInput = "";
      operator = null;
      resultDisplayed = false;
      updateHistory("");
      updateMain("0");

    } else if (key.classList.contains("calculator__key--equals")) {
      calculate();
    }
  });
});

function calculate() {
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let result;

  if (isNaN(prev) || isNaN(curr)) return;

  switch (operator) {
    case "+": result = prev + curr; break;
    case "-": result = prev - curr; break;
    case "x": result = prev * curr; break;
    case "/": result = curr === 0 ? "Error" : prev / curr; break;
    default: return;
  }

  updateHistory(`${previousInput} ${operator} ${currentInput} =`);
  updateMain(result);

  previousInput = result.toString();
  currentInput = "";
  operator = null;
  resultDisplayed = true;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js")
    .then(() => console.log("✅ Service Worker registered"))
    .catch(err => console.log("⚠️ Service Worker registration failed:", err));
}