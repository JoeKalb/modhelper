let hangman = {
  "answer":"",
  "wordCount":0,
  "lettersCount":{}
}

const startBtn = document.getElementById("start")
const pauseBtn = document.getElementById("pause")
const stopBtn = document.getElementById("stop")

stopBtn.addEventListener('click', stopGame)
pauseBtn.addEventListener('click', pauseGame)
startBtn.addEventListener('click', startGame)

function stopGame(){
  console.log("game stopped")
}

function pauseGame(){
  console.log("game paused")
}

function startGame() {
  let wordOrigin = document.getElementById('wordInput').value.trim().toUpperCase();
  document.getElementById('title').innerHTML = wordOrigin;

  hangman.answer = wordOrigin;
  hangman.wordCount = wordOrigin.split(" ").length;

  wordOrigin.split("").forEach((el) => {
    if(/^[a-zA-Z]+$/.test(el))
      (hangman.lettersCount[el]) ? hangman.lettersCount[el] += 1 : hangman.lettersCount[el] = 1;
  });

  //  'My guesses are a and B'.match(/\b\w\b/gi) // looks for first single letter in a message
  sendHangmanInfo(hangman)
}

function sendHangmanInfo(info){
  browser.tabs.sendMessage(
    tab.id,
    {hangman: info}
  ).then(response => {
    console.log("Content Script Response: " + response.response)
  }).catch(console.log("Error with promise!"))
}
