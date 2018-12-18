let portFromCS;

function connect(p) {
  console.log(p)
  portFromCS = p;
  portFromCS.postMessage({greeting: "hello from background-script"});
  portFromCS.onMessage.addListener(function(m) {
    console.log(m);
  });
}

browser.runtime.onConnect.addListener(connect);