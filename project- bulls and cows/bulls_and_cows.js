let secretNumber = generateSecretNumber();
let attempts = [];
// const NUMS_LEN = 4;

function generateSecretNumber() {
    let numbers = [];
    while (numbers.length < 4) {
        let digit = Math.floor(Math.random() * 10);
        if (!numbers.includes(digit)) {
            numbers.push(digit);
        }
    }
    return numbers.join('');
}

function checkGuess() {
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value.trim();
    guessInput.value = '';

    if (guess.length !== 4 || isNaN(guess)) {
        alert('Please enter a 4-digit number.');
        return;
    }

    let bulls = 0;
    let cows = 0;
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === secretNumber[i]) {
            bulls++;
        } else if (secretNumber.includes(guess[i])) {
            cows++;
        }
    }

    let result = document.getElementById('result');
    result.innerHTML = `Bulls: ${bulls}, Cows: ${cows}`;

    attempts.push({ guess, bulls, cows });

    updatePreviousAttempts();

    if (bulls === 4) {
        result.innerHTML = `Congratulations! You've guessed the secret number: ${secretNumber}`;
        return;
    }
}

function showSecret() {
    alert(`The secret number is: ${secretNumber}`);
}

function updatePreviousAttempts() {
    let previousAttemptsDiv = document.getElementById('previousAttempts');
    previousAttemptsDiv.innerHTML = '';
    for (let attempt of attempts) {
        let attemptDiv = document.createElement('div');
        attemptDiv.textContent = `Guess: ${attempt.guess}, Bulls: ${attempt.bulls}, Cows: ${attempt.cows}`;
        previousAttemptsDiv.appendChild(attemptDiv);
    }
}