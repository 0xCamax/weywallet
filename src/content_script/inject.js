const script = document.createElement("script");
script.src = chrome.runtime.getURL("content_script/injected/index.js");
script.type = "text/javascript";


(document.head || document.documentElement).appendChild(script);