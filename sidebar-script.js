let hangman = {
  "answer":"",
  "wordCount":0,
  "lettersCount":{}
}

const wordDisplay = document.getElementById("title")
const input = document.getElementById("wordInput")

const startBtn = document.getElementById("start")
const pauseBtn = document.getElementById("pause")
const clearBtn = document.getElementById("clear")

clearBtn.addEventListener('click', clearGame)
pauseBtn.addEventListener('click', pauseGame)
startBtn.addEventListener('click', startGame)

function clearGame(){
  // this will clear all game info (resets everything)
  wordDisplay.innerHTML = "Word"
  input.value = ""
  pauseBtn.innerHTML = "PAUSE"
  sideBarPort.postMessage({greeting: "clear"})
  console.log("game cleared")
}

function pauseGame(){
  if (pauseBtn.innerHTML == "PAUSE"){
    console.log("pausing game")
    pauseBtn.innerHTML = "UNPAUSE"
  }
  else {
    console.log("unpausing game")
    pauseBtn.innerHTML = "PAUSE"
  }
  sideBarPort.postMessage({greeting: "pause"})
}

function startGame() {
  let wordOrigin = document.getElementById('wordInput').value.trim().toUpperCase();
  document.getElementById('title').innerHTML = wordOrigin;

  hangman.answer = wordOrigin;
  hangman.wordCount = wordOrigin.split(" ").length;

  wordOrigin.split("").forEach((el) => {
    if(/^[a-zA-Z]+$/.test(el))
      (hangman.lettersCount[el]) ? 
        hangman.lettersCount[el] += 1 : hangman.lettersCount[el] = 1;
  });

  //  'My guesses are a and B'.match(/\b\w\b/gi) 
  // looks for first single letter in a message
  sendHangmanInfo(hangman)
}

function sendHangmanInfo(info){
  sideBarPort.postMessage({
    greeting: "hangman",
    hangman: info
  })
}

const testBtn = document.getElementById("test")
let sideBarPort = browser.runtime.connect({name: "sidebar-script.js"})

testBtn.addEventListener('click', test)

function test(){
  console.log("Test sidebar")
  sideBarPort.postMessage({greeting: "testBtn"})
}

sideBarPort.postMessage({greeting: "PING"})

sideBarPort.onMessage.addListener(m => {
  console.log(m.greeting)
})
