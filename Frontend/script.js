let userInput = document.querySelector("#word");
let guesses = document.querySelector("#guesses");
let buttons = document.querySelector("#buttons");
let letters = document.querySelectorAll(".row>div");
let keepPlayingButton = document.querySelector("#keepPlaying");
let giveUpButton = document.querySelector("#giveUp");
let isOver = false;
const url = "https://192.168.0.16:5001/Word";
let correctWordId = getWordsLength();
let response;
let wordsCount = 0;

getWordsLength().then((res) => {
    wordsCount = res;
    pickWord();
})

userInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        guess();
    }
})


// TODO: wyniki, wykres, srednia ilosc prob, animacje

function backspace() {
    userInput.value = userInput.value.slice(0, userInput.value.length - 1)
}

async function guess() {
    let userInputValue = userInput.value;

    let row = await createGuess(userInputValue);
    if (row) {
        row.className = "guess";
        guesses.appendChild(row);

        if (response == "ggggg") {
            isOver = true;
            giveUpButton.innerHTML = "NEW WORD";
            giveUpButton.setAttribute('onClick', 'pickWord()');
            showButtons();
            alert("You guessed right!");
            keepPlayingButton.disabled = true;
            //giveUpButton.onClick = pickWord();
        } else if (guesses.childElementCount == 6) {
            isOver = true;
            showButtons();
            alert("Game over!");
        }


    }
    userInput.value = "";
}

async function getWordsLength() {
    const res = await fetch(url + "/length");
    let data = await res.text();
    return JSON.parse(data)
}

async function pickWord() {
    clearGuesses();
    correctWordId = Math.floor(Math.random() * wordsCount);
    hideButtons();
    resetKeyboard();
    userInput.value = '';
    isOver = false;
    keepPlayingButton.disabled = false;
    giveUpButton.innerHTML = "GIVE UP";
    giveUpButton.setAttribute('onClick', 'showCorrectWord()');
}


async function createGuess(value) {
    const data = {
        "id": correctWordId,
        "value": value,
    };

    console.log(data);

    let row = document.createElement("div");

    response = await sendGuessRequest(data)

    if (response) {
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

            row.append(div);
        };

        return row;
    }
}

function clearGuesses() {
    let lastChild = guesses.lastElementChild;
    while (lastChild) {
        guesses.removeChild(lastChild);
        lastChild = guesses.lastElementChild;
    }
}

async function showCorrectWord() {
    fetch(url + '/' + correctWordId).then((result) => {
        result.text().then((word) => {
            alert(`The correct word was: ${word}`);
        })
    })
    pickWord();
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

async function sendGuessRequest(body) {
    const header = {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
            'Accept': "application/json, text/plain, */*",
            'Content-Type': "application/json;charset=utf-8"
        }
    };

    const res = await fetch(url, header);

    if (res.ok) {
        let data = await res.text();
        return data;
    } else {
        alert(await res.text());
    }
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