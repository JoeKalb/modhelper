let chat = document.getElementsByClassName("chat-list__lines tw-flex-grow-1 scrollable-area")[0];
let textArea = document.getElementsByTagName("textarea")[0];

let messages = [];
let currentMessage = "";


chat.addEventListener("DOMNodeInserted", function(event){
  message = event.srcElement.innerText.split(':', 2);
  messages.push({
    "username": message[0],
    "message": message[1].trim()
  });
  changeTextArea(message[1].trim());
}, false);

let myPort = browser.runtime.connect({name: "main.js"})

function changeTextArea(input){
  currentMessage = textArea.value;
  textArea.value = input;
  myPort.postMessage({greeting: input})
}

 myPort.runtime.onMessage.addListener(request => {
    console.log("Message Recieved")
    console.log(request.greeting)
    return Promise.resolve({response: "Message Recieved!"})
})

myPort.postMessage({greeting: "hello from main.js"})

myPort.onMessage.addListener(m => {
  console.log("message recieved")
  console.log(m.greeting)
});
