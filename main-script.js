"use strict";

let chat = document.getElementsByClassName("tw-flex-grow-1 tw-full-height tw-pd-b-1")[0];
let textArea = document.getElementsByTagName("textarea")[0];

let messages = [];
let currentMessage = "";

let name = "";
let message = "";
const observer = new MutationObserver(mutations =>{
  mutations.forEach(mutation =>{
    name = mutation.addedNodes[0].getElementsByClassName("chat-line__username")[0].innerText
    message = mutation.addedNodes[0].getElementsByClassName("text-fragment")[0].innerText.toUpperCase()
    console.log(name +": "+ message)
    // game logic goes here
  })
})

let mainPort = browser.runtime.connect({name: "main.js"})
let connected = false;
// set timer to try a reconnect, 10 seconds at first
setTimer(tryConnect(), 10000);

function tryConnect(){
  if(!connected)
    mainPort.postMessage({greeting: "PING"})
}

function changeTextArea(input){
  currentMessage = textArea.value;
  textArea.value = input;
  textArea.focus()
  textArea.dispatchEvent(ev);
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
    observer.observe(chat, {childList:true})

    changeTextArea(this.display)
  },
  pauseToggle: function(){
    console.log("Pause Toggle Called")
    if(this.pause) {
      this.pause = false
      console.log("Game is now unpaused")
    } else{
      this.pause = true
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
    observer.disconnect();
  },
  isNewGuess: function(letter){
    if(this.guessed[letter])
      return false
    this.guessed[letter] = this.info.answer.includes(letter)
    return true
  }
}


textArea.onkeydown = function(e) {
  if (e.key == "Enter") {
    console.log('enter key pressed');
  }
  e.preventDefault();
};

const ev = new KeyboardEvent('keydown', {altKey:false,
  bubbles: true,
  cancelBubble: false, 
  cancelable: false,
  charCode: 0,
  code: "Enter",
  composed: true,
  ctrlKey: false,
  currentTarget: null,
  defaultPrevented: true,
  detail: 0,
  eventPhase: 0,
  isComposing: false,
  isTrusted: true,
  key: "Enter",
  keyCode: 13,
  location: 0,
  metaKey: false,
  repeat: false,
  returnValue: false,
  shiftKey: false,
  type: "keydown",
  which: 13});

