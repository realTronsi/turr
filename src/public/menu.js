import { sendPacket } from "./socket.js"
import { error } from "./util/errors.js"
import { initGame } from "./game/game.js"
export function initMenu(client) {
	// called from connection.js ws.open callback
	client.ws.onopen = () => { }; // empty onopen callback
	const playButton = document.getElementById("playButton");
	playButton.style.pointerEvents = "auto";
	playButton.addEventListener("click", () => {
		playButton.style.pointerEvents = "none"; // disable accidental double click
		playButton.innerHTML = `<div class="loader2" style="" id="playLoader"></div>`;
		initServerSelection(client);
	});
}

export function initServerSelection(client) {
	document.onkeydown = () => {};
	document.onkeyup = () => {}; // clear listeners
  const menuDiv = document.getElementById('menu');
	const serverSelectionDiv = document.getElementById("server-selection");

	sendPacket(client.ws,
		{
			t: "ss" // server selection
		});
	// set up client event listener
	client.ws.onmessage = msg => {
		let data = msgpack.decode(new Uint8Array(msg.data));
		try {
			switch(data.t){ //data type
				case "ssr": { // server selection response
					menuDiv.style.display = "none";
	        serverSelectionDiv.style.display = "flex";
          const serverSelectionData = document.getElementById("serverSelectionData");
          serverSelectionData.innerHTML = "";

					// add loading wheel to play button
					
          for(let i = data.d.length; i--; i>0){
            const serverData = data.d[i];
            serverSelectionData.innerHTML += `
            <button id="${serverData.id}" class="server-card">
				      ${serverData.title}
			      </button>
            `
          }

          const serverCards = document.querySelectorAll('.server-card');
          for(let serverCard of serverCards){
            serverCard.addEventListener("click", () => {
              joinServer(client, serverCard.id)
            })
          }
				};
				default: break;
			}
		} catch (err) {
      console.log("bug with server selection response: "+err)
    }
	}
}

export function joinServer(client, serverId){
  sendPacket(client.ws,
    {
			t: "js", // join server
      id: serverId, // server id
      n: document.getElementById("usernameInput").value // nickname
	  });
	client.ws.onmessage = msg => {
		// handle errors/success
    try{
      let data = msgpack.decode(new Uint8Array(msg.data));
			switch(data.t){
        case "jsf": {
          //Join Server Fail
          switch(data.m){
            case "sf": {
              error("Server full!")
              break;
            }
            case "ns": {
              error("Server closed!")
              break;
            }
          }
          initServerSelection(client); // basically resets so client sees correct updated servers
					break;
        }
        case "jss": {
					initGame(data, client);
          break;
        }
      }
    } catch{}
	}
  const serverCards = document.querySelectorAll('.server-card');
  for(let serverCard of serverCards){
    serverCard.style.pointerEvents = "none";
    //Backend disable too.
  }
}