let userInput = document.querySelector("#word");
let guesses = document.querySelector("#guesses");
let buttons = document.querySelector("#buttons");
let letters = document.querySelectorAll("span");
let keepPlayingButton = document.querySelector("#keepPlaying");
let isOver = false;
const url = "https://localhost:5001/Word";
let correctWordId = 20;
let response;
let wordsCount = 0;

getWordsLength().then((res) => {
    wordsCount = res;
    pickWord();
})


// TODO: wyniki, wykres, srednia ilosc prob, animacje

async function guess() {

    if (event.key === 'Enter' && !isOver) {
        if (!validate()) {
            alert("Wrong input!");
        } else {
            let value = userInput.value;

            let cont = await createGuess(value);
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

async function getWordsLength() {
    const res = await fetch(url + "/length");
    let data = await res.text();
    return JSON.parse(data)
}

async function pickWord() {
    clearGuesses();
    correctWordId = Math.floor(Math.random() * wordsCount);
    console.log(correctWordId)
    hideButtons();
    resetKeyboard();
    userInput.value = '';
    isOver = false;
    keepPlayingButton.disabled = false;
}


async function createGuess(value) {
    const data = {
        "id": correctWordId,
        "value": value,
    };

    console.log(data);

    let cont = document.createElement("div");

    response = await makeGuess(data)

    for (let i = 0; i < 5; i++) {
        let div = document.createElement("div");
        div.className = "letter";
        div.innerHTML = value[i].toUpperCase();

        if (response[i] == 'g') {
            div.style.background = "#47a347";
            checkKeyboard(value[i], "#47a347");
        } else if (response[i] == 'c') {
            div.style.background = "#b5914f";
            checkKeyboard(value[i], "#47a347");
        } else {
            div.style.background = "rgba(47, 49, 54)";
            checkKeyboard(value[i], "rgb(10, 10, 10)");
        }

        cont.append(div);
    };

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

async function makeGuess(body) {
    const header = {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
            'Accept': "application/json, text/plain, */*",
            'Content-Type': "application/json;charset=utf-8"
        }
    };
    const res = await fetch(url, header);
    let data = await res.text();
    return data;
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