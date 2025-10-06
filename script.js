const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

//Calculator State
let currentInput = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let calculated = false;

//Function to update the display
function updateDisplay(){
	display.textContent = currentInput.length>12? parseFloat(currentInput).toPrecision(8):currentInput;
}

//Handles digit input
function inputDigit(digit){
	if(calculated){
		currentInput = digit;
		calculated = false;
	} else if (waitingForSecondOperand){
		currentInput = digit;
		waitingForSecondOperand = false;
	} else {
		currentInput = currentInput ==='0'? digit:currentInput+digit;
	}
	updateDisplay();
}

//Handles decimal point input
function inputDecimal(){
	if (calculated || waitingForSecondOperand){
		currentInput = '0';
		waitingForSecondOperand = false;
		calculated = false; 
	} else if (!currentInput.includes('.')){
		currentInput +='.';
	}
	updateDisplay();
}
//performs the arithmetic operation
function calculate(first, second, op) {
first = parseFloat(first);
second = parseFloat(second);

if (op ==='+') return first + second;
if (op ==='-') return first - second;
if (op ==='*') return first * second;
if (op ==='/'){
	if (second===0) return 'Error';
	return first/second;
}
return second;
}

//Handles operator input (=,-,*,/)
function handleOperator(nextOperator){
	const inputValue = parseFloat(currentInput);
	if (operator && waitingForSecondOperand){
		operator = nextOperator;
		return;
	}
	if (firstOperand ===null){
		firstOperand = inputValue;
	} else if (operator){
		const result = calculate (firstOperand, inputValue, operator);
		if (result === 'Error'){
			currentInput = result;
			allClear();
			updateDisplay();
			return;
		}
		firstOperand = result;
		currentInput = String(result);
	}
	waitingForSecondOperand = true;
	operator = nextOperator;
	calculated = false;
	updateDisplay();
}

//Handlesthe equals (=) button
function handleEqual(){
	if (!operator||waitingForSecondOperand) return;
	const inputValue = parseFloat(currentInput);
	const result = calculate (firstOperand, inputValue, operator);

	if (result==='Error'){
		currentInput = result;
		allClear();
	} else{
		firstOperand = result;
		currentInput = String(result);
		operator = null; //clears operator for a fresh start
		calculated = true;
	}
	updateDisplay();
}

//clears all calculator state
function allClear(){
	currentInput = '0';
	firstOperand = null;
	operator = null;
	waitingForSecondOperand = false;
	calculated = false;
	updateDisplay();
}

//main event listener loop
buttons.forEach(button =>{
	button.addEventListener('click', (event)=>{
		const {type, value}=event.currentTarget.dataset;

		if (type==='number'){
			if (value==='.'){
				inputDecimal();
			} else{
				inputDigit(value);
			}
		}
			else if (type==='operator'){
				handleOperator(value);

			} else if (type ==='equal'){
				handleEqual();
			} else if (type==='clear'){
				allClear();
			}

	});
});

//intialize display
updateDisplay();
