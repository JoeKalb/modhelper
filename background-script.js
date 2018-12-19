let ports = {};

function connect(p) {
  console.log("Connect port: " + p.name)
  ports[p.name] = p
  ports[p.name].postMessage({greeting: "hello from background-script"});
  ports[p.name].onMessage.addListener(function(m) {
    if(m.greeting == "hangman") startHangman(m.hangman)
    else if(m.greeting == "testBtn") sendToMain("test")
    else if(m.greeting == "PING") showConnect(p.name)
    else if(m.greeting == "pause") sendToMain("pause")
    else if(m.greeting == "clear") sendToMain("clear")
  });
}

function startHangman(info){
  console.log("Starting hangman")
  console.log(info)
  ports["main.js"].postMessage({
    greeting: "hangman",
    hangman: info
  })
}

function sendToMain(message){
  ports["main.js"].postMessage({
    greeting: message
  })
}

function showConnect(name){
  console.log("PING")
  ports[name].postMessage({greeting: "PONG"})
}

browser.runtime.onConnect.addListener(connect)