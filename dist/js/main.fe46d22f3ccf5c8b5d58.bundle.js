(()=>{var e={241:(e,n,t)=>{"use strict";t.d(n,{Z:()=>i});var o=t(645),r=t.n(o)()((function(e){return e[1]}));r.push([e.id,"@import url(https://fonts.googleapis.com/css2?family=Nunito:wght@600&display=swap);"]),r.push([e.id,'html,\nbody {\n  margin: 0;\n  padding: 0;\n  background-color: rgb(20, 20, 20);\n  -webkit-touch-callout: none; /* iOS Safari */\n    -webkit-user-select: none; /* Safari */\n     -khtml-user-select: none; /* Konqueror HTML */\n       -moz-user-select: none; /* Old versions of Firefox */\n        -ms-user-select: none; /* Internet Explorer/Edge */\n            user-select: none; /* Non-prefixed version, currently\n                                  supported by Chrome, Edge, Opera and Firefox */\n  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);\n}\nbody::-webkit-scrollbar {\n  display: none;\n}\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: "Nunito", sans-serif;\n  overflow: hidden;\n\n}\n#loading-screen{\n  position: absolute;\n  display:flex;\n  justify-content:center; \n  align-items:center;\n  height: 100%;\n  width: 100%;\n  min-height: 50vh;\n}\n#menu{\n  position: absolute;\n  display:flex;\n  justify-content:center; \n  align-items:center;\n  height: 100%;\n  width: 100%;\n  min-height: 50vh;\n  -o-transition: opacity 0.3s ease-in-out;\n  transition: opacity 0.3s ease-in-out;\n}\n#server-selection{\n  position: absolute;\n  display:flex;\n  justify-content:center; \n  align-items:center;\n  height: 100%;\n  width: 100%;\n  min-height: 50vh;\n  -o-transition: opacity 0.3s ease-in-out;\n  transition: opacity 0.3s ease-in-out;\n}\ncanvas {\n  background: rgb(40, 40, 40);\n  position: absolute;\n  left: 0;\n  top: 0;\n  cursor: crosshair;\n  z-index: 0;\n}\n.inner{\n  width: 50%;\n  display: block;\n  background-color: rgb(60, 60, 60);\n  text-align: center;\n  border-radius: 12px;\n  color: rgb(168, 168, 168);\n  overflow-y: auto;\n  scrollbar-width: none; /* Firefox */\n  -ms-overflow-style: none;  /* Internet Explorer 10+ */\n  box-shadow: 0px 0px 16px 4px rgba(0, 0, 0, 0.3);\n}\n#errorInner{\n  width: 37%;\n  display: block;\n  background-color: rgb(158, 104, 104);\n  text-align: center;\n  border-radius: 12px;\n  color: rgb(133, 58, 58);\n  overflow-y: auto;\n  scrollbar-width: none; /* Firefox */\n  -ms-overflow-style: none;  /* Internet Explorer 10+ */\n  box-shadow: 0px 0px 16px 4px rgba(158, 67, 67, 0.3);\n}\n\n::-webkit-scrollbar {\n  width: 0px;\n  background: transparent;\n}\n.serverSelectInner{\n\tpadding-top: 20px;\n\tpadding-bottom: 20px;\n  width: 40%;\n  min-height: 300px;\n  height: 70vh;\n  display: block;\n  background-color: rgb(60, 60, 60);\n  text-align: center;\n  border-radius: 12px;\n  color: rgb(168, 168, 168);\n  overflow-y: auto;\n  scrollbar-width: none; /* Firefox */\n  -ms-overflow-style: none;  /* Internet Explorer 10+ */\n  box-shadow: 0px 0px 16px 4px rgba(0, 0, 0, 0.3);\n}\n\n.inner::-webkit-scrollbar { /* WebKit */\n  width: 0;\n  height: 0;\n}\n.logo{\n  color: rgb(168, 168, 168);\n  font-size: 60px;\n  text-align: center;\n  margin-top: 30px;\n  margin-bottom: 20px;\n}\nh1{\n  color: rgb(168, 168, 168);\n  font-size: 60px;\n  text-align: center;\n  margin: 0;\n  line-height: 47px;\n  text-shadow: 0px 0px 4px #000000;\n}\nh2{\n  font-size: 17px;\n  color: #949494;\n  text-decoration: none;\n  background-color: none;\n}\n.madeBy{\n  color: #727272;\n  margin-bottom: 20px;\n  font-size: 15px;\n  text-shadow: 0px 0px 4px #000000;\n}\n#loading-text{\n  line-height: 90px;\n  top: 34%;\n  position: absolute;\n  text-shadow: 0px 0px 4px #000000;\n}\n@keyframes spinner {\n  0% {\n    transform: translate3d(-50%, -50%, 0) rotate(0deg);\n  }\n  100% {\n    transform: translate3d(-50%, -50%, 0) rotate(360deg);\n  }\n}\n@keyframes spinner2 {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.server-card{\n  outline: none;\n  font-size: 50px;\n  width: 75%;\n\tpadding: 10px;\n  margin-top: 12px;\n  margin-bottom: 12px;\n  border-radius: 5px;\n  border: none;\n  transition: all 1s ease;\n\tbox-shadow: 0px 0px 7px 4px rgba(0, 0, 0, 0.3);\n  background-color: #949494;\n}\n.server-card:hover{\n  background-color: #dadada;\n  cursor: pointer;\n}\n.loader {\n  animation: 1s ease infinite spinner;\n  animation-play-state: inherit;\n  border: solid 10px #cfd0d1;\n  border-top-color: #1c87c9;\n  border-radius: 50%;\n  content: "";\n  left: 50%;\n  top: 53%;\n  width: 70px;\n  height: 70px;\n  position: absolute;\n  transform: translate3d(-50%, -50%, 0);\n  will-change: transform;\n}\n.loader2 {\n  animation: 1s ease infinite spinner2;\n  animation-play-state: inherit;\n  border: solid 10px #b1b1b1;\n  border-top-color: #1c87c9;\n  border-radius: 50%;\n  content: "";\n  width: 46px;\n  height: 46px;\n  padding-top: 3px;\n  padding-bottom: 3px;\n  margin: auto;\n  display: block;\n}\n\n#loading-screen{\n  -o-transition: opacity 0.5s ease-in-out;\n  transition: opacity 0.5s ease-in-out;\n}\n\n.fadeIn{\n  opacity: 1;\n}\n.fade{\n  opacity: 0;\n}\n#playButton{\n  font-size:1.5rem;\n  width:7.2rem;\n  height:3.1rem;\n  border:none;\n  outline:none;\n  color:#0e0e0e;\n  background-color: rgb(206, 206, 206);\n  transition: all 0.5s ease;\n  border-radius: 0.3rem;\n  margin-top: 24px;\n  margin-bottom: 25px;\n\tjustify-content: center;\n\ttext-align: center;\n  box-shadow: 0px 0px 6px 4px rgba(0, 0, 0, 0.3);\n}\n#playButton:hover{\n  background-color: rgb(172, 197, 197);\n  cursor: pointer;\n  color:#000000;\n}\ninput{\n  padding: 5px;\n  font-size: 25px;\n  color: #1f1633;\n  background-color: rgba(241, 239, 239, 0.575);\n  width: 50%;\n  text-align: center;\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  border-radius: 5px;\n  margin-bottom: 5px;\n  margin-top: 5px;\n  box-shadow: 0px 0px 5px 4px rgba(0, 0, 0, 0.3);\n\n  /*text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;*/\n  /*border: 1px solid #cccccc;*/\n  /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset;\n  transition: border 0.2s linear 0s, box-shadow 0.2s linear 0s;*/\n  outline: none;\n  border:none;\n}\ninput:focus {\n  border-color: rgba(82, 169, 236, 0.971);\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.075) inset,\n    50 50 50px rgba(82, 169, 236, 0.909);\n  outline: 0 none;\n}\n#serverHeader{\n  font-size: 80px;\n  line-height: 40px;\n\tpadding-top: 60px;\n\tpadding-bottom: 40px;\n}\n#errorText{\n  font-size: calc(1.7vw + 10px);\n  padding-bottom: 10px;\n}\n#error{\n  position: absolute;\n  display:flex;\n  justify-content:center; \n  align-items:center;\n  height: 100%;\n  width: 100%;\n  min-height: 50vh;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n#errorExit{\n  font-size: calc(0.8vw + 5px);\n}\n#errorHeader{\n  margin-top: 20px;\n  margin-bottom: 10px;\n  font-size: calc(2.5vw + 15px);\n}',""]);const i=r},645:e=>{"use strict";e.exports=function(e){var n=[];return n.toString=function(){return this.map((function(n){var t=e(n);return n[2]?"@media ".concat(n[2]," {").concat(t,"}"):t})).join("")},n.i=function(e,t,o){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var s=this[i][0];null!=s&&(r[s]=!0)}for(var a=0;a<e.length;a++){var l=[].concat(e[a]);o&&r[l[0]]||(t&&(l[2]?l[2]="".concat(t," and ").concat(l[2]):l[2]=t),n.push(l))}},n}},986:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>s});var o=t(379),r=t.n(o),i=t(241);r()(i.Z,{insert:"head",singleton:!1});const s=i.Z.locals||{}},379:(e,n,t)=>{"use strict";var o,r=function(){var e={};return function(n){if(void 0===e[n]){var t=document.querySelector(n);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}e[n]=t}return e[n]}}(),i=[];function s(e){for(var n=-1,t=0;t<i.length;t++)if(i[t].identifier===e){n=t;break}return n}function a(e,n){for(var t={},o=[],r=0;r<e.length;r++){var a=e[r],l=n.base?a[0]+n.base:a[0],d=t[l]||0,c="".concat(l," ").concat(d);t[l]=d+1;var p=s(c),h={css:a[1],media:a[2],sourceMap:a[3]};-1!==p?(i[p].references++,i[p].updater(h)):i.push({identifier:c,updater:g(h,n),references:1}),o.push(c)}return o}function l(e){var n=document.createElement("style"),o=e.attributes||{};if(void 0===o.nonce){var i=t.nc;i&&(o.nonce=i)}if(Object.keys(o).forEach((function(e){n.setAttribute(e,o[e])})),"function"==typeof e.insert)e.insert(n);else{var s=r(e.insert||"head");if(!s)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");s.appendChild(n)}return n}var d,c=(d=[],function(e,n){return d[e]=n,d.filter(Boolean).join("\n")});function p(e,n,t,o){var r=t?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(e.styleSheet)e.styleSheet.cssText=c(n,r);else{var i=document.createTextNode(r),s=e.childNodes;s[n]&&e.removeChild(s[n]),s.length?e.insertBefore(i,s[n]):e.appendChild(i)}}function h(e,n,t){var o=t.css,r=t.media,i=t.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o))}}var u=null,y=0;function g(e,n){var t,o,r;if(n.singleton){var i=y++;t=u||(u=l(n)),o=p.bind(null,t,i,!1),r=p.bind(null,t,i,!0)}else t=l(n),o=h.bind(null,t,n),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)};return o(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;o(e=n)}else r()}}e.exports=function(e,n){(n=n||{}).singleton||"boolean"==typeof n.singleton||(n.singleton=(void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o));var t=a(e=e||[],n);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var o=0;o<t.length;o++){var r=s(t[o]);i[r].references--}for(var l=a(e,n),d=0;d<t.length;d++){var c=s(t[d]);0===i[c].references&&(i[c].updater(),i.splice(c,1))}t=l}}}},419:e=>{e.exports=function(e){let n=window.innerWidth,t=window.innerHeight,o=window.innerWidth/e.width;window.innerHeight/e.height<window.innerWidth/e.width&&(o=window.innerHeight/e.height),e.width,e.height,e.style.transform="scale("+o+")",e.style.left=.5*(n-e.width)+"px",e.style.top=.5*(t-e.height)+"px"}}},n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={id:o,exports:{}};return e[o](r,r.exports,t),r.exports}t.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},t.d=(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},t.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{"use strict";class e{constructor(e){this.ws=e}}function n(e,n){try{e.send(msgpack.encode(n))}catch(e){console.log(e)}}function o(e){const n=document.getElementById("error");n.style.display="",document.getElementById("errorText").innerHTML=e,n.onclick=()=>{n.style.display="none"}}function r(e,n,t){if(e.measureText(n).width>t){for(let o=n.length-1;o>0;o--)if(n=n.slice(0,-1),e.measureText(n).width<t)return n+"...";return n}return n}const i=document.getElementById("gameCanvas").getContext("2d");class s{constructor(e){null!=e.g?(this.gameId=e.g,this.name=e.n,this.size=e.s,this.id=e.g,this.element=e.e,this.x=1/0,this.y=1/0,this.serverX=1/0,this.serverY=1/0,this.middleX=1/0,this.middleY=1/0,i.font="20px Arial",this.name=r(i,this.name,300),i.font="25px Arial",this.shortName=r(i,this.name,160)):(this.xp=e.xp,this.name=e.name,this.x=e.x,this.y=e.y,this.serverX=e.x,this.serverY=e.y,this.middleX=e.x,this.middleY=e.y,this.gameId=e.gameId,this.fov=e.fov,this.element=e.element,this.size=e.size,this.energy=100,this.maxEnergy=100,this.slots=["farm","basic","heal"],this.hp=100,this.maxHP=100,this.id=e.gameId,i.font="25px Arial",this.shortName=r(i,this.name,160))}updatePack(e){null!=e.x&&(this.serverX=e.x),null!=e.y&&(this.serverY=e.y),null!=e.xp&&(this.xp=e.xp),0===e.ip&&(this.x=this.serverX,this.y=this.serverY,this.middleX=this.x,this.middleY=this.y),-1===e.ip&&(this.x=1/0,this.y=1/0,this.serverX=1/0,this.serverY=1/0,this.middleX=1/0,this.middleY=1/0)}}const a={0:"farm",1:"basic",2:"heal"};class l{constructor(e){this.x=e.x,this.y=e.y,this.type=a[e.tt],this.size=e.s,this.dir=e.d,this.id=e.id,this.parentId=e.pi,this.hp=e.hp,this.maxHP=e.mh}updatePack(e){null!=e.d&&(this.dir=e.d),null!=e.hp&&(this.hp=e.hp)}}function d(e){let n=new Image;return n.src=e,n}const c={farm:"Slowly gives XP",basic:"Shoots at things",heal:"Heals in a radius"},p={basic:d("../../assets/elements/element_basic.svg")},h={farm:{yellow:d("../../assets/towers/tower_farm_yellow.svg"),red:d("../../assets/towers/tower_farm_red.svg")},basic:{yellow:d("../../assets/towers/tower_basic_yellow.svg"),red:d("../../assets/towers/tower_basic_red.svg")},heal:{yellow:d("../../assets/towers/tower_heal_yellow.svg"),red:d("../../assets/towers/tower_heal_red.svg")}},u={energy:d("../../assets/icons/logo_energy.svg"),health:d("../../assets/icons/logo_health.svg")},y=30;function g(e,n,t){return e*(1-t)+n*t}const f={farm:{energy:60},basic:{energy:35},heal:{energy:40}},m=document.getElementById("gameCanvas"),x={farm:0,basic:1,heal:2};function b(e,t){const o=document.getElementById("server-selection"),r=document.getElementById("game"),i=document.getElementById("gameCanvas"),a=i.getContext("2d");let d=window.performance.now(),b={x:0,y:0};o.style.display="none",r.style.display="";const w={arenaWidth:e.aW,arenaHeight:e.aH,players:{},towers:{},you:new s(e.s)};let v=!1,k=!1,S=!0,z=[];for(let n of e.pd)w.players[n.g]=new s(n);function T(e){let n=window.performance.now()-d;d=window.performance.now(),0!=v&&(S=function(e,n,t){let o=JSON.parse(JSON.stringify(e.players));o[e.you.gameId]=JSON.parse(JSON.stringify(e.you));let r={x:0,y:0};r.x=(n.x-m.width/2)/e.you.fov+e.you.x,r.y=(n.y-m.height/2)/e.you.fov+e.you.y;for(let e of Object.keys(o)){const n=o[e];if(Math.sqrt(Math.pow(r.x-n.x,2)+Math.pow(r.y-n.y,2))<40+n.size)return!1}for(let n of Object.keys(e.towers)){const t=e.towers[n];if(Math.sqrt(Math.pow(r.x-t.x,2)+Math.pow(r.y-t.y,2))<t.size/2+40)return!1}return!(r.x<40||r.y<40||r.x>e.arenaWidth-40||r.y>e.arenaHeight-40||e.you.energy<f[t].energy||Math.sqrt(Math.pow(r.x-e.you.x,2)+Math.pow(r.y-e.you.y,2))>400)}(e,b,v)),function(e,n,t,o,r,i,s){n.fillStyle="rgb(180, 180, 180)",n.fillRect(0,0,t.width,t.height),n.scale(e.you.fov,e.you.fov),n.translate(-e.you.x+t.width/2*1/e.you.fov,-e.you.y+t.height/2*1/e.you.fov);let a=JSON.parse(JSON.stringify(e.players));a[e.you.gameId]=JSON.parse(JSON.stringify(e.you)),n.fillStyle="rgb(0, 0, 0)",n.fillRect(-10,-10,e.arenaWidth+20,e.arenaHeight+20),n.fillStyle="rgb(200, 200, 200)",n.fillRect(0,0,e.arenaWidth,e.arenaHeight);let l=500;n.strokeStyle="rgb(180, 180, 180)",n.lineWidth=5;for(let t=1;t<e.arenaHeight/l;t++)n.beginPath(),n.moveTo(0,l*t),n.lineTo(e.arenaWidth,l*t),n.stroke();for(let t=1;t<e.arenaWidth/l;t++)n.beginPath(),n.moveTo(l*t,0),n.lineTo(l*t,e.arenaHeight),n.stroke();n.fillStyle="rgb(0, 0, 0)",n.font="20px Arial";for(let e of Object.keys(a)){const t=a[e];null!=t.x&&null!=t.y&&(n.drawImage(p[t.element],t.x-t.size,t.y-t.size,2*t.size,2*t.size),n.fillText(t.name,t.x,t.y+t.size+15))}n.lineCap="round";for(let o of Object.keys(e.towers)){const r=e.towers[o];null!=r.x&&null!=r.y&&r.x>e.you.x-t.width/2*1/e.you.fov-100&&r.x<e.you.x+t.width/2*1/e.you.fov+100&&r.y>e.you.y-t.height/2*1/e.you.fov-120&&r.y<e.you.y+t.height/2*1/e.you.fov+120&&(r.parentId!=e.you.id?(n.translate(r.x,r.y),n.rotate(r.dir),n.drawImage(h[r.type].red,-r.size,-r.size,2*r.size,2*r.size),n.rotate(-r.dir),n.translate(-r.x,-r.y),n.lineWidth=10,n.strokeStyle="#000000",n.beginPath(),n.moveTo(r.x-r.size/2,r.y+r.size/2+10),n.lineTo(r.x+r.size/2,r.y+r.size/2+10),n.stroke(),n.lineWidth=8,n.strokeStyle="#a65033",n.beginPath(),n.moveTo(r.x-r.size/2,r.y+r.size/2+10),n.lineTo(r.x-r.size/2+r.size*r.hp/r.maxHP,r.y+r.size/2+10),n.stroke()):(n.translate(r.x,r.y),n.rotate(r.dir),n.drawImage(h[r.type].yellow,-r.size,-r.size,2*r.size,2*r.size),n.rotate(-r.dir),n.translate(-r.x,-r.y),n.lineWidth=10,n.strokeStyle="#000000",n.beginPath(),n.moveTo(r.x-r.size/2,r.y+r.size/2+10),n.lineTo(r.x+r.size/2,r.y+r.size/2+10),n.stroke(),n.lineWidth=8,n.strokeStyle="#45a633",n.beginPath(),n.moveTo(r.x-r.size/2,r.y+r.size/2+10),n.lineTo(r.x-r.size/2+r.size*r.hp/r.maxHP,r.y+r.size/2+10),n.stroke()))}n.translate(-(-e.you.x+t.width/2*1/e.you.fov),-(-e.you.y+t.height/2*1/e.you.fov)),n.scale(1/e.you.fov,1/e.you.fov),n.textAlign="center",n.lineWidth=25,n.lineCap="round",n.beginPath(),n.strokeStyle="rgb(0, 0, 0)",n.moveTo(450,780),n.lineTo(1200,780),n.stroke(),n.beginPath(),n.lineWidth=20,n.strokeStyle="#e7cc47",n.moveTo(450,780),n.lineTo(1200-750*(1-e.you.energy/e.you.maxEnergy),780),n.stroke(),n.drawImage(u.energy,360,730,95,95),n.textAlign="center",n.lineWidth=25,n.lineCap="round",n.beginPath(),n.strokeStyle="rgb(0, 0, 0)",n.moveTo(450,740),n.lineTo(800,740),n.stroke(),n.beginPath(),n.lineWidth=20,n.strokeStyle="#ca3e2c",n.moveTo(450,740),n.lineTo(800-350*(1-e.you.hp/e.you.maxHP),740),n.stroke(),n.drawImage(u.health,360,690,95,95),n.fillStyle="rgba(0, 0, 0, 0.4)",n.fillRect(30,30,310,40*(s.length+1)+13),n.textAlign="left",n.font="28px Arial",n.fillStyle="rgb(255, 255, 255)",n.fillText("Leaderboard",45,64),n.font="25px Arial";for(let t of s)t.id!=e.you.id?(t.name=e.players[t.id].shortName,n.fillStyle="rgb(220, 220, 220)"):(t.name=e.you.shortName,n.fillStyle="#f0ee92"),n.fillText(t.place+". "+t.name+": "+t.xp,45,104+40*s.indexOf(t));n.textAlign="center",n.lineCap="butt";let d=e.you.slots,y=d.length,g=d.length-1;for(let e=0;e<y;e++){let t=800-g/2*100+100*e;n.globalAlpha=.3,n.fillStyle="rgb(0, 0, 0)",n.fillRect(t-40,800,80,80),n.globalAlpha=1,n.drawImage(h[d[e]].yellow,t-60,780,120,120),n.font="16px Arial",n.fillStyle="rgb(0, 0, 0)",n.fillText(e+1,t-31,872),r.x>t-40&&r.x<t+40&&r.y>800&&r.y<880&&(n.globalAlpha=.7,n.font="19px Arial",n.fillRect(t-120,680,240,100),n.globalAlpha=1,n.fillStyle="rgb(240, 240, 240)",n.font="bold 32px Arial",n.fillText((f=d[e]).charAt(0).toUpperCase()+f.slice(1),t,713),n.font="19px Arial",n.fillText(c[d[e]],t,755))}var f;0!=o&&(n.globalAlpha=.4,n.drawImage(h[o].yellow,r.x-80*e.you.fov,r.y-80*e.you.fov,160*e.you.fov,160*e.you.fov),!1===i&&(n.globalAlpha=.3,n.beginPath(),n.fillStyle="rgb(255, 0, 0)",n.arc(r.x,r.y,41*e.you.fov,0,2*Math.PI),n.fill()),n.globalAlpha=.1,n.beginPath(),n.fillStyle="rgb(0, 0, 0)",n.arc(800,450,400*e.you.fov,0,2*Math.PI),n.fill(),n.globalAlpha=1)}(e,a,i,v,b,S,z),function(e,n){for(let t of Object.keys(e.players)){const o=e.players[t];o.x=g(o.x,o.middleX,n/1e3*y),o.y=g(o.y,o.middleY,n/1e3*y),o.middleX=g(o.middleX,o.serverX,n/1e3*y),o.middleY=g(o.middleY,o.serverY,n/1e3*y)}{const t=e.you;t.x=g(t.x,t.middleX,n/1e3*y),t.y=g(t.y,t.middleY,n/1e3*y),t.middleX=g(t.middleX,t.serverX,n/1e3*y),t.middleY=g(t.middleY,t.serverY,n/1e3*y)}}(e,n),requestAnimationFrame((()=>{T(e)}))}i.addEventListener("mousemove",(function(e){window.innerWidth,window.innerHeight;let n=window.innerWidth/i.width;window.innerHeight/i.height<window.innerWidth/i.width&&(n=window.innerHeight/i.height);const t=i.getBoundingClientRect();b.x=Math.round((e.clientX-t.left)/n),b.y=Math.round((e.clientY-t.top)/n)})),i.addEventListener("mousedown",(function(e){if(!1===k&&0!=v&&1==S){const e={t:"pt",mx:b.x,my:b.y,tt:x[v]};n(t.ws,e),v=!1}k=!0})),i.addEventListener("mouseup",(function(e){k=!1})),document.onkeydown=e=>{if(!e.repeat){if(" "===e.key&&0!=v&&1==S){const e={t:"pt",mx:b.x,my:b.y,tt:x[v]};n(t.ws,e),v=!1}for(let n=w.you.slots.length;n>0;n--)String(e.key)===String(n)&&(v=v!=w.you.slots[Number(e.key)-1]&&w.you.slots[Number(e.key)-1]);n(t.ws,{t:"keyd",c:e.key})}},document.onkeyup=e=>{n(t.ws,{t:"keyu",c:e.key})},t.ws.onclose=()=>{alert("You've been disconnected from the server!")},t.ws.onmessage=e=>{let n=msgpack.decode(new Uint8Array(e.data));switch(n.t){case"npj":w.players[n.i.g]=new s(n.i);break;case"u":for(let e of n.p)null!=w.players[e.g]?w.players[e.g].updatePack(e):w.you.gameId===e.g&&w.you.updatePack(e);for(let e of n.tp)null!=e.pi?w.towers[e.id]=new l(e):w.towers[e.id].updatePack(e);null!=n.e&&(w.you.energy=n.e),null!=n.h&&(w.you.hp=n.h),null!=n.xp&&(w.you.xp=n.xp);break;case"pl":delete w.players[n.g];break;case"ntp":w.towers[n.d.id]=new l(n.d);break;case"rt":delete w.towers[n.id];break;case"lb":z=n.lb}},requestAnimationFrame((()=>{T(w)}))}function w(e){document.onkeydown=()=>{},document.onkeyup=()=>{};const t=document.getElementById("menu"),o=document.getElementById("server-selection");n(e.ws,{t:"ss"}),e.ws.onmessage=n=>{let r=msgpack.decode(new Uint8Array(n.data));try{switch(r.t){case"ssr":{t.style.display="none",o.style.display="flex";const n=document.getElementById("serverSelectionData");n.innerHTML="";for(let e=r.d.length;e--;e>0){const t=r.d[e];n.innerHTML+=`\n            <button id="${t.id}" class="server-card">\n\t\t\t\t      ${t.title}\n\t\t\t      </button>\n            `}const i=document.querySelectorAll(".server-card");for(let n of i)n.addEventListener("click",(()=>{v(e,n.id)}))}}}catch(e){console.log("bug with server selection response: "+e)}}}function v(e,t){n(e.ws,{t:"js",id:t,n:document.getElementById("usernameInput").value}),e.ws.onmessage=n=>{try{let t=msgpack.decode(new Uint8Array(n.data));switch(t.t){case"jsf":switch(t.m){case"sf":o("Server full!");break;case"ns":o("Server closed!")}w(e);break;case"jss":b(t,e)}}catch{}};const r=document.querySelectorAll(".server-card");for(let e of r)e.style.pointerEvents="none"}t(986);const k=t(419);(()=>{const e=document.getElementById("gameCanvas");k(e),window.onload=function(){window.addEventListener("resize",k.bind(null,e)),k(e)}})(),"https:"!==location.protocol&&location.replace(`https:${location.href.substring(location.protocol.length)}`),function(){const n=location.origin.replace(/^http/,"ws"),t=new WebSocket(n),r=new e(t);t.binaryType="arraybuffer";const i=document.getElementById("loading-screen"),s=document.getElementById("menu");document.getElementById("game"),t.onopen=()=>{i.classList.add("fade"),function(e,n){let t=function(){const e={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};let n=document.body.style;for(let t in e)if(null!=n[t])return e[t]}();e.addEventListener(t,n)}(i,(()=>{i.style.display="none",s.style.display="flex",function(e){e.ws.onopen=()=>{};const n=document.getElementById("playButton");n.style.pointerEvents="auto",n.addEventListener("click",(()=>{n.style.pointerEvents="none",n.innerHTML='<div class="loader2" style="" id="playLoader"></div>',w(e)}))}(r)}))},t.onclose=()=>{o("Disconnected from Server")},t.onerror=e=>{o(e)}}()})()})();