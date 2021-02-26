import { Client } from "./client.js"
import { initMenu } from "./menu.js"
import { error } from "./util/errors.js"

function getTransitionEndEventName() {
  const transitions = {
      "transition"      : "transitionend",
      "OTransition"     : "oTransitionEnd",
      "MozTransition"   : "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
   }
  let bodyStyle = document.body.style;
  for(let transition in transitions) {
      if(bodyStyle[transition] != undefined) {
          return transitions[transition];
      } 
  }
}

function waitForTransitionEnd(element, callback){
	let transitionEndName = getTransitionEndEventName(element);
	element.addEventListener(transitionEndName, callback);
}



export function init_connection(){
	const HOST = location.origin.replace(/^http/, "ws");
	const ws = new WebSocket(HOST);
	const client = new Client(ws);
  ws.binaryType = "arraybuffer";
  
	const loadDiv = document.getElementById("loading-screen");
	const menuDiv = document.getElementById("menu");
	const gameDiv = document.getElementById("game");

	// fade on websocket 
	ws.onopen = () => {
		loadDiv.classList.add("fade");
		waitForTransitionEnd(loadDiv, () => {
			loadDiv.style.display = "none";
			document.getElementById("menu").style.display = "flex";
			menuDiv.style.display = "flex";
			initMenu(client);
		});
	}
	ws.onclose = () => {
		error("Disconnected from Server");
	}
	ws.onerror = err => {
		error(err);
	}
}
