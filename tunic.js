/*
vowels follow 
v1  / \ v2
v3 |
v4  \ / v5

consonants follow 
    c2 
c1 \ | / c3
 
c4 / | \ c6
    c5
*/

// masks
let v1 = 0b000000000001;
let v2 = 0b000000000010;
let v3 = 0b000000000100;
let v4 = 0b000000001000;
let v5 = 0b000000010000;
let c1 = 0b000000100000;
let c2 = 0b000001000000;
let c3 = 0b000010000000;
let c4 = 0b000100000000;
let c5 = 0b001000000000;
let c6 = 0b010000000000;
let couille = 0b100000000000;
let vowelMask = 0b000000011111;
let consonantMask = 0b011111100000;

let charMap = {};

document.addEventListener("DOMContentLoaded", function () {
    initializer();
});

function createTableFromDict(dict) {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let phoneticRow = document.createElement("tr");
    let inglisheRow = document.createElement("tr");

    let headerRow = document.createElement("tr");
    for (let key in dict) {
        let th = document.createElement("th");
        th.innerHTML = tunicRepr(key);
        headerRow.appendChild(th);

        let phoneticCell = document.createElement("td");
        phoneticCell.innerText = charBitRepr(key, "phonetic");
        phoneticRow.appendChild(phoneticCell);

        let inglisheCell = document.createElement("td");
        inglisheCell.innerText = charBitRepr(key, "inglishe");
        inglisheRow.appendChild(inglisheCell);
    }

    thead.appendChild(headerRow);
    tbody.appendChild(phoneticRow);
    tbody.appendChild(inglisheRow);
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function filterDictByRule(dict, rule) {
    let filteredDict = {};

    for (let key in dict) {
        if (rule(key)) {
            filteredDict[key] = dict[key];
        }
    }

    return filteredDict;
}

function updateCharMapEditor() {
    let vowelDict = filterDictByRule(charMap, (key) => (key & vowelMask) != 0);
    let vowelTable = createTableFromDict(vowelDict);
    let consonantDict = filterDictByRule(
        charMap,
        (key) => (key & consonantMask) != 0
    );
    let consonantTable = createTableFromDict(consonantDict);

    document.getElementById("vowelMapContainer").innerHTML = "";
    document.getElementById("consonantMapContainer").innerHTML = "";
    document.getElementById("vowelMapContainer").appendChild(vowelTable);
    document
        .getElementById("consonantMapContainer")
        .appendChild(consonantTable);
}

function initializer() {
    rebuildScreen();
    console.log("Its transcribing time !");
}

var currentChar = 0;

var sentence = [];

var tunicSentence = "";
var phoneticSentence = "";
var inglisheSentence = "";

function applyLine(charBar, mask) {
    currentChar ^= mask;

    updateUI();

    charBar.classList.toggle("activeBar");
}

function rebuildScreen() {
    updateCharMapEditor();
    recomputeSentences();
    updateUI();
}

function updateUI() {
    document.getElementById("phoneticPreview").textContent = `/${phoneticRepr(
        currentChar
    )}/`;
    document.getElementById("inglishePreview").textContent = `${inglisheRepr(
        currentChar
    )}`;
    document.getElementById("tunicSentence").innerHTML = tunicSentence;
    document.getElementById("phoneticSentence").textContent = phoneticSentence;
    document.getElementById("inglisheSentence").textContent = inglisheSentence;
}

function addCharToSentence(char) {
    sentence.push(char);
    recomputeSentences();
    updateUI();
}

function removeLastChar() {
    sentence.pop();
    recomputeSentences();
    updateUI();
}

function phoneticRepr(char) {
    let vowel = char & vowelMask;
    let consonant = char & consonantMask;
    let hasReversedOrdering = (char & couille) == couille;

    var phoneticRepresentation = "";

    if (hasReversedOrdering) {
        phoneticRepresentation += charBitRepr(vowel, "phonetic");
        phoneticRepresentation += charBitRepr(consonant, "phonetic");
    } else {
        phoneticRepresentation += charBitRepr(consonant, "phonetic");
        phoneticRepresentation += charBitRepr(vowel, "phonetic");
    }

    return phoneticRepresentation;
}

function inglisheRepr(char) {
    let vowel = char & vowelMask;
    let consonant = char & consonantMask;
    let hasReversedOrdering = (char & couille) == couille;

    var inglisheRepresentation = "";

    if (hasReversedOrdering) {
        inglisheRepresentation += charBitRepr(vowel, "inglishe");
        inglisheRepresentation += charBitRepr(consonant, "inglishe");
    } else {
        inglisheRepresentation += charBitRepr(consonant, "inglishe");
        inglisheRepresentation += charBitRepr(vowel, "inglishe");
    }

    return inglisheRepresentation;
}

function tunicRepr(char) {
    let symbol = `
        <div class="charContainer_small">
                ${char & v1 ? `<div class="charBar_small v1"></div>` : ""}
                ${char & v2 ? `<div class="charBar_small v2"></div>` : ""}
                ${char & v3 ? `<div class="charBar_small v3"></div>` : ""}
                ${char & v4 ? `<div class="charBar_small v4"></div>` : ""}
                ${char & v5 ? `<div class="charBar_small v5"></div>` : ""}
                ${char & c1 ? `<div class="charBar_small c1"></div>` : ""}
                ${char & c2 ? `<div class="charBar_small c2"></div>` : ""}
                ${char & c3 ? `<div class="charBar_small c3"></div>` : ""}
                ${char & c4 ? `<div class="charBar_small c4"></div>` : ""}
                ${char & c5 ? `<div class="charBar_small c5"></div>` : ""}
                ${char & c6 ? `<div class="charBar_small c6"></div>` : ""}
                ${char & couille ? `<div class="couille_small"></div>` : ""}
        </div>
`;
    return symbol;
}

function charBitRepr(index, dict) {
    let char = charMap[index];
    if (char == undefined) {
        return "";
    }

    return char[dict];
}

function recomputeSentences() {
    phoneticSentence = "";
    inglisheSentence = "";
    tunicSentence = "";

    for (let char of sentence) {
        phoneticSentence += phoneticRepr(char);
        inglisheSentence += inglisheRepr(char);
        tunicSentence += tunicRepr(char);
    }
}

function addCurrentCharToSentence() {
    addCharToSentence(currentChar);
}

function addSpaceToSentence() {
    addCharToSentence(0);
}

function handleKeyDown(event) {
    if (event.key === "Enter") {
        handleEnter();
    } else if (event.key === "Backspace") {
        handleBackspace();
    } else if (event.key === " ") {
        handleSpace();
    } else if (event.key === "7") {
        handleSeven();
    } else if (event.key === "8") {
        handleEight();
    } else if (event.key === "9") {
        handleNine();
    } else if (event.key === "4") {
        handleFour();
    } else if (event.key === "5") {
        handleFive();
    } else if (event.key === "6") {
        handleSix();
    } else if (event.key === "+") {
        handlePlus();
    } else if (event.key === "1") {
        handleOne();
    } else if (event.key === "2") {
        handleTwo();
    } else if (event.key === "3") {
        handleThree();
    } else if (event.key === "0") {
        handleZero();
    } else if (event.key === ".") {
        handleComma();
    }
}

function handleEnter() {
    addCurrentCharToSentence();
}

function handleBackspace() {
    removeLastChar();
}

function handleSpace() {
    addSpaceToSentence();
}

function handleSeven() {
    applyLine(document.getElementById("v1"), v1);
}

function handleEight() {
    applyLine(document.getElementById("couille"), couille);
}

function handleNine() {
    applyLine(document.getElementById("v2"), v2);
}

function handleFour() {
    applyLine(document.getElementById("c1"), c1);
}

function handleFive() {
    applyLine(document.getElementById("c2"), c2);
}

function handleSix() {
    applyLine(document.getElementById("c3"), c3);
}

function handlePlus() {
    applyLine(document.getElementById("v3"), v3);
}

function handleOne() {
    applyLine(document.getElementById("c4"), c4);
}

function handleTwo() {
    applyLine(document.getElementById("c5"), c5);
}

function handleThree() {
    applyLine(document.getElementById("c6"), c6);
}

function handleZero() {
    applyLine(document.getElementById("v4"), v4);
}

function handleComma() {
    applyLine(document.getElementById("v5"), v5);
}

document.addEventListener("keydown", handleKeyDown);

document.addEventListener("click", function () {
    if (
        document.activeElement !== document.body &&
        document.activeElement.tagName !== "INPUT"
    ) {
        console.log(document.activeElement);
        console.log(document.activeElement.tagName);
        document.activeElement.blur();
    }
});

function addEditVowel(phoneticInput, approxInput) {
    let phonetic = phoneticInput.trim().length != 0 ? phoneticInput : "?";
    let approx = approxInput.trim().length != 0 ? approxInput : "?";
    charMap[currentChar & vowelMask] = { phonetic: phonetic, inglishe: approx };
    rebuildScreen();
}

document
    .getElementById("addEditVowelBtn")
    .addEventListener("click", function () {
        let vowelPhonetic = document.getElementById("vowelPhonetic").value;
        let vowelApprox = document.getElementById("vowelApprox").value;

        addEditVowel(vowelPhonetic, vowelApprox);
    });

function addEditConsonant(phoneticInput, approxInput) {
    let phonetic = phoneticInput.trim().length != 0 ? phoneticInput : "?";
    let approx = approxInput.trim().length != 0 ? approxInput : "?";
    charMap[currentChar & consonantMask] = {
        phonetic: phonetic,
        inglishe: approx,
    };
    rebuildScreen();
}

document
    .getElementById("addEditConsonantBtn")
    .addEventListener("click", function () {
        let consonantPhonetic =
            document.getElementById("consonantPhonetic").value;
        let consonantApprox = document.getElementById("consonantApprox").value;

        addEditConsonant(consonantPhonetic, consonantApprox);
    });

function importCharMap() {
    const fileInput = document.getElementById("importFile");
    const file = fileInput.files[0];

    if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const json = event.target.result;
                const newCharMap = JSON.parse(json);
                charMap = newCharMap;
                updateCharMapEditor();
                recomputeSentences();
                updateUI();
                console.log("Successfully imported transcription mappings 🦊");
            } catch (error) {
                console.error(
                    "Error when loading transcription mappings:",
                    error
                );
            }
        };
        reader.readAsText(file);
    } else {
        console.error("Please choose a valid json file");
    }
}

function exportCharMap() {
    const blob = new Blob([JSON.stringify(charMap, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dictionnaire.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
