var initialData = [
    {
        id: 1,
        title: 'Zrobić 1 event listener na cala listę',
        color: 'green'
    }, {
        id: 2,
        title: 'Pokazać chaining na array functions',
        color: 'blue'
    },
];
var nextId = 3;
var $list, $addTaskInput, $addTaskColor;

function main() {
    prepareDOMElements();
    prepareDOMEvents();
    prepareInitialList(initialData);
}

function prepareInitialList(elements) {
    elements.forEach(element => {
        addElementToList($list, element.title, element.color, element.id);
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
    addElementToList($list, $addTaskInput.value, $addTaskColor.value, nextId);
    nextId ++;
}

function listClickHandler(event) {
    if(event.target.tagName != "BUTTON") {
        return;
    }

    deleteElement(event.target.dataset.taskId);
}

function deleteElement(elementId) {
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