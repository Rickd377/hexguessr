let targetHex, attempts;
const maxAttempts = 5;

function startNewGame() {
  targetHex = generateHexCode();
  attempts = 0;
  document.getElementById("color-display").style.backgroundColor = targetHex;
  document.getElementById("guess-input").value = "#";
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("message").textContent = "New game started! Try to guess the hex code.";
  document.getElementById("guess-display").style.backgroundColor = "#222";
}

function generateHexCode() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

function makeGuess() {
  if (attempts >= maxAttempts) {
    document.getElementById("message").textContent = "Game over! You've used all your guesses. Start a new game.";
    showPopup(false);
    return;
  }

  const input = document.getElementById("guess-input").value.toUpperCase();
  if (!/^#[0-9A-F]{6}$/.test(input)) {
    document.getElementById("message").textContent = "Enter a valid hex code in #RRGGBB format.";
    return;
  }

  attempts++;
  const feedback = document.createElement("div");
  feedback.classList.add("guess");

  for (let i = 1; i <= 6; i++) {
    const guessChar = input[i], targetChar = targetHex[i], span = document.createElement("span");
    const guessValue = parseInt(guessChar, 16), targetValue = parseInt(targetChar, 16), difference = Math.abs(guessValue - targetValue);

    if (guessChar === targetChar) {
      span.textContent = guessChar;
      span.classList.add("correct");
      span.innerHTML += " &#10003;";
    } else if (difference <= 2) {
      span.textContent = guessChar;
      span.classList.add("nearby");
      span.innerHTML += guessValue < targetValue ? " &#9650;" : " &#9660;";
    } else {
      span.textContent = guessChar;
      span.classList.add("too-far");
      span.innerHTML += guessValue < targetValue ? " &#9650;" : " &#9660;";
    }

    feedback.appendChild(span);
  }

  const feedbackContainer = document.getElementById("feedback");
  feedbackContainer.insertBefore(feedback, feedbackContainer.firstChild);
  document.getElementById("guess-display").style.backgroundColor = input;

  if (input === targetHex) {
    document.getElementById("message").textContent = `Correct! The code was ${targetHex}`;
    showPopup(true);
  } else if (attempts >= maxAttempts) {
    document.getElementById("message").textContent = `Game over! The correct code was ${targetHex}. Start a new game.`;
    showPopup(false);
  } else {
    document.getElementById("message").textContent = `Attempt ${attempts} of ${maxAttempts}: Keep trying!`;
  }
}

document.getElementById("guess-input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    makeGuess();
    document.getElementById("guess-input").value = "#";
  }
});

function showPopup(won) {
  const popup = document.querySelector('.popup'), attemptField = document.querySelector('.attempt-field');
  attemptField.innerHTML = '';

  const feedbackItems = document.querySelectorAll('#feedback .guess');
  feedbackItems.forEach(feedback => {
    const attemptRow = document.createElement('div');
    attemptRow.classList.add('attempt-row');
    feedback.querySelectorAll('span').forEach(item => {
      const icon = document.createElement('span');
      icon.className = item.className;
      icon.innerHTML = item.innerHTML.replace(/[0-9A-F]/g, '');
      attemptRow.appendChild(icon);
    });
    attemptField.appendChild(attemptRow);
  });

  const actualAttempts = feedbackItems.length;
  document.querySelector('.color').textContent = targetHex;
  document.querySelector('.attempts').textContent = actualAttempts;
  document.querySelector('.score').textContent = won ? "Good job" : "Game over";
  popup.classList.add('active');
}

function hidePopup() {
  document.querySelector('.popup').classList.remove('active');
}

startNewGame();