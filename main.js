let chat = document.getElementsByClassName("chat-list__lines tw-flex-grow-1 scrollable-area")[0];
let textArea = document.getElementsByTagName("textarea")[0];

let messages = [];
let currentMessage = "";
let myPort = browser.runtime.connect({name: "main.js"})

chat.addEventListener("DOMNodeInserted", function(event){
  message = event.srcElement.innerText.split(':', 2);
  messages.push({
    "username": message[0],
    "message": message[1].trim()
  });
  changeTextArea(message[1].trim());
}, false);

function changeTextArea(input){
  currentMessage = textArea.value;
  textArea.value = input;
  myPort.postMessage({greeting: input})
}

browser.runtime.onMessage.addListener(request => {
    console.log("Hangman Recieved")
    console.log(request.hangman)
    return Promise.resolve({response: "Hangman Recieved!"})
})

myPort.postMessage({greeting: "hello from main.js"})

myPort.onMessage.addListener(m => {
  console.log("in the content script, received message from background script")
  console.log(m.greeting)
});
