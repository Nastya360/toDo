const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => {
    renderTask(task);
  });
}



checkEmptyList();
//добавление задачи
form.addEventListener("submit", addTask);

//удаление задачи
tasksList.addEventListener("click", deleteTask);

//отмечаем задачу выполненной
tasksList.addEventListener("click", doneTask);
//часть нерекомендуемого метода сохнанения данных (храниться вся разметка в LS)
// if (localStorage.getItem('tasksHTML')){
//     tasksList.innerHTML = localStorage.getItem('tasksHTML');
// }

function addTask(event) {
  event.preventDefault();

  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  saveToLocalStorage();

  renderTask(newTask);

  taskInput.value = "";
  taskInput.focus();
  checkEmptyList();
  // saveHTMLtoLS();
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") {
    return;
  }

  const parenNode = event.target.closest(".list-group-item");

  //определим id задачи

  const id = Number(parenNode.id);

  //находим индекс задачи в массиве
  const index = tasks.findIndex(function (task) {
    if (task.id === id) {
      return true;
    }
  });

  //удаляем задачу из массива задач
  tasks.splice(index, 1);

  saveToLocalStorage();

  parenNode.remove();
  checkEmptyList();

  //saveHTMLtoLS();
}

function doneTask(event) {
  if (event.target.dataset.action === "done") {
    const parenNode = event.target.closest(".list-group-item");

    const id = Number(parenNode.id);

    const task = tasks.find(function (task) {
      if (task.id === id) {
        return true;
      }
    });
    //меняем значение ключа done из обьекта на противоположный
    task.done = !task.done;

    saveToLocalStorage();
    const taskTitle = parenNode.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done");
  }
  //saveHTMLtoLS();
}
//не рекомендуемы метод сохранения данных
// function saveHTMLtoLS() {
//   localStorage.setItem("tasksHTML", tasksList.innerHTML);
// }

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  const taskHTML = `<li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
  </li`;
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
