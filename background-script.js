// this workds
let button = document.createElement("button");
const body = document.getElementsByTagName("body")[0];
button.innerHTML = "new button";
document.getElementsByTagName("body")[0].appendChild(button);

// this works now!
let title = document.getElementById("title");
title.innerHTML = "3";

console.log("hi kate") // very important part

let word = {
  "answer":"",
  "wordCount":0,
  "lettersCount":{}
};

function startGame() {
  let wordOrigin = document.getElementById('wordInput').value.trim().toUpperCase();
  document.getElementById('title').innerHTML = wordOrigin;

  word.answer = wordOrigin;
  word.wordCount = wordOrigin.split(" ").length;

  wordOrigin.split("").forEach((el) => {
    (word.lettersCount[el]) ? word.lettersCount[el] += 1 :
      word.lettersCount[el] = 1;
  });

  //  'My guesses are a and B'.match(/\b\w\b/gi) // looks for first single letter in a message
  console.log(word)
}
