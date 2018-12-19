let chat = document.getElementsByClassName("chat-list__lines tw-flex-grow-1 scrollable-area")[0];
let textArea = document.getElementsByTagName("textarea")[0];

let messages = [];
let currentMessage = "";
function startListening(){
  chat.addEventListener("DOMNodeInserted", chatListen, false);
}

function chatListen(event){
  message = event.srcElement.innerText.split(':', 2);
    messages.push({
      "username": message[0],
      "message": message[1].trim()
    });
    changeTextArea(message[1].trim());
}

function stopListening(){
  chat.removeEventListener("DOMNodeInserted", chatListen, false);
}

let mainPort = browser.runtime.connect({name: "main.js"})
let connected = false;
// set timer to try a reconnect, 2 seconds at first
setInterval(tryConnect(), 2000);

function tryConnect(){
  if(!connected)
    mainPort.postMessage({greeting: "PING"})
}

function changeTextArea(input){
  currentMessage = textArea.value;
  textArea.value = input;
  mainPort.postMessage({greeting: input})
}

mainPort.onMessage.addListener(m => {
  console.log(m.greeting)
  if(m.greeting == "hangman")
    hangman.start(m.hangman)
  else if(m.greeting == "PONG")
    connected = true;
  else if(m.greeting == "pause")
    hangman.pauseToggle()
  else if(m.greeting == "clear")
    hangman.clearGame()
});

function newWordSetting(word){
  let result = word.replace(/[A-Z]/g, '-')
  return result
}
let hangman = {
  info:{},
  found: false,
  pause: false,
  winner: "",
  display: "",
  guessed: {},
  start: function(newInfo){
    info = newInfo
    console.log(info)
    display = newWordSetting(newInfo.answer)
    console.log(display)
    startListening();
  },
  pauseToggle: function(){
    console.log("Pause Toggle")
    (pause) ? pause = false : pause = true;
    (pause) ? 
      console.log("Game Paused") : 
      console.log("Game Unpaused");
  },
  clearGame: function(){
    console.log("Clearing Game Data")
    info, guessed = {}
    found, pause = false
    winner, current = ""
    stopListening();
  }
}
