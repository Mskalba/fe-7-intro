/** Globalne zmienne odnoszące się do listy do której wrzucamy elementy,
 *  inputa z nazwą nowego zadania oraz inputa z kolorem nowo dodawanego zadania
 * */ 
var $list, $addTaskInput, $addTaskColor;

/**
 * URL serwera z którego będziemy pobierać todosy oraz wysyłać nowe i z którego todosy będziemy usuwać
 */
const BASE_URL = 'http://195.181.210.249:3000/todo/';

/**
 * Główna funkcja naszego kodu, od niej zacznie się działanie naszego skryptu (nie licząc utworzenia zmiennych z linii 4 i 9)
 */
function main() {
    /**
     * Wywolanie 5 utworzonych przez nas funkcji
     */
    errorHandling();
    prepareDOMElements();
    prepareDOMEvents();
    getTodos();
    asyncAwaitGetTodos();
}

/**
 * Funkcja pobierająca wszystkie todosy z serwera, nie wymaga zadnych parametrów
 */
function getTodos() {
    /**
     * Przy pomocy axiosa, czyli klienta opartego na promisach do komunikacji z serwerami,
     * pobieramy uywając metody get wszystkie elementy z urla BASE_URL
     * funkcja axios.get zwraca nam Promise z odpowiedzią z serwera
     */
    axios.get(BASE_URL)
        /**
         * Przy uyciu konsumera then oczekujemy na odpowiedź i wykonaniu promisy utworzonej w funkcji axios.get
         * Następnie dla danych zawartych wewnątrz odpowiedzi wywołujemy funkcję prepareInitialList
         */
        .then(res => {
            prepareInitialList(res.data);
        })
        /**
         * W przypadku potencjalnego błędu po stronie serwera wyłapujemy go i wyświetlamy informacje do konsoli
         */
        .catch(err => {
            console.log('zlapalem blad w promisie');
        });
}

/**
 * Funkcja ukazująca sposób samodzielnego rzucania błędami w języku JavaScript oraz sposobie ich przechwytywania
 */
function errorHandling() {
    /**
     * Try { .... } catch(error) {.... } 
     * to blok kodu pozwalający Nam na przechwycenie błędów z kodu znajdującego się po "try"
     * i obsłudze ich w kodzie znajdującym się wewnątrz bloku catch
     */
    try {
        throw new Error('maciek')
    } catch(error) {
        if(error.message === 'maciek') {
        }
        console.error(error);
    }
}

/**
 *
 * Funkcja pobierająca wszystkie todosy z serwera, nie wymaga zadnych parametrów, zamiast zwykłego api promisowego
 * korzystamy tutaj z dobrodziejstw ES8 czyli struktury Async/ await
 * Funkcja zawiera równiez obsluge bledu tak samo jak jest to zrobione w funkcji getTodos
 * 
 * Oznaczamy funkcje jako async, aby zwrocila promise oraz abyśmy mogli skorzystac z await
 */
async function asyncAwaitGetTodos() {
    try {
        /**
         * oczekujemy przy uzyciu slowka kluczowego await na wykonanie sie dzialania asynchronicznego jakim jest pobranie danych z serwera
         */
        var result = await axios.get(BASE_URL);
        /**
         * kiedy juz dane sie pobiora wywolujemy dla nich funkcje prepareInitialList
         */
        prepareInitialList(result.data);
    } catch(error) {
        /**
         * Obsluga bledu serwera w przypadku async await wygląda tak samo jak w przypadku standardowego kodu synchronicznego
         */
        console.log('zlapalem blad w async/await');
    }
}

/**
 * Funkcja która wymaga od nas 1 argumentu, argumentem musi być tablica, dla kadego elementu wywołujemy funkcję addElementToList
 */
function prepareInitialList(elements) {
    /**
     * Aby przeiterować po kadym elemencie przekazanej tablicy korzystamy z funkcji tablicowej forEach
     */
    elements.forEach(element => {
        /**
         * wywolanie funkcji addElementToList z 2 argumentami:
         * $list to nasza zmienna globalna, która przechowuje referencje do elementu "ul" w nasyzm kodzie HTML
         * element to aktualnie przetwarzany w pętli element 
         */
        addElementToList($list, element);
    });
}

/**
 * Funkcja inicjująca globalne zmienne odnoszące się do elementów drzewa DOM
 */
function prepareDOMElements() {
    /**
     * znalezienie elementu przy pomocy htmlowe idka
     */
    $list = document.getElementById('people-list');
    $addTaskInput = document.getElementById('add-people-value');
    $addTaskColor = document.getElementById('element-color');
}

/**
 * Funkcja inicjująca wszystkie event listenery na stronie, będziemy oczekiwać jedynie na kliknięcie wewnątrz naszej listy
 * oraz kliknięcie przycisku add, który to będzie dodawał nowe elementy
 */
function prepareDOMEvents() {
    /**
     * znalezienie elementu przy pomocy htmlowe idka
     * nie deklarujemy zmiennej addButton jako globalnej jako, ze skorzystamy z niej tylko raz przy nalozeniu listenera na ten przycisk
     * pozniej nie bedzie Nam juz potrzebny ze zmiennych globalnych bedziemy korzystac czesciej (z inputow przy kazdym dodaniu nowych elementow)
     * z listy przy kazdym dodaniu nowego elementu oraz przy inicjalnym zaladowaniu elementow
     */
    var addButton = document.getElementById('add');
    /**
     * Nalozenie 2 listenerow o typie click i handlerze w postaci funkcji
     * Na elemencie addButton nasluchujemy na klikniecie uzytkownika i jezeli wystapi to wywolujemy funkcje addButtonHandler, 
     * podobnie sytuacja ma sie z listenerem na elemencie $list
     */
    addButton.addEventListener('click', addButtonHandler);
    $list.addEventListener('click', listClickHandler);
}

/**
 * Funkcja bedaca handlerem klikniecia na przycisk dodawania kolejnego todosa
 */
function addButtonHandler() {
    /**
     * przy pomocy axiosa wysylamy call "POST" z danymi nowego todosa
     */
    axios.post(BASE_URL, {
        /**
         * Wysylamy title i extra, wartosci naszego inputu z tytulem todosa oraz input z kolorem nowego todosa w polu extra
         */
        title: $addTaskInput.value,
        extra: $addTaskColor.value,
    }).then(() => {
        /**
         * Po udanej wysylce, jezeli promise zwrocony z funkcji axios.post zakonczyl sie sukcesem czyscimy cala liste i od nowa
         * pobieramy wszystkie todosy z serwera (dzieki temu pobieramy rowniez juz ten nowy utworzony todos)
         */
        $list.innerHTML = '';
        getTodos();
    })
}

/**
 * Funckja bedaca handlerem klikniecia w liste z elementami
 * przyjmuje jeden argument, ktory jest obiektem event, czyli obiektem stworoznym przez silnik JS w przegladarce, ktory
 * przechowuje w sobie wszystkie informacje na temat zdarzenia ktore wystapilo w naszym przypadku na temat klikniecia w nasza liste
 */
function listClickHandler(event) {
    /**
     * Sprawdzamy jaki dokladnie element zostal klikniety, chcemy wylapac jedynie klikniecia w przyciski, inne klikniecia w liste 
     * nas nie interesuja
     */
    if(event.target.tagName != "BUTTON") {
        /**
         * pusty return po prostu konczy dzialanie funkcji
         */
        return;
    }

    /**
     * jezeli klikniety element jest przyciskiem to wywolujemy funkcje deleteElement, gdyz wiemy, ze jedyny przycisk w naszej liscie odpowiada
     * wlasnie za usuwanie todosow, przekazujemy id elementu do usuniecia, ktory byl przechowywany wewnatrz datasetu wewnatrz hTMLa
     */
    deleteElement(event.target.dataset.taskId);
}

/**
 * Funckja usuwajaca element z serwera i z listy, otrzymuje id elementu
 */
function deleteElement(elementId) {
    /**
     * za pomoca axiosa wysylamy informacje o usunieciu danego elementu robimy to poprzez utworzenie urla zlozonego z urla podstawowego
     * bedace nasz zmienna globalna oraz idka elementu do usuniecia np. wysylka axios.delete pod adres:
     * 'http://195.181.210.249:3000/todo/93' usunie z serwera element o id 93
     */
    axios.delete(BASE_URL + elementId);
    /**
     * usuwamy rowniez dany element z naszej strony, znajdujemy go za pomoca jego Idka i wywolujemy funkcje remove, 
     * ktora usunie go z drzewa DOM
     */
    document.getElementById(elementId).remove();
}

/**
 * Funkcja dodajaca elementy do listy, wymaga od nas 2 argumentow
 * $listWhereToAdd to element drzewa DOM do ktorego powinnismy dorzucac elementy
 * todo to obiekt z elementem ktory dodajemy
 */
function addElementToList($listWhereAdd, todo) {
    /**
     * tworzymy element, ktory bedziemy chcieli dorzucic do podanej listy
     */
    var createdElement = createListElement(todo);
    /**
     * dorzucamy utworzony element do listy
     */
    $listWhereAdd.appendChild(createdElement);
}

/**
 * Funckja tworzaca nowe elementy html
 * przyjmuje 1 parametr:
 * todo- obiekt z ktorego utworzony konkretny element HTML
 */
function createListElement(todo) {
    /**
     * Tworzymy nowy element li, czyli to jest to samo co:   <li></li>
     */
    var newListElement = document.createElement('li');

    /**
     * Tutaj pokazany sposób na realizacje naszego zadania przy pomocy starszej funkcji Object.keys
     * oraz sposob pracy przy uzyciu funkcji Object.values
     */
    /* var keysFromTodo = Object.keys(todo); 
            
            Object.keys(todo) zwroci Nam wszystkie klucze ktore znajduja sie obiekcie
    */
    /* var elementsFromTodo = keysFromTodo.map(key => todo[key]);  
    
            tutaj mapujemy kazdy z kluczy obiektow na wartosc tego obiektu, zanim pojawila sie funkcja Object.values, byl to jedyny
            sposob na dobranie sie do wszystkich wartosci wewnatrz obiektu
    */
    /* var elementsFromTodoNewValues = Object.values(todo);

            Przy pomocy funktion values mozemy 2 powyzsze linie zapisac w 1
    */

    
    /* var elementsWithoutNull = elementsFromTodo.filter(el => el != null);

            Filtrowanie elementow, ktore są nullami

     newListElement.textContent = elementsWithoutNull.join();

        zlaczenie calej tablicy i wrzicenie jej do naszego nowo utworzonego elementu w postaci tekstu
    */

    /**
     * Przy pomocy object.entries tworzymy sobie tablice tablic o takiej strukturze:
     * [
     *  [key, value],
     *  [key2, value2],
     *   ....
     * ]
     * Czyli utworzeniu latwych do operowania par klucz- wartosc
     */
    var keysWithValuesArray = Object.entries(todo);
    /**
     * filtrujemy tylko te pary klucz- wartosc, ktorych wartosc el[1] nie jest nullem
     */
    var keysWithValuesArrayWithoutNulls = keysWithValuesArray.filter(el => el[1] != null);
    /**
     * przemapowanie kazdej pary klucz wartosc na string: "klucz: wartosc"
     */
    var keysJoinedWithValuesArray = keysWithValuesArrayWithoutNulls.map(el => el[0] + ': ' + el[1]);

    /**
     * zapisanie powyzszych 3 lini oraz funkcji join w 1 za pomoca lancuchowego wywolywania funkcji
     */
    var valueToShow = Object.entries(todo).filter(el => el[1] != null).map(el => el[0] + ': ' + el[1]).join(', ');

    /**
     * Dorzucenie stworzonego napisu jako text do nowo tworzonego elementu HTML
     */
    // newListElement.textContent = keysJoinedWithValuesArray.join('  ');
    newListElement.textContent = valueToShow;
    /**
     * Nadanie koloru naszemu elementowu
     */
    newListElement.style.color = todo.extra;
    /**
     * Nadanie idka naszemu elementowi
     */
    newListElement.id = todo.id;


    /**
     * Utworzenie przycisku do usuwania naszego elementu
     */
    var deleteButton = document.createElement('button');
    /**
     * dodanie napisu do naszego przycsiku
     */
    deleteButton.textContent = 'delete';
    /**
     * dodanie do datasetu idka naszego nowo dodawanego elementu w celu latwje identyfikacji w momencie proby usuwania
     */
    deleteButton.dataset.taskId = todo.id;
    /**
     * dodanie przycisku delete do naszego elementu html
     */
    newListElement.appendChild(deleteButton);

    /**
     * Zwrocenie naszego elementu z funkcji
     */
    return newListElement;
}


/**
 * Nalozenie pierwszego listenera, ktory rozpocznie dzialanie naszego skryptu. 
 * Funkcja main zostanie odpalona dopiero wtedy kiedy wystapi typ zdarzenia DOMContentLoaded czyli caly HTML zostanie zaladowany
 */
document.addEventListener('DOMContentLoaded', main);