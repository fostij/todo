// Знаходимо всі елементи на сторінці
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(task => renderTask(task));
}

checkEmptyList();


form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

// Функції

function addTask(e) {
  // Відміняємо відправку форми
  e.preventDefault();

  // Дістаємо значення з поля форми
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false
  }

  tasks.push(newTask);
  saveToLocalStorage();

  // Рендер задачі на сторінку
  renderTask(newTask);

  // Очищаємо поле ввода і повертаємо на нього фокус
  taskInput.value = '';
  taskInput.focus();
  checkEmptyList();

  // // Перевірка на наявність задач, якщо є то скриваємо заголовок список дел пуст
  // if (tasksList.children.length > 1) {
  //   emptyList.classList.add('none');
  // }
}

function deleteTask(e) {
  
  if(e.target.dataset.action !== 'delete') return;

   const parentNode = e.target.closest('.list-group-item');

   // Визначаємо id задачі
   const id = Number(parentNode.id);

  //  // Знаходимо індекс задачі в массиві
  //  const index = tasks.findIndex(task => task.id === id)

  //  // Видаляємо задачу із массива з задачами
  //  tasks.splice(index, 1)

  // Метод видалення елемента з массива через filter
  tasks = tasks.filter(task => task.id !== id);
  saveToLocalStorage();

   parentNode.remove();
   checkEmptyList();

  // if (tasksList.children.length === 1) {
  //    emptyList.classList.remove('none');
  // }
}

function doneTask(e) {
  // Перевіряємо чи клік був НЕ по кнопці
  if(e.target.dataset.action !== 'done') return;

  // Перевіряємо чи клік був по кнопці "Задача виконана"
    const elementDone = e.target.closest('.list-group-item');

    const id = Number(elementDone.id);
    const task = tasks.find(task => task.id === id)
    task.done = !task.done

    saveToLocalStorage();

    const taskTitle = elementDone.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

}

function checkEmptyList() {
  if(tasks.length === 0) {
    const emptyListElement = `
        <li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>
    `;

    tasksList.insertAdjacentHTML('afterbegin', emptyListElement);
  }

  if(tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }


}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // Формуємо розмітку нової задачі
    const taskHTML = `
      <li id = ${task.id} class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
			</li>`;
    // Добавляємо задачу на сторінку
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}