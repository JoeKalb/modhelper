"use strict";

let chat = document.getElementsByClassName("chat-list__lines tw-flex-grow-1 scrollable-area")[0];
let textArea = document.getElementsByTagName("textarea")[0];
let twitchBtns = document.getElementsByTagName("button")
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
    let name = event.srcElement.getElementsByClassName("chat-line__username")[0].innerText;
    let message = event.srcElement.getElementsByClassName("text-fragment")[0].innerText;
    messages.push({
      "username": name,
      "message": message
    });
    console.log(name + ": " +message);
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
  setTimeout(chatBtn.click(), 1000);
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

    changeTextArea(this.display)
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
