var counter = 0;

function main() {
    var nameDiv = document.createElement('div')
    nameDiv.classList.add('people')
    nameDiv.innerText = 'Maciej z javascript';
    
    document.getElementsByTagName('body')[0].appendChild(nameDiv);

    var addButton = document.getElementById('add');
    addButton.innerText = 'Dodaj';

    addButton.addEventListener('click', addButtonHandler);
}

function addButtonHandler() {
    var counterElement = document.createElement('span');
    counterElement.innerText = counter;
    counter++;

    document.getElementsByTagName('body')[0].appendChild(counterElement);
}


document.addEventListener('DOMContentLoaded', main);