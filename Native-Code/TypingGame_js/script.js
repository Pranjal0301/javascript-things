const PARAGRAPHS = [
  "dance against the fading light.",
  "Amidst the bustling city, a lone figure sat on a park bench, lost in thought. The cacophony of urban life was a distant hum, and a gentle breeze rustled the leaves of nearby trees.",
  "In the heart of the enchanted forest, ancient trees whispered secrets to those who cared to listen. Sparkling streams wove through moss-covered rocks, creating a melody of nature's own.",
  "The laboratory hummed with the excitement of discovery as scientists diligently worked on their experiments. Beakers bubbled, and monitors displayed intricate patterns of data.",
  "On the open sea, the ship's sails billowed with wind, carrying its crew to new adventures. The waves danced beneath the vessel, reflecting the vibrant hues of the sky.",
];

const timeLeftEle = document.querySelector(".timeLeft b");
const mistakesEle = document.querySelector(".mistakes b");
const wpmEle = document.querySelector(".wpm b");
const cpmEle = document.querySelector(".cpm b");
const accuracyEle = document.querySelector(".accuracy b");
const tryAgain = document.querySelector(".tryAgain");

const modalTryAgain = document.querySelector(".modal-tryAgain");

const modalPopup = document.querySelector(".modal-popup");

// init global value
let maxTime = 60,
  timeLeft = maxTime,
  unSubscribeSetInterval,
  isTimingStart = false,
  currentParagraph,
  currentIndex = 0,
  correctCha = 0,
  isTyping = false,
  mistakes = 0,
  wpm,
  cpm;

function checkForKeyWord(keyWord) {
  if (
    keyWord === "Tab" ||
    keyWord === "CapsLock" ||
    keyWord === "Shift" ||
    keyWord === "Control" ||
    keyWord === "Alt" ||
    keyWord === "Enter" ||
    keyWord === "ContextMenu" ||
    keyWord === "Meta" ||
    keyWord === "Backspace"
  ) {
    return true;
  } else {
    return false;
  }
}

function displayModalPopUp(wpm, cpm, accuracy, mistakes) {
  modalPopup.innerHTML = "";
  modalPopup.innerHTML = `
  <div class="modal-content">
        <h2>Your result</h2>
        <ul class="modal-results">
          <li class="modal-result">
            <h3 class="modal-wpm">Words Per Minute (WPM): <b>${wpm}</b></h3>
          </li>
          <li class="modal-result">
            <h3 class="modal-cpm">Characters Per Minute (CPM): <b>${cpm}</b></h3>
          </li>
          <li class="modal-result">
            <h3 class="modal-accuracy">Accuracy: <b>${accuracy}%</b></h3>
          </li>
          <li class="modal-result">
            <h3 class="modal-mistakes">Total Mistakes: <b>${mistakes}</b></h3>
          </li>
        </ul>
        <h2 class="modal-tryAgain">Try Again</h2>
      </div>
  `;
}

function displayText() {
  const textContainer = document.querySelector(".text-container p");
  const tmp_fragment = document.createDocumentFragment();
  const randomIndex = Math.floor(Math.random() * PARAGRAPHS.length); // random index
  currentParagraph = PARAGRAPHS[randomIndex]; // paragraph
  // add span letter element to textContainer
  currentParagraph.split("").map((cha) => {
    const span = document.createElement("span");
    span.innerText = cha;
    tmp_fragment.appendChild(span);
  });
  textContainer.innerHTML = "";
  textContainer.appendChild(tmp_fragment);
  // add active class to the fist letter
  const firstNode = textContainer.firstChild;
  firstNode.classList.add("active");
}

// calculate duration
function duration() {
  unSubscribeSetInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timeLeftEle.innerText = timeLeft;
      calculateSpeed();
    } else {
      clearInterval(unSubscribeSetInterval);
      modalPopup.style.display = "flex";
    }
  }, 1000);
}

displayText();

// Calculate WPM and CPM
function calculateSpeed() {
  const totalTyped = currentIndex;
  const totalMistakes = mistakes;
  const totalCorrectCha = correctCha - mistakes;
  const totalCha = currentParagraph.length;
  const timeInMinutes = (maxTime - timeLeft) / 60; // Convert seconds to minutes

  const grossWPM = (totalTyped - totalMistakes) / timeInMinutes;
  const netWPM = Math.round(grossWPM - totalMistakes / timeInMinutes);
  const netCPM = Math.round(netWPM * 5); // Assuming an average word length of 5 characters
  const accuracy = Math.round((totalCorrectCha / totalCha) * 100);

  const wpm = !netCPM || netCPM < 0 || netCPM === NaN ? 0 : Math.max(netWPM, 0);
  const cpm = !netCPM || netCPM < 0 || netCPM === NaN ? 0 : Math.max(netCPM, 0);
  // update DOM
  wpmEle.innerText = wpm;
  // Ensure it's not negative
  cpmEle.innerText = cpm;
  // Ensure it's not negative
  accuracyEle.innerText = `${accuracy}%`;
  mistakesEle.innerText = totalMistakes;
}

document.addEventListener("keydown", (e) => {
  if (!isTimingStart && !isTyping) {
    duration();
    isTyping = true;
    isTimingStart = true;
  }
  if (checkForKeyWord(e.key)) {
    console.log("Ban");
  } else {
    const array = currentParagraph.split("");
    const character = e.key;

    // check current index is equal to paragraph length
    if (currentIndex === currentParagraph.length) {
      isTyping = false;
      isTimingStart = false;
      clearInterval(unSubscribeSetInterval);
      return;
    }

    const prevActiveSpan = document.querySelector(
      ".text-container p span.active"
    );
    prevActiveSpan.classList.remove("active");
    const nextActiveSpan = prevActiveSpan.nextElementSibling;

    if (character === array[currentIndex]) {
      prevActiveSpan.classList.add("correct");
      correctCha++;
    } else {
      prevActiveSpan.classList.add("incorrect");
      mistakes++;
    }
    currentIndex++;

    calculateSpeed();

    if (nextActiveSpan === null) {
      isTyping = false;
      isTimingStart = false;
      modalPopup.style.display = "flex";
      clearInterval(unSubscribeSetInterval);
      return;
    }
    nextActiveSpan.classList.add("active");
  }
});

function restartGame() {
  displayText();
  modalPopup.style.display = "none";
  clearInterval(unSubscribeSetInterval);
  currentIndex = 0;
  totalCorrectChar = 0;
  mistakes = 0;
  wpm = 0;
  cpm = 0;
  timeLeft = maxTime;
  isTimingStart = false;
  isTyping = false;

  wpmEle.innerText = wpm;
  cpmEle.innerText = cpm;
  mistakesEle.innerText = mistakes;
  timeLeftEle.innerText = timeLeft;
}

tryAgain.addEventListener("click", restartGame);
