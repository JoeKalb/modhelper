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

function changeTextArea(input){
  currentMessage = textArea.value;
  textArea.value = input;
  console.log("Previous Message: ".concat(currentMessage));
}
