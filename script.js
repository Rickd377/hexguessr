let targetHex;
let attempts;
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
    const guessChar = input[i];
    const targetChar = targetHex[i];
    const span = document.createElement("span");

    const guessValue = parseInt(guessChar, 16);
    const targetValue = parseInt(targetChar, 16);
    const difference = Math.abs(guessValue - targetValue);

    // Correct character
    if (guessChar === targetChar) {
      span.textContent = guessChar;
      span.classList.add("correct");
      span.innerHTML += " &#10003;";  // Check mark for correct character
    } 
    // Nearby character (within 2 steps)
    else if (difference <= 2) {
      span.textContent = guessChar;
      span.classList.add("nearby");

      // Display arrow based on if it's too high or low
      span.innerHTML += guessValue < targetValue ? " &#9650;" : " &#9660;";
    } 
    // Too far away
    else {
      span.textContent = guessChar;
      span.classList.add("too-far");

      // Display arrow based on if it's too high or low
      span.innerHTML += guessValue < targetValue ? " &#9650;" : " &#9660;";
    }

    feedback.appendChild(span);
  }

  const feedbackContainer = document.getElementById("feedback");
  feedbackContainer.insertBefore(feedback, feedbackContainer.firstChild);

  // Update the guess display color
  document.getElementById("guess-display").style.backgroundColor = input;

  // Check if the guess was correct
  if (input === targetHex) {
    document.getElementById("message").textContent = `Correct! You guessed it in ${attempts} attempts. The code was ${targetHex}`;
    attempts = maxAttempts; // End game if correct
  } else if (attempts >= maxAttempts) {
    document.getElementById("message").textContent = `Game over! The correct code was ${targetHex}. Start a new game.`;
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

// Initialize the game on page load
startNewGame();