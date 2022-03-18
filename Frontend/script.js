let userInput = document.querySelector("#word");
let guesses = document.querySelector("#guesses");
let buttons = document.querySelector("#buttons");
let letters = document.querySelectorAll("span");
let keepPlayingButton = document.querySelector("#keepPlaying");
let isOver = false;
const url = "https://localhost:5001/Word";
let wordsCount = 0;
let correctWordId = 0;
let response = "";

pickWord();

// TODO: klikalne guziki, API, wyniki, wykres, srednia ilosc prob, animacje jakies moze XD

function guess() {

    if (event.key === 'Enter' && !isOver) {
        if (!validate()) {
            alert("Wrong input!");
        } else {
            let value = userInput.value;

            let cont = createGuess(value);
            cont.className = "cont";

            guesses.appendChild(cont);
        }

        if (response == "ggggg") {
            isOver = true;
            showButtons();
            alert("You guessed right!");
            keepPlayingButton.disabled = true;
        } else if (guesses.childElementCount == 6) {
            isOver = true;
            showButtons();
            alert("Game over!");
        }

        userInput.value = "";
    }
}


function createGuess(value) {
    const data = {
        id: correctWordId,
        value: value,
    };

    console.log(data);

    fetch(url,
        {
            body: data,
            method: "POST",
            headers: {
                contentType: "application/json;charset=utf-8"
            }
        })
        .then(res => { console.log(res) })
        .catch(error => console.log(error));

    let cont = document.createElement("div");

    for (let i = 0; i < 5; i++) {
        let div = document.createElement("div");
        div.className = "letter";
        div.innerHTML = value[i].toUpperCase();

        if (value[i] == 'g') {
            div.style.background = "#47a347";
            checkKeyboard(value, "#47a347");
        } else if (value[i] == 'c') {
            div.style.background = "#b5914f";
            checkKeyboard(value, "#47a347");
        } else {
            div.style.background = "rgba(47, 49, 54)";
            checkKeyboard(value, "rgb(10, 10, 10)");
        }

        cont.append(div);
    }

    return cont;
}


function clearGuesses() {
    let lastChild = guesses.lastElementChild;
    while (lastChild) {
        guesses.removeChild(lastChild);
        lastChild = guesses.lastElementChild;
    }
}

function hideButtons() {
    buttons.style.visibility = "hidden";
}

function showButtons() {
    buttons.style.visibility = "visible";
}

function keepPlaying() {
    let lastChild = guesses.lastElementChild;
    clearGuesses();
    guesses.append(lastChild);
    hideButtons();
    isOver = false;
}

async function getWordsLength() {
    const response = await fetch(url + "/length");
    const data = await response.json();
    return JSON.parse(data);
}

function pickWord() {
    clearGuesses();
    wordsCount = getWordsLength();
    correctWordId = Math.floor(Math.random() * wordsCount);
    hideButtons();
    resetKeyboard();
    userInput.value = '';
    isOver = false;
    keepPlayingButton.disabled = false;
}

function validate() {
    return !/[^a-zA-Z]/.test(userInput.value) && userInput.value.length == 5;
}

function checkKeyboard(value, color) {
    for (let letter of letters) {
        if (letter.innerHTML == value.toUpperCase()) {
            letter.style.backgroundColor = color;
        }
    }
}

function resetKeyboard() {
    for (let letter of letters) {
        letter.style.backgroundColor = "rgba(47, 49, 54)";
    }
}

function clickOnLetter(e) {
    userInput.value += e.innerHTML;
}