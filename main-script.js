

let chat = document.getElementsByClassName("chat-list__lines tw-flex-grow-1 scrollable-area")[0];
let textArea = document.getElementsByTagName("textarea")[0];
let twitchBtns = document.getElementsByClassName("tw-interactive tw-button")
let chatBtn = findChatButton(twitchBtns)

function findChatButton(btns){
  for(let i in btns){
    if(/>Chat</g.test(btns[i].innerHTML)){
      return btns[i];
    }
  }
  console.log("chatBtn not found")
  return -1;
}

let messages = [];
let currentMessage = "";
function startListening(){
  chat.addEventListener("DOMNodeInserted", chatListen, false);
}
/* 
// trying to swap to MutationObserver
let mutationConfig = { attributes: true, childList: true, subtree: true }
let callback = function(mutationList, observer){
  for(let mutation in mutationList){
    if(mutation.type == "childList"){
      console.log(mutation)
    }
  }
}
let observer = new MutationObserver(callback)
observer.observe(chat, mutationConfig)
*/
function chatListen(event){
  if(!hangman.getPause()){
    console.log("Now listening to chat")
    message = event.srcElement.innerText.split(':', 2);
    messages.push({
      "username": message[0],
      "message": message[1].trim()
    });
    changeTextArea(message[1].trim());
  }
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
  else if(m.greeting == "test")
    testMessage()
});

function testMessage(){
  changeTextArea("This is a test")
  chatBtn.click()
}

let hangman = {
  info:{},
  found: false,
  pause: false,
  winner: "",
  display: "",
  guessed: {},
  start: function(newInfo){
    this.info = newInfo
    this.display = newInfo.answer.replace(/[A-Z]/g, '-')
    startListening()
  },
  pauseToggle: function(){
    console.log("Pause Toggle Called")
    if(this.pause) {
      this.pause = false;
      console.log("Game is now unpaused")
    } else{
      this.pause = true;
      console.log("Game is now paused")
    }
  },
  getPause: function(){
    return this.pause
  },
  clearGame: function(){
    console.log("Clearing Game Data")
    this.info, this.guessed = {}
    this.found, this.pause = false
    this.winner, this.current = ""
    textArea.value = ""
  }
}
