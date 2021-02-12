require('./style.css');


import { init_connection } from "./connection.js"
const canvasResize = require('./util/resize');
import { error } from "./util/errors.js";

(() => {
	const canvas = document.getElementById("gameCanvas");

	canvasResize(canvas);
	window.onload = function() {
		window.addEventListener("resize", canvasResize.bind(null, canvas));
		canvasResize(canvas);
	};
})();

//Enforce Https
if (location.protocol !== 'https:') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

// initialize websocket connection
init_connection();