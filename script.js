// ? pomodoro timer
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");
const timerDisplay = document.querySelector("#timerDisplay");
const timerModes = document.querySelector(".timerModes");

let workMins = 25;
let shortBreakMins = 5;
let longBreakMins = 15;

let currentDuration = workMins;
let modes = {
  work: "work",
  shortBreak: "shortBreak",
  longBreak: "longBreak",
};
let currentMode = modes.work;

let timerInterval = null;
let minutes;
let seconds;
let totalSeconds;

function formatTime(mins, secs) {
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function switchTimerModes(duration, modeType, clickedBtn) {
  clearInterval(timerInterval);
  currentDuration = duration;
  totalSeconds = currentDuration * 60;
  timerDisplay.innerHTML = formatTime(currentDuration, 0);
  currentMode = modeType;
  document.querySelectorAll(".timerModes button").forEach((btn) => {
    btn.classList.remove("shadow-lg", "shadow-blue-500/50");
    btn.disabled = false;
  });

  clickedBtn.classList.add("shadow-lg", "shadow-blue-500/50");
  clickedBtn.disabled = true;
}
function startTimer(mins) {
  if (timerInterval) return;
  if (totalSeconds === undefined || totalSeconds <= 0) {
    totalSeconds = mins * 60;
  }

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      minutes = Math.floor(totalSeconds / 60);
      seconds = totalSeconds % 60;
      timerDisplay.innerHTML = formatTime(minutes, seconds);
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      timerDisplay.innerHTML = `00:00`;
    }
  }, 1000);
}
function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}
function resetTimer() {
  clearInterval(timerInterval);
  totalSeconds = currentDuration * 60;
  timerInterval = null;
  timerDisplay.innerHTML = formatTime(currentDuration, 0);
}

timerModes.addEventListener("click", (e) => {
  if (e.target.classList.contains("workBtn")) {
    switchTimerModes(workMins, modes.work, e.target);
  }

  if (e.target.classList.contains("shortBreakBtn")) {
    switchTimerModes(shortBreakMins, modes.shortBreak, e.target);
  }

  if (e.target.classList.contains("longBreakBtn")) {
    switchTimerModes(longBreakMins, modes.longBreak, e.target);
  }
});

startBtn.addEventListener("click", () => {
  startTimer(currentDuration);
});

pauseBtn.addEventListener("click", () => {
  pauseTimer();
});

resetBtn.addEventListener("click", () => {
  resetTimer();
});
