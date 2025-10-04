// ? ================================================pomodoro timer
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");
const timerDisplay = document.querySelector("#timerDisplay");
const timerModes = document.querySelector(".timerModes");
const modeButtons = document.querySelectorAll(".timerModes button");

let workMins = 25;
let shortBreakMins = 1;
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

const alarm = new Audio(
  "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
);

function formatTime(mins, secs) {
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function hightlightActiveMode(allBtns, mode) {
  allBtns.forEach((btn) => {
    btn.classList.remove("shadow-lg", "shadow-blue-500/50");
    btn.disabled = false;
  });

  const currentModeBtn = timerModes.querySelector(`.${mode}Btn`);
  if (currentModeBtn) {
    currentModeBtn.classList.add("shadow-lg", "shadow-blue-500/50");
    currentModeBtn.disabled = true;
  }
}
hightlightActiveMode(modeButtons, currentMode);

function switchTimerModes(duration, modeType) {
  clearInterval(timerInterval);
  currentDuration = duration;
  totalSeconds = currentDuration * 60;
  timerDisplay.innerHTML = formatTime(currentDuration, 0);
  currentMode = modeType;

  hightlightActiveMode(modeButtons, modeType);
}
function startTimer(mins) {
  if (timerInterval) return;

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

      alarm.play();
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
    switchTimerModes(workMins, modes.work);
  }

  if (e.target.classList.contains("shortBreakBtn")) {
    switchTimerModes(shortBreakMins, modes.shortBreak);
  }

  if (e.target.classList.contains("longBreakBtn")) {
    switchTimerModes(longBreakMins, modes.longBreak);
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

// ? =========================================================wheater api section
const wheaterApiKey = "2cf3c5fe11e8eab4cf657edede99dcd4";
const cityInput = document.getElementById("cityInput");
const weatherForm = document.getElementById("weatherForm");
const weatherCity = document.getElementById("weatherCity");
const weatherDesc = document.getElementById("weatherDesc");
const weatherTemp = document.getElementById("weatherTemp");
const errorBox = document.getElementById("errorBox");

const weatherIcon = document.getElementById("weatherIcon");

function getGeoLocation() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        reject(error);
      }
    );
  });
}
// getGeoLocation().then((res) => console.log(res));

function loadingState() {
  weatherCity.innerText = "Loading...";
  weatherTemp.innerText = "--°C";
  weatherDesc.innerText = "";
}

function updateWeatherUI(data) {
  weatherCity.innerText = data?.name;
  weatherDesc.innerText = data?.weather[0]?.description;
  weatherTemp.innerText = `${data?.main?.temp?.toFixed(1)}°C`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`;
}

function renderError(message) {
  const errHtml = `<div class="flex items-center gap-3 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700 shadow-md">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <span id="errorMessage" class="text-sm font-medium">${message}</span>
  </div>`;

  errorBox.insertAdjacentHTML("beforeend", errHtml);

  setTimeout(() => {
    errorBox.innerHTML = "";
  }, 3000);
}

async function currentLocationWheater() {
  errorBox.innerHTML = "";
  try {
    const position = await getGeoLocation();
    const { latitude, longitude } = position.coords;

    console.log(latitude, longitude);

    loadingState();
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${wheaterApiKey}&units=metric`
    );

    console.log(res);
    if (!res.ok) {
      throw new Error(
        `Request Failed: Error ${res.status} getting current location coordinates.`
      );
    }

    const data = await res.json();
    console.log(data);

    updateWeatherUI(data);
  } catch (err) {
    renderError(err.message);
  }
}

currentLocationWheater();

async function getWheaterByCity(city) {
  errorBox.innerHTML = "";
  try {
    loadingState();
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${wheaterApiKey}&units=metric`
    );

    if (!res.ok) {
      throw new Error(`Request Failed: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    updateWeatherUI(data);

    console.log(data);
  } catch (err) {
    renderError(err.message);
  }
}

weatherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputValue = cityInput.value.trim();
  if (!inputValue) return;

  getWheaterByCity(inputValue);

  cityInput.value = "";
});

// ? =========================================================Expense Tracker
const balance = document.getElementById("balance");
const expenseDesc = document.getElementById("expenseDesc");
const expenseAmount = document.getElementById("expenseAmount");
const expenseForm = document.getElementById("expenseForm");
const expenseType = document.getElementById("expenseType");
const transactions = document.getElementById("transactions");
const filterType = document.getElementById("filterType");

let transactionsArr = [];

function saveToLocalStorage(data) {
  localStorage.setItem("TRANSACTIONS", JSON.stringify(data));
}

function getTransactionFromStorage() {
  const getStorage = JSON.parse(localStorage.getItem("TRANSACTIONS"));
  if (getStorage && getStorage.length > 0) {
    transactionsArr = getStorage;
  }
}

function renderTrackerItem(item) {
  const transactionItem = `<li
      class="transactionItem flex items-center justify-between bg-slate-50 p-2 rounded border"
      data-id="${item.id}"
    >
      <div>
        <div class="font-medium">${item.description}</div>
        <div class="text-xs text-gray-500">${item.type}</div>
      </div>
      <div class="flex items-center gap-2">
        <div class="text-sm ${
          item.type === "expense" ? "text-red-500" : "text-green-500"
        }">₹${item.amount}</div>
        <button class="delete-btn text-xs text-red-600">✕</button>
      </div>
    </li>`;
  transactions.insertAdjacentHTML("beforeend", transactionItem);
}

function renderTrackerList(data) {
  console.log(data);
  transactions.innerHTML = "";
  data.forEach((item) => renderTrackerItem(item));
}

function renderFilterList(data, filterType) {
  const filterTransactions = data.filter((item) => {
    if (filterType !== "all") {
      return item.type === filterType;
    } else {
      return item;
    }
  });

  return filterTransactions;
}

filterType.addEventListener("input", () => {
  const filteredTransactions = renderFilterList(
    transactionsArr,
    filterType.value
  );
  renderTrackerList(filteredTransactions);
  calculateBalance(filteredTransactions);
});

function calculateBalance(data = transactionsArr) {
  let totalExpense = 0;
  let totalIncome = 0;
  data?.forEach((item) => {
    if (item.type === "expense") {
      totalExpense += item.amount;
    } else {
      totalIncome += item.amount;
    }
  });
  console.log(totalExpense, totalIncome);
  let totalBalance = totalIncome - totalExpense;

  balance.classList.remove("text-green-500", "text-red-500");

  if (totalBalance > 0) balance.classList.add("text-green-500");
  else if (totalBalance < 0) balance.classList.add("text-red-500");
  else balance.classList.add("text-gray-500");

  balance.innerText = `₹${totalBalance}`;
}

function addItem() {
  const id = new Date().getTime();
  const expenseDescValue = expenseDesc.value.trim();
  const expenseAmountValue = Number(expenseAmount.value.trim());
  let expenseTypeValue = expenseType.value;

  if (!expenseDescValue) return;
  if (expenseAmountValue <= 0 || isNaN(expenseAmountValue)) return;

  let transaction = {
    id,
    description: expenseDescValue,
    amount: expenseAmountValue,
    type: expenseTypeValue,
  };

  transactionsArr.push(transaction);

  saveToLocalStorage(transactionsArr);

  renderTrackerItem(transaction);
  calculateBalance();
}

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addItem();
  expenseDesc.value = "";
  expenseAmount.value = "";
  expenseType.value = "expense";
});

transactions.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const itemId = Number(e.target.closest(".transactionItem").dataset.id);

    console.log(itemId);

    const filterItems = transactionsArr.filter((item) => {
      return item.id !== itemId;
    });

    transactionsArr = filterItems;

    saveToLocalStorage(transactionsArr);
    renderTrackerList(transactionsArr);
    calculateBalance();
  }
});

getTransactionFromStorage();
renderTrackerList(transactionsArr);
calculateBalance(transactionsArr);

// ? ============================================================Kanban board
const taskTitle = document.getElementById("taskTitle");
const todoForm = document.getElementById("todoForm");
const kanban = document.getElementById("kanban");
const colTodo = document.getElementById("col-todo");
const colInprogress = document.getElementById("col-inprogress");
const colDone = document.getElementById("col-done");
const taskColumn = document.getElementById("taskColumn");
const todoCount = document.getElementById("todo-count");
const progressCount = document.getElementById("progress-count");
const doneCount = document.getElementById("done-count");
const columns = document.querySelectorAll("[data-column]");

let tasks = [];

function setLocalStorage(data) {
  localStorage.setItem("Tasks", JSON.stringify(data));
}

function getLocalStorage() {
  const getTaskFromStroage = JSON.parse(localStorage.getItem("Tasks"));
  if (getTaskFromStroage && getTaskFromStroage.length > 0) {
    tasks = getTaskFromStroage;
  }
}

function makeItemDraggable(item) {
  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "move";

    setTimeout(() => {
      item.style.display = "none";
    }, 0);
    console.log(item.id);
    console.log(e, e.dataTransfer);
  });
}

columns.forEach((col) => {
  col.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  col.addEventListener("drop", (e) => {
    e.preventDefault();
    let taskId = e.dataTransfer.getData("text/plain");
    const draggedEl = document.getElementById(taskId);
    const columnName = col.dataset.column;
    console.log(taskId);

    col.append(draggedEl);
    draggedEl.style.display = "block";

    tasks = tasks.map((item) => {
      if (Number(taskId) === item.id) {
        return { ...item, column: columnName };
      }
      return item;
    });

    renderTaskCount(tasks);
    setLocalStorage(tasks);
  });
});

function renderTask(data) {
  const taskEl = document.createElement("div");
  taskEl.id = data.id;
  taskEl.draggable = true;
  taskEl.className =
    "taskItem p-3 bg-white rounded-md shadow-sm border border-slate-100";
  taskEl.innerHTML = `<h4 class="font-medium text-sm">${data.taskTitle}</h4>`;

  const columnEl = document.querySelector(`[data-column=${data.column}]`);
  columnEl.insertAdjacentElement("beforeend", taskEl);

  makeItemDraggable(taskEl);
}

function renderTaskCount(data) {
  // let todoCountValue = 0;
  // let progressCountValue = 0;
  // let doneCountValue = 0;
  // data.forEach((item) => {
  //   if (colTodo.dataset.column === item.column) {
  //     todoCountValue++;
  //   }

  //   if (colInprogress.dataset.column === item.column) {
  //     progressCountValue++;
  //   }

  //   if (colDone.dataset.column === item.column) {
  //     doneCountValue++;
  //   }
  // });

  const todoCountValue = tasks.filter(
    (item) => colTodo.dataset.column === item.column
  ).length;
  const progressCountValue = tasks.filter(
    (item) => colInprogress.dataset.column === item.column
  ).length;
  const doneCountValue = tasks.filter(
    (item) => colDone.dataset.column === item.column
  ).length;

  todoCount.innerText = todoCountValue;
  progressCount.innerText = progressCountValue;
  doneCount.innerText = doneCountValue;
}

function renderTaskList(data) {
  data.forEach((item) => {
    renderTask(item);
  });
}

function addTask() {
  const taskTitleValue = taskTitle.value.trim();
  const taskColumnValue = taskColumn.value;
  const id = new Date().getTime();

  if (!taskTitleValue) return;

  const taskObj = {
    id: id,
    taskTitle: taskTitleValue,
    column: taskColumnValue,
  };

  tasks.push(taskObj);
  setLocalStorage(tasks);
  renderTask(taskObj);
  renderTaskCount(tasks);

  taskTitle.value = "";
  taskColumn.value = "todo";
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

getLocalStorage();
renderTaskList(tasks);
renderTaskCount(tasks);

// ?================================================notes app
const notesForm = document.getElementById("notesForm");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const notesList = document.getElementById("notesList");
const editNoteModal = document.getElementById("editNoteModal");
const closeEditModal = document.getElementById("closeEditModal");
const editNoteTitle = document.getElementById("editNoteTitle");
const editNoteForm = document.getElementById("editNoteForm");
const editNoteBody = document.getElementById("editNoteBody");
const cancelEdit = document.getElementById("cancelEdit");
const formWrp = document.querySelector(".formWrp");

let notes = [];

let isEditing = false;
let editId = null;

function saveNotesToStorage(data) {
  localStorage.setItem("NOTES", JSON.stringify(data));
}

function getNotesFromStorage() {
  const getNotes = JSON.parse(localStorage.getItem("NOTES"));

  if (getNotes && getNotes.length > 0) {
    notes = getNotes;
  }
}

function renderNote(data) {
  const noteItem = `<article id = "${data.id}"
                class="noteItem bg-slate-50 border border-slate-100 p-3 rounded-md"
              >
                <h4 class="note-title font-semibold text-sm">${data.title}</h4>
                <p class="note-body text-sm text-gray-600 mt-1">
                  ${data.body}
                </p>
                <div class="mt-2 flex items-center justify-between">
                  <small class="text-xs text-gray-400">2 days ago</small>
                  <div class="space-x-2">
                    <button 
                      class="editBtn text-xs px-2 py-1 bg-white border rounded text-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      class="deleteBtn text-xs px-2 py-1 bg-white border rounded text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>`;
  notesList.insertAdjacentHTML("beforeend", noteItem);
}

function renderNoteList(data) {
  data.forEach((i) => renderNote(i));
}

function addNote() {
  const id = new Date().getTime();
  const noteTitleValue = noteTitle.value.trim();
  const noteBodyValue = noteBody.value.trim();

  if (!noteTitleValue || !noteBodyValue) return;
  if (noteBodyValue.length < 10) {
    alert("Note body must be at least 10 characters long.");
    return;
  }

  const noteObj = {
    id,
    title: noteTitleValue,
    body: noteBodyValue,
  };

  notes.push(noteObj);
  saveNotesToStorage(notes);
  renderNote(noteObj);
  console.log(notes);
}

notesForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addNote();
  noteTitle.value = "";
  noteBody.value = "";
});

notesList.addEventListener("click", (e) => {
  const currentNote = e.target.closest(".noteItem");
  const currentId = Number(currentNote.id);
  const title = currentNote.querySelector(".note-title");
  const body = currentNote.querySelector(".note-body");

  if (e.target.classList.contains("editBtn")) {
    editNoteModal.classList.remove("hidden");
    editId = currentId;

    isEditing = true;
    editNoteTitle.value = title.innerText;
    editNoteBody.value = body.innerText;
  }

  if (e.target.classList.contains("deleteBtn")) {
    notes = notes.filter((item) => {
      if (item.id !== currentId) {
        return item;
      }
    });

    saveNotesToStorage(notes);
    currentNote.remove();
  }
});

function closeModal() {
  editNoteModal.classList.add("hidden");
  editNoteTitle.value = "";
  editNoteBody.value = "";
  isEditing = false;
  editId = null;
}

closeEditModal.addEventListener("click", closeModal);

editNoteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editNoteTitleValue = editNoteTitle.value.trim();
  const editNoteBodyValue = editNoteBody.value.trim();

  if (!editNoteTitleValue || !editNoteBodyValue) return;
  if (editNoteTitleValue.length < 10) {
    alert("Note body must be at least 10 characters long.");
    return;
  }

  notes = notes.map((item) => {
    if (isEditing && item.id === editId) {
      return { ...item, title: editNoteTitleValue, body: editNoteBodyValue };
    }
    return item;
  });

  saveNotesToStorage(notes);
  const editedNote = document.getElementById(editId);
  editedNote.querySelector(".note-title").innerText = editNoteTitleValue;
  editedNote.querySelector(".note-body").innerText = editNoteBodyValue;
  closeModal();
});

cancelEdit.addEventListener("click", closeModal);

editNoteModal.addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

getNotesFromStorage();
renderNoteList(notes);
