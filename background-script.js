let ports = {};

function connect(p) {
  console.log("Connect port: " + p.name)
  ports[p.name] = p
  ports[p.name].postMessage({greeting: "hello from background-script"});
  ports[p.name].onMessage.addListener(function(m) {
    if(m.greeting == "hangman") startHangman(m.hangman)
    if(m.greeting == "testBtn") testingMainPose()
  });
}

function startHangman(info){
  console.log("Starting hangman")
  console.log(ports)
  console.log(info)
}

function testingMainPose(){
  ports["main.js"].postMessage({greeting: "This is a test"})
}

browser.runtime.onConnect.addListener(connect)