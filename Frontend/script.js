let modal = document.querySelector("#myModal");
let modalButton = document.querySelector("#btnModal");
let userInput = document.querySelector("#word");
let guesses = document.querySelector("#guesses");
let buttons = document.querySelector("#buttons");
let letters = document.querySelectorAll(".letter");
let keepPlayingButton = document.querySelector("#keepPlaying");
let giveUpButton = document.querySelector("#giveUp");
let alertPopup = document.querySelector(".alert");
let alertSpan = document.querySelector(".alertSpan");
const url = "https://192.168.0.16:5001/Word";
let correctWordId = getWordsLength();
let response;
let wordsCount = 0;
let isRanked = true;

let stats = getLocalStorageValue('stats');

if (!stats) {
    setLocalStorageValue('stats', JSON.stringify({
        'wins': 0,
        'games': 1,
        'guesses': {
            1:0,
            2:0,
            3:0,
            4:0,
            5:0,
            6:0,
        },
    }));

    stats = getLocalStorageValue('stats');
}


document.querySelector("#games").innerHTML = stats.games;
document.querySelector("#wins").innerHTML = stats.wins;
document.querySelector("#winratio").innerHTML = Math.round(stats.wins / stats.games * 100) + '%';

getWordsLength().then((res) => {
    wordsCount = res;
    pickWord();
})

userInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        guess();
    }
})

for (i = 0; i < letters.length; i++) {
    letters[i].addEventListener('click', (e) => {
        userInput.value += e.target.innerHTML;
    })
}

modalButton.onclick = () => {
    modal.style.display = "block";
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function backspace() {
    userInput.value = userInput.value.slice(0, userInput.value.length - 1)
}

async function guess() {
    let userInputValue = userInput.value;

    if (guesses.childNodes.length < 6) {
        row = await createGuess(userInputValue);
        if (row) {
            row.className = "guess";
            guesses.appendChild(row);
            alertPopup.classList.remove('slide-in');

            if (response == "ggggg") {
                giveUpButton.innerHTML = "NEW WORD";
                giveUpButton.setAttribute('onClick', 'location.reload();');
                showButtons();
                keepPlayingButton.disabled = true;
                let stats = getLocalStorageValue('stats');
                if (isRanked) stats.wins += 1;
                stats.guesses[guesses.childNodes.length] += 1;
                setLocalStorageValue('stats', JSON.stringify(stats))
                alertSpan.innerHTML = "YOU WON";
                alertPopup.classList.add('slide-in');
            } else if (guesses.childElementCount == 6) {
                showButtons();
                alertSpan.innerHTML = "GAME OVER";
                alertPopup.classList.add('slide-in');
            }


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
    let stats = getLocalStorageValue('stats');
    stats.games += 1;
    setLocalStorageValue('stats', JSON.stringify(stats));
    clearGuesses();
    correctWordId = Math.floor(Math.random() * wordsCount);
    hideButtons();
    resetKeyboard();
    userInput.value = '';
    keepPlayingButton.disabled = false;
    giveUpButton.innerHTML = "GIVE UP";
    giveUpButton.setAttribute('onClick', 'showCorrectWord()');
}


async function createGuess(value) {
    const data = {
        "id": correctWordId,
        "value": value,
    };

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
    alertPopup.classList.remove('slide-in');
    fetch(url + '/' + correctWordId).then((result) => {
        result.text().then((word) => {
            alertSpan.innerHTML = `THE ANSWER WAS: ${word.toUpperCase()}`;
            alertPopup.classList.add('slide-in');
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
    isRanked = false;
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
        let text = await res.text();
        alertPopup.classList.remove('slide-in');
        alertSpan.innerHTML = text;
        alertPopup.classList.add('slide-in');
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

function getLocalStorageValue(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setLocalStorageValue(key, value) {
    localStorage.setItem(key, value);
}
