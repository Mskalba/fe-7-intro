var $list, $addTaskInput, $addTaskColor;
const BASE_URL = 'http://195.181.210.249:3000/todo/';

function main() {
    prepareDOMElements();
    prepareDOMEvents();
    getTodos();
}

function getTodos() {
    axios.get(BASE_URL)
        .then(res => {
            prepareInitialList(res.data);
        });
}

function prepareInitialList(elements) {
    elements.forEach(element => {
        addElementToList($list, element.title, element.extra, element.id);
    });
}

function prepareDOMElements() {
    $list = document.getElementById('people-list');
    $addTaskInput = document.getElementById('add-people-value');
    $addTaskColor = document.getElementById('element-color');
}

function prepareDOMEvents() {
    var addButton = document.getElementById('add');
    addButton.addEventListener('click', addButtonHandler);
    $list.addEventListener('click', listClickHandler);
}

function addButtonHandler() {
    axios.post(BASE_URL, {
        title: $addTaskInput.value,
        extra: $addTaskColor.value,
    }).then(() => {
        $list.innerHTML = '';
        getTodos();
    })
}

function listClickHandler(event) {
    if(event.target.tagName != "BUTTON") {
        return;
    }

    deleteElement(event.target.dataset.taskId);
}

function deleteElement(elementId) {
    axios.delete(BASE_URL + elementId);
    document.getElementById(elementId).remove();
}

function addElementToList($listWhereAdd, title, color, id) {
    var createdElement = createListElement(title, color, id);
    $listWhereAdd.appendChild(createdElement);
}

function createListElement(title, color, id) {
    var newListElement = document.createElement('li');
    newListElement.textContent = title;
    newListElement.style.color = color;
    newListElement.id = id;

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'delete';
    deleteButton.dataset.taskId = id;
    newListElement.appendChild(deleteButton);

    return newListElement;
}


document.addEventListener('DOMContentLoaded', main);