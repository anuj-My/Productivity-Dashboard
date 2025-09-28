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

function switchTimerModes(duration, modeType, clickedBtn) {
  currentDuration = duration;
  timerDisplay.innerHTML = `${currentDuration}:00`;
  currentMode = modeType;
  document.querySelectorAll(".timerModes button").forEach((btn) => {
    btn.classList.remove("shadow-lg", "shadow-blue-500/50");
  });

  clickedBtn.classList.add("shadow-lg", "shadow-blue-500/50");
}
function startTimer(mins) {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    mins++;
  }, 1000);
}
function pauseTimer() {}
function resetTimer() {}

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
  startTimer();
});

pauseBtn.addEventListener("click", () => {
  pauseTimer();
});

resetBtn.addEventListener("click", () => {
  resetTimer();
});
