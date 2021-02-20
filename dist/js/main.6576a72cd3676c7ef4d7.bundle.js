(()=>{var e={241:(e,t,n)=>{"use strict";n.d(t,{Z:()=>i});var o=n(645),r=n.n(o)()((function(e){return e[1]}));r.push([e.id,"@import url(https://fonts.googleapis.com/css2?family=Nunito:wght@600&display=swap);"]),r.push([e.id,'html,\nbody {\n  margin: 0;\n  padding: 0;\n  background-color: rgb(20, 20, 20);\n  -webkit-touch-callout: none; /* iOS Safari */\n    -webkit-user-select: none; /* Safari */\n     -khtml-user-select: none; /* Konqueror HTML */\n       -moz-user-select: none; /* Old versions of Firefox */\n        -ms-user-select: none; /* Internet Explorer/Edge */\n            user-select: none; /* Non-prefixed version, currently\n                                  supported by Chrome, Edge, Opera and Firefox */\n  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);\n}\nsvg { \n  height: 100%;\n  width: 100%;\n}\nbody::-webkit-scrollbar {\n  display: none;\n}\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: "Nunito", sans-serif;\n  overflow: hidden;\n\n}\ndiv {\nmargin:0;\npadding:0;\n}\n#loading-screen{\n  position: absolute;\n  display:flex;\n  justify-content:center; \n  align-items:center;\n  height: 100%;\n  width: 100%;\n  min-height: 50vh;\n}\n#menu{\n  position: absolute;\n  display:flex;\n  justify-content:center; \n  align-items:center;\n  height: 100%;\n  width: 100%;\n  -o-transition: opacity 0.3s ease-in-out;\n  transition: opacity 0.3s ease-in-out;\n}\n#server-selection{\n  position: absolute;\n  display:flex;\n  justify-content:center; \n  align-items:center;\n  height: 100%;\n  width: 100%;\n  min-height: 50vh;\n  -o-transition: opacity 0.3s ease-in-out;\n  transition: opacity 0.3s ease-in-out;\n}\ncanvas {\n  background: rgb(40, 40, 40);\n  position: absolute;\n  left: 0;\n  top: 0;\n  cursor: crosshair;\n  z-index: 0;\n}\n.inner{\n  width: 50%;\n  display: block;\n  background-color: rgb(60, 60, 60);\n  text-align: center;\n  border-radius: 12px;\n  color: rgb(168, 168, 168);\n  overflow-y: auto;\n  scrollbar-width: none; /* Firefox */\n  -ms-overflow-style: none;  /* Internet Explorer 10+ */\n  box-shadow: 0px 0px 16px 4px rgba(0, 0, 0, 0.3);\n}\n#errorInner{\n  width: 37%;\n  display: block;\n  background-color: rgb(158, 104, 104);\n  text-align: center;\n  border-radius: 12px;\n  color: rgb(133, 58, 58);\n  overflow-y: auto;\n  scrollbar-width: none; /* Firefox */\n  -ms-overflow-style: none;  /* Internet Explorer 10+ */\n  box-shadow: 0px 0px 16px 4px rgba(158, 67, 67, 0.3);\n}\n\n::-webkit-scrollbar {\n  width: 0px;\n  background: transparent;\n}\n.serverSelectInner{\n\tpadding-top: 20px;\n\tpadding-bottom: 20px;\n  width: 40%;\n  min-height: 300px;\n  height: 70vh;\n  display: block;\n  background-color: rgb(60, 60, 60);\n  text-align: center;\n  border-radius: 12px;\n  color: rgb(168, 168, 168);\n  overflow-y: auto;\n  scrollbar-width: none; /* Firefox */\n  -ms-overflow-style: none;  /* Internet Explorer 10+ */\n  box-shadow: 0px 0px 16px 4px rgba(0, 0, 0, 0.3);\n}\n\n.inner::-webkit-scrollbar { /* WebKit */\n  width: 0;\n  height: 0;\n}\n.logo{\n  color: rgb(168, 168, 168);\n  font-size: 60px;\n  text-align: center;\n  margin-top: 30px;\n  margin-bottom: 20px;\n}\nh1{\n  color: rgb(168, 168, 168);\n  font-size: 60px;\n  text-align: center;\n  margin: 0;\n  line-height: 47px;\n  text-shadow: 0px 0px 4px #000000;\n}\nh2{\n  font-size: 17px;\n  color: #949494;\n  text-decoration: none;\n  background-color: none;\n}\n.madeBy{\n  color: #727272;\n  margin-bottom: 20px;\n  font-size: 15px;\n  text-shadow: 0px 0px 4px #000000;\n}\n#loading-text{\n  line-height: 90px;\n  top: 34%;\n  position: absolute;\n  text-shadow: 0px 0px 4px #000000;\n}\n@keyframes spinner {\n  0% {\n    transform: translate3d(-50%, -50%, 0) rotate(0deg);\n  }\n  100% {\n    transform: translate3d(-50%, -50%, 0) rotate(360deg);\n  }\n}\n@keyframes spinner2 {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.server-card{\n  outline: none;\n  font-size: 50px;\n  width: 75%;\n\tpadding: 10px;\n  margin-top: 12px;\n  margin-bottom: 12px;\n  border-radius: 5px;\n  border: none;\n  transition: all 1s ease;\n\tbox-shadow: 0px 0px 7px 4px rgba(0, 0, 0, 0.3);\n  background-color: #949494;\n}\n.server-card:hover{\n  background-color: #dadada;\n  cursor: pointer;\n}\n.loader {\n  animation: 1s ease infinite spinner;\n  animation-play-state: inherit;\n  border: solid 10px #cfd0d1;\n  border-top-color: #1c87c9;\n  border-radius: 50%;\n  content: "";\n  left: 50%;\n  top: 53%;\n  width: 70px;\n  height: 70px;\n  position: absolute;\n  transform: translate3d(-50%, -50%, 0);\n  will-change: transform;\n}\n.loader2 {\n  animation: 1s ease infinite spinner2;\n  animation-play-state: inherit;\n  border: solid 10px #b1b1b1;\n  border-top-color: #1c87c9;\n  border-radius: 50%;\n  content: "";\n  width: 46px;\n  height: 46px;\n  padding-top: 3px;\n  padding-bottom: 3px;\n  margin: auto;\n  display: block;\n}\n\n#loading-screen{\n  -o-transition: opacity 0.5s ease-in-out;\n  transition: opacity 0.5s ease-in-out;\n}\n\n.fadeIn{\n  opacity: 1;\n}\n.fade{\n  opacity: 0;\n}\n#playButton{\n  font-size:1.5rem;\n  width:7.2rem;\n  height:3.1rem;\n  border:none;\n  outline:none;\n  color:#0e0e0e;\n  background-color: rgb(206, 206, 206);\n  transition: all 0.5s ease;\n  border-radius: 0.3rem;\n  margin-top: 24px;\n\tjustify-content: center;\n\ttext-align: center;\n  box-shadow: 0px 0px 6px 4px rgba(0, 0, 0, 0.3);\n  margin: none;\n}\n#playButton:hover{\n  background-color: rgb(172, 197, 197);\n  cursor: pointer;\n  color:#000000;\n}\n#tutorialButton{\n  font-size:1.5rem;\n  width:7.2rem;\n  height:3.1rem;\n  border:none;\n  outline:none;\n  color:#0e0e0e;\n  background-color: rgb(196, 235, 186);\n  transition: all 0.5s ease;\n  border-radius: 0.3rem;\n  margin: none;\n\tjustify-content: center;\n\ttext-align: center;\n  box-shadow: 0px 0px 6px 4px rgba(0, 0, 0, 0.3);\n  position:relative;\n  top:-20px;\n}\n#tutorialButton:hover{\n  background-color: rgb(164, 211, 166);\n  cursor: pointer;\n  color:#000000;\n}\n#backToMenu{\n  font-size:1.5rem;\n  width:12rem;\n  height:3.1rem;\n  border:none;\n  position: absolute;\n  outline:none;\n  color:#0e0e0e;\n  background-color: rgb(196, 235, 186);\n  transition: all 0.5s ease;\n  border-radius: 0.3rem;\n  margin: none;\n\tjustify-content: center;\n\ttext-align: center;\n  box-shadow: 0px 0px 6px 4px rgba(0, 0, 0, 0.3);\n\tbottom:10px;\n  left: calc(50% - 6rem);\n}\n#backToMenu:hover{\n  background-color: rgb(164, 211, 166);\n  cursor: pointer;\n  color:#000000;\n}\n\n\ninput{\n  padding: 5px;\n  font-size: 25px;\n  color: #1f1633;\n  background-color: rgba(241, 239, 239, 0.575);\n  width: 50%;\n  text-align: center;\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  border-radius: 5px;\n  margin-bottom: 5px;\n  margin-top: 5px;\n  box-shadow: 0px 0px 5px 4px rgba(0, 0, 0, 0.3);\n\n  /*text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;*/\n  /*border: 1px solid #cccccc;*/\n  /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset;\n  transition: border 0.2s linear 0s, box-shadow 0.2s linear 0s;*/\n  outline: none;\n  border:none;\n}\ninput:focus {\n  border-color: rgba(82, 169, 236, 0.971);\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.075) inset,\n    50 50 50px rgba(82, 169, 236, 0.909);\n  outline: 0 none;\n}\n#serverHeader{\n  font-size: 80px;\n  line-height: 40px;\n\tpadding-top: 60px;\n\tpadding-bottom: 40px;\n}\n#errorText{\n  font-size: calc(1.7vw + 10px);\n  padding-bottom: 10px;\n}\n#error{\n  position: absolute;\n  display:flex;\n  justify-content:center; \n  align-items:center;\n  height: 100%;\n  width: 100%;\n  min-height: 50vh;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n#errorExit{\n  font-size: calc(0.8vw + 5px);\n}\n#errorHeader{\n  margin-top: 20px;\n  margin-bottom: 10px;\n  font-size: calc(2.5vw + 15px);\n}\n\n\n.chat1::-webkit-input-placeholder {\n  color: #444;\n}\n.chat1:-moz-placeholder {\n  color: #444;\n  opacity: 1;\n}\n.chat1::-moz-placeholder {\n  color: #444;\n  opacity: 1;\n}\n.chat1:-ms-input-placeholder {\n  color: #444;\n}\n.chat2::-webkit-input-placeholder {\n  color: #222;\n}\n.chat2:-moz-placeholder {\n  color: #222;\n  opacity: 1;\n}\n.chat2::-moz-placeholder {\n  color: #222;\n  opacity: 1;\n}\n.chat2:-ms-input-placeholder {\n  color: #222;\n}\n\n#chatHolder {\n  display: none;\n  position: absolute;\n  bottom: 32%;\n  width: 100%;\n  text-align: center;\n  z-index: 0;\n}\n\n#chatBox {\n  padding: 6px;\n  margin: 20px;\n  width: 20vw;\n  font-size: 20px;\n  color: #222222;\n  background-color: rgba(100, 100, 100, 0.5);\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n  pointer-events: all;\n  border: 0;\n}\n\n#tutorial {\n  overflow: auto;\n  height: 100vh;\n\tdisplay: flex;\n  justify-content: center;\n}\n#tutorialImage {\n  width: 90vh;\n  margin: auto;\n\talign-self: flex-start;\n}\n#tutorial::-webkit-scrollbar {\n  display: block;\n  background: black;\n  width: 20px;\n}\n#tutorial::-webkit-scrollbar {\n  width: 20px;\n}\n\n/* Track */\n#tutorial::-webkit-scrollbar-track {\n  background: #f1f1f1;\n}\n\n/* Handle */\n#tutorial::-webkit-scrollbar-thumb {\n  background: #888;\n}\n\n/* Handle on hover */\n#tutorial::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}',""]);const i=r},645:e=>{"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=e(t);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,o){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(r[a]=!0)}for(var s=0;s<e.length;s++){var l=[].concat(e[s]);o&&r[l[0]]||(n&&(l[2]?l[2]="".concat(n," and ").concat(l[2]):l[2]=n),t.push(l))}},t}},986:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>a});var o=n(379),r=n.n(o),i=n(241);r()(i.Z,{insert:"head",singleton:!1});const a=i.Z.locals||{}},379:(e,t,n)=>{"use strict";var o,r=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),i=[];function a(e){for(var t=-1,n=0;n<i.length;n++)if(i[n].identifier===e){t=n;break}return t}function s(e,t){for(var n={},o=[],r=0;r<e.length;r++){var s=e[r],l=t.base?s[0]+t.base:s[0],d=n[l]||0,c="".concat(l," ").concat(d);n[l]=d+1;var h=a(c),u={css:s[1],media:s[2],sourceMap:s[3]};-1!==h?(i[h].references++,i[h].updater(u)):i.push({identifier:c,updater:g(u,t),references:1}),o.push(c)}return o}function l(e){var t=document.createElement("style"),o=e.attributes||{};if(void 0===o.nonce){var i=n.nc;i&&(o.nonce=i)}if(Object.keys(o).forEach((function(e){t.setAttribute(e,o[e])})),"function"==typeof e.insert)e.insert(t);else{var a=r(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(t)}return t}var d,c=(d=[],function(e,t){return d[e]=t,d.filter(Boolean).join("\n")});function h(e,t,n,o){var r=n?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(e.styleSheet)e.styleSheet.cssText=c(t,r);else{var i=document.createTextNode(r),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i)}}function u(e,t,n){var o=n.css,r=n.media,i=n.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o))}}var y=null,p=0;function g(e,t){var n,o,r;if(t.singleton){var i=p++;n=y||(y=l(t)),o=h.bind(null,n,i,!1),r=h.bind(null,n,i,!0)}else n=l(t),o=u.bind(null,n,t),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else r()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o));var n=s(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var o=0;o<n.length;o++){var r=a(n[o]);i[r].references--}for(var l=s(e,t),d=0;d<n.length;d++){var c=a(n[d]);0===i[c].references&&(i[c].updater(),i.splice(c,1))}n=l}}}},419:e=>{e.exports=function(e){let t=window.innerWidth,n=window.innerHeight,o=window.innerWidth/e.width;window.innerHeight/e.height<window.innerWidth/e.width&&(o=window.innerHeight/e.height),e.width,e.height,e.style.transform="scale("+o+")",e.style.left=.5*(t-e.width)+"px",e.style.top=.5*(n-e.height)+"px"}}},t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={id:o,exports:{}};return e[o](r,r.exports,n),r.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{"use strict";class e{constructor(e){this.ws=e}}function t(e,t){try{e.send(msgpack.encode(t))}catch(e){console.log(e)}}function o(e){const t=document.getElementById("error");t.style.display="",document.getElementById("errorText").innerHTML=e,t.onclick=()=>{t.style.display="none"}}function r(e,t,n){if(e.measureText(t).width>n){for(let o=t.length-1;o>0;o--)if(t=t.slice(0,-1),e.measureText(t).width<n)return t+"...";return t}return t}const i={0:"fire",1:"water",2:"earth",3:"magma"},a={basic:{tier:1,upgrades:[{color:"#f72828",name:"fire"},{color:"#2889de",name:"water"},{color:"#27b039",name:"earth"}],towers:["farm","basic","heal"],fov:1,maxHP:100,maxEnergy:100},fire:{tier:2,upgrades:[{color:"#a12020",name:"magma"}],towers:["farm","basic","heal","bomb","propel"],fov:1,maxHP:85,maxEnergy:100},water:{tier:2,upgrades:[],towers:["farm","basic","heal","streamer","drown"],fov:1,maxHP:110,maxEnergy:100},earth:{tier:2,upgrades:[],towers:["farm","basic","heal","splinter","observatory"],fov:.9,maxHP:140,maxEnergy:100},magma:{tier:3,upgrades:[],towers:["farm","basic","heal","bomb","propel"],fov:1,maxHP:95,maxEnergy:100}},s=[0,3e3,15e3,5e4,15e4,1/0],l=document.getElementById("gameCanvas").getContext("2d");class d{constructor(e){null!=e.g?(this.gameId=e.g,this.name=e.n,this.size=e.s,this.id=e.g,this.element=e.e,this.x=1/0,this.y=1/0,this.serverX=1/0,this.serverY=1/0,this.middleX=1/0,this.middleY=1/0,this.chatMessage=e.m||"",this.chatDeletion=!1,""!=this.chatMessage?this.chatOpacity=1:this.chatOpacity=0,l.font="20px Arial",this.name=r(l,this.name,300),l.font="25px Arial",this.shortName=r(l,this.name,160)):(this.xp=e.xp,this.toFov=1,this.name=e.name,this.x=e.x,this.y=e.y,this.serverX=e.x,this.serverY=e.y,this.middleX=e.x,this.middleY=e.y,this.gameId=e.gameId,this.fov=e.fov,this.element=e.element,this.size=e.size,this.energy=100,this.midenergy=100,this.svrenergy=100,this.chatMessage="",this.chatOpacity=0,this.chatDeletion=!1,this.maxEnergy=100,this.slots=["farm","basic","heal"],this.hp=100,this.midhp=100,this.svrhp=100,this.maxHP=100,this.id=e.gameId,l.font="25px Arial",this.shortName=r(l,this.name,160),this.redFlash=0)}updatePack(e){null!=e.sp&&(this.spawnProt=e.sp),null!=e.x&&(this.serverX=e.x),null!=e.y&&(this.serverY=e.y),null!=e.xp&&(this.xp=e.xp),null!=e.isd&&(this.redFlash=1),null!=e.fov&&(this.toFov=e.fov),null!=e.el&&(this.element=i[e.el],this.toFov=a[this.element].fov,this.maxHP=a[this.element].maxHP,this.maxEnergy=a[this.element].maxEnergy,this.slots=a[this.element].towers),0===e.ip&&(this.x=this.serverX,this.y=this.serverY,this.middleX=this.x,this.middleY=this.y),-1===e.ip&&(this.x=1/0,this.y=1/0,this.serverX=1/0,this.serverY=1/0,this.middleX=1/0,this.middleY=1/0,this.spawnProt=0)}}const c={farm:0,basic:1,heal:2,bomb:3,propel:4,streamer:5,drown:6,splinter:7,observatory:8},h={0:"farm",1:"basic",2:"heal",3:"bomb",4:"propel",5:"streamer",6:"drown",7:"splinter",8:"observatory"};class u{constructor(e){this.x=e.x,this.y=e.y,this.type=h[e.tt],this.size=e.s,this.dir=e.d,this.id=e.id,this.parentId=e.pi,this.hp=e.hp,this.maxHP=e.mh,this.size=e.s,null!=e.ar?(this.auraRadius=e.ar,this.auraDir=0):this.auraRadius=0}updatePack(e){null!=e.d&&(this.dir=e.d),null!=e.hp&&(this.hp=e.hp)}}let y={0:"basic",1:"bomb",2:"water",3:"splinter"};class p{constructor(e){this.x=e.x,this.y=e.y,this.id=e.id,this.type=y[e.t],this.size=e.s,this.parentId=e.pi,this.midX=this.x,this.midY=this.y,this.serverX=this.x,this.serverY=this.y,this.opacity=1,this.lastX=this.serverX,this.lastY=this.serverY,this.baseSize=this.size}updatePack(e){e.s&&(this.size=e.s),this.lastX=this.serverX,this.lastY=this.serverY,this.serverX=e.x,this.serverY=e.y}}const g={farm:{energy:30},basic:{energy:35},heal:{energy:40},bomb:{energy:65},propel:{energy:35},streamer:{energy:60},drown:{energy:25},splinter:{energy:40},observatory:{energy:70,size:60}};function b(e,t,n,o,r,i,a){let s=o-t,l=r-n;i>s/2&&(i=s/2),i>l/2&&(i=l/2),e.beginPath(),e.moveTo(o-i,n),e.quadraticCurveTo(o,n,o,n+i),e.lineTo(o,r-i),e.quadraticCurveTo(o,r,o-i,r),e.lineTo(t+i,r),e.quadraticCurveTo(t,r,t,r-i),e.lineTo(t,n+i),e.quadraticCurveTo(t,n,t+i,n),e.closePath(),e.fillStyle=a,e.fill()}function m(e){let t=new Image;return t.src=e,t}const f={farm:"Slowly gives XP",basic:"Shoots at things",heal:"Heals in a radius",bomb:"Shoots bombs at things",propel:"Propels you upon contact",streamer:"Rapidly shoots water",drown:"Slows down others",splinter:"Shoots seeds which bloom",observatory:"Gives you more vision"},x={basic:m("../../assets/elements/element_basic.svg"),fire:m("../../assets/elements/element_fire.svg"),water:m("../../assets/elements/element_water.svg"),earth:m("../../assets/elements/element_earth.svg"),magma:m("../../assets/elements/element_magma.svg")};function w(e){return e.charAt(0).toUpperCase()+e.slice(1)}const v={basic:{yellow:m("../../assets/bullets/basic_yellow.svg"),red:m("../../assets/bullets/basic_red.svg")},bomb:{yellow:m("../../assets/bullets/basic_yellow.svg"),red:m("../../assets/bullets/basic_red.svg")},water:{yellow:m("../../assets/bullets/water_blue.svg"),red:m("../../assets/bullets/basic_red.svg")},splinter:{yellow:m("../../assets/bullets/splinter_green.svg"),red:m("../../assets/bullets/basic_red.svg")}},k={farm:{yellow:m("../../assets/towers/tower_farm_yellow.svg"),red:m("../../assets/towers/tower_farm_red.svg")},basic:{yellow:m("../../assets/towers/tower_basic_yellow.svg"),red:m("../../assets/towers/tower_basic_red.svg")},heal:{yellow:m("../../assets/towers/tower_heal_yellow.svg"),red:m("../../assets/towers/tower_heal_red.svg")},bomb:{yellow:m("../../assets/towers/tower_bomb_yellow.svg"),red:m("../../assets/towers/tower_bomb_red.svg")},propel:{yellow:m("../../assets/towers/tower_propel_yellow.svg"),red:m("../../assets/towers/tower_propel_red.svg")},streamer:{yellow:m("../../assets/towers/tower_streamer_yellow.svg"),red:m("../../assets/towers/tower_streamer_red.svg")},drown:{yellow:m("../../assets/towers/tower_drown_yellow.svg"),red:m("../../assets/towers/tower_drown_red.svg")},splinter:{yellow:m("../../assets/towers/tower_splinter_yellow.svg"),red:m("../../assets/towers/tower_splinter_red.svg")},observatory:{yellow:m("../../assets/towers/tower_observatory_yellow.svg"),red:m("../../assets/towers/tower_observatory_red.svg")}},S={energy:m("../../assets/icons/logo_energy.svg"),health:m("../../assets/icons/logo_health.svg")},z=30;function T(e,t,n){return e*(1-n)+t*n}const A=document.getElementById("gameCanvas"),E=document.getElementById("chatHolder"),I=document.getElementById("chatBox");let P=!1;function _(e,n){const o=document.getElementById("server-selection"),r=document.getElementById("game"),i=document.getElementById("gameCanvas"),l=i.getContext("2d");let h=window.performance.now(),y={x:0,y:0};window.onbeforeunload=e=>"",o.style.display="none",r.style.display="";const m={arenaWidth:e.aW,arenaHeight:e.aH,players:{},towers:{},bullets:{},you:new d(e.s)};let _=!1,M=!1,H=!0,O=[],Y=[],B=0;for(let t of e.pd)m.players[t.g]=new d(t);function R(e){let t=window.performance.now()-h;h=window.performance.now(),0!=_&&(H=function(e,t,n){let o=JSON.parse(JSON.stringify(e.players));o[e.you.gameId]=JSON.parse(JSON.stringify(e.you));let r={x:0,y:0};r.x=(t.x-A.width/2)/e.you.fov+e.you.x,r.y=(t.y-A.height/2)/e.you.fov+e.you.y;let i=g[n].size||40;for(let e of Object.keys(o)){const t=o[e];if(Math.sqrt(Math.pow(r.x-t.x,2)+Math.pow(r.y-t.y,2))<i+t.size)return!1}for(let t of Object.keys(e.towers)){const n=e.towers[t];if(Math.sqrt(Math.pow(r.x-n.x,2)+Math.pow(r.y-n.y,2))<n.size/2+i)return!1}return!(r.x<i||r.y<i||r.x>e.arenaWidth-i||r.y>e.arenaHeight-i||e.you.energy<g[n].energy||Math.sqrt(Math.pow(r.x-e.you.x,2)+Math.pow(r.y-e.you.y,2))>400)}(e,y,_)),Y=Y.filter((e=>e.timer>0));for(let e of Y)e.timer-=t/1e3;e.you.fov+=(e.you.toFov-e.you.fov)/20,1==e.you.dead&&(B+=(.5-B)/20),function(e,t,n,o,r,i,l,d,c){t.fillStyle="rgb(180, 180, 180)",t.fillRect(0,0,n.width,n.height),t.scale(e.you.fov,e.you.fov),t.translate(-e.you.x+n.width/2*1/e.you.fov,-e.you.y+n.height/2*1/e.you.fov);let h=JSON.parse(JSON.stringify(e.players));h[e.you.gameId]=JSON.parse(JSON.stringify(e.you)),t.fillStyle="rgb(0, 0, 0)",t.fillRect(-10,-10,e.arenaWidth+20,e.arenaHeight+20),t.fillStyle="rgb(200, 200, 200)",t.fillRect(0,0,e.arenaWidth,e.arenaHeight);let u=500;t.strokeStyle="rgb(180, 180, 180)",t.lineWidth=5;for(let n=1;n<e.arenaHeight/u;n++)t.beginPath(),t.moveTo(0,u*n),t.lineTo(e.arenaWidth,u*n),t.stroke();for(let n=1;n<e.arenaWidth/u;n++)t.beginPath(),t.moveTo(u*n,0),t.lineTo(u*n,e.arenaHeight),t.stroke();for(let o of Object.keys(e.towers)){const r=e.towers[o];t.lineWidth=3,0!=r.auraRadius&&null!=r.x&&null!=r.y&&r.x>e.you.x-n.width/2*1/e.you.fov-100-r.auraRadius&&r.x<e.you.x+n.width/2*1/e.you.fov+100+r.auraRadius&&r.y>e.you.y-n.height/2*1/e.you.fov-120-r.auraRadius&&r.y<e.you.y+n.height/2*1/e.you.fov+120+r.auraRadius&&(r.parentId!=e.you.id?(t.translate(r.x,r.y),t.rotate(r.auraDir),"heal"===r.type&&(t.globalAlpha=.3,t.fillStyle="#e08080"),"drown"===r.type&&(t.globalAlpha=.4,t.fillStyle="#34568c"),t.beginPath(),t.arc(0,0,r.auraRadius,0,2*Math.PI),t.fill(),t.globalAlpha=1,t.setLineDash([10,15]),"heal"===r.type&&(t.strokeStyle="#ff0000"),"drown"===r.type&&(t.strokeStyle="#002fba"),t.beginPath(),t.arc(0,0,r.auraRadius,0,2*Math.PI),t.stroke(),t.setLineDash([]),t.rotate(-r.auraDir),t.translate(-r.x,-r.y),r.auraDir+=1/160):(t.translate(r.x,r.y),t.rotate(r.auraDir),"heal"===r.type&&(t.globalAlpha=.3,t.fillStyle="#c4bd72"),"drown"===r.type&&(t.globalAlpha=.2,t.fillStyle="#5c8fe0"),t.beginPath(),t.arc(0,0,r.auraRadius,0,2*Math.PI),t.fill(),t.globalAlpha=1,t.setLineDash([10,15]),"heal"===r.type&&(t.strokeStyle="#a6ad1f"),"drown"===r.type&&(t.strokeStyle="#2e4870"),t.beginPath(),t.arc(0,0,r.auraRadius,0,2*Math.PI),t.stroke(),t.setLineDash([]),t.rotate(-r.auraDir),t.translate(-r.x,-r.y),r.auraDir+=1/160))}for(let n of Object.keys(e.bullets)){const o=e.bullets[n];let r=o.opacity;"bomb"===o.type&&(r/=o.size/o.baseSize),t.globalAlpha=r,o.parentId!=e.you.id?t.drawImage(v[o.type].red,o.x-o.size,o.y-o.size,2*o.size,2*o.size):t.drawImage(v[o.type].yellow,o.x-o.size,o.y-o.size,2*o.size,2*o.size)}t.globalAlpha=1,t.lineCap="round";for(let o of Object.keys(e.towers)){const r=e.towers[o];null!=r.x&&null!=r.y&&r.x>e.you.x-n.width/2*1/e.you.fov-100-r.auraRadius&&r.x<e.you.x+n.width/2*1/e.you.fov+100+r.auraRadius&&r.y>e.you.y-n.height/2*1/e.you.fov-120-r.auraRadius&&r.y<e.you.y+n.height/2*1/e.you.fov+120+r.auraRadius&&(r.parentId!=e.you.id?(t.translate(r.x,r.y),t.rotate(r.dir),t.drawImage(k[r.type].red,-r.size,-r.size,2*r.size,2*r.size),t.rotate(-r.dir),t.translate(-r.x,-r.y),t.lineWidth=10,t.strokeStyle="#000000",t.beginPath(),t.moveTo(r.x-r.size/2,r.y+r.size/2+10),t.lineTo(r.x+r.size/2,r.y+r.size/2+10),t.stroke(),t.lineWidth=8,t.strokeStyle="#a65033",t.beginPath(),t.moveTo(r.x-r.size/2,r.y+r.size/2+10),t.lineTo(r.x-r.size/2+r.size*r.hp/r.maxHP,r.y+r.size/2+10),t.stroke()):(t.translate(r.x,r.y),t.rotate(r.dir),t.drawImage(k[r.type].yellow,-r.size,-r.size,2*r.size,2*r.size),t.rotate(-r.dir),t.translate(-r.x,-r.y),t.lineWidth=10,t.strokeStyle="#000000",t.beginPath(),t.moveTo(r.x-r.size/2,r.y+r.size/2+10),t.lineTo(r.x+r.size/2,r.y+r.size/2+10),t.stroke(),t.lineWidth=8,t.strokeStyle="#45a633",t.beginPath(),t.moveTo(r.x-r.size/2,r.y+r.size/2+10),t.lineTo(r.x-r.size/2+r.size*r.hp/r.maxHP,r.y+r.size/2+10),t.stroke()))}t.fillStyle="rgb(0, 0, 0)",t.font="20px Arial";for(let n of Object.keys(h)){const o=h[n];if(null!=o.x&&null!=o.y&&(1!=e.you.dead||n!=e.you.id)){1==o.spawnProt?t.globalAlpha=.4:t.globalAlpha=1,t.drawImage(x[o.element],o.x-o.size,o.y-o.size,2*o.size,2*o.size),t.fillStyle="rgb(0, 0, 0)",t.font="20px Arial",t.fillText(o.name,o.x,o.y+o.size+15),t.globalAlpha=1,o.redFlash>0&&(t.globalAlpha=o.redFlash/1.5,t.fillStyle="rgb(200, 0, 0)",t.beginPath(),t.arc(o.x,o.y,o.size,0,2*Math.PI),t.fill(),t.globalAlpha=1),t.globalAlpha=o.chatOpacity,t.font="25px Arial";let e=t.measureText(o.chatMessage).width;b(t,o.x-e/2-5,o.y-o.size-33,o.x+e/2+5,o.y-o.size-4,3,"rgba(60, 60, 60)"),t.fillStyle="white",t.fillText(o.chatMessage,o.x,o.y-o.size-11),t.globalAlpha=1}}if(t.translate(-(-e.you.x+n.width/2*1/e.you.fov),-(-e.you.y+n.height/2*1/e.you.fov)),t.scale(1/e.you.fov,1/e.you.fov),1!=e.you.dead){t.textAlign="center",t.lineWidth=25,t.lineCap="round",t.beginPath(),t.strokeStyle="rgb(0, 0, 0)",t.moveTo(450,780),t.lineTo(1200,780),t.stroke(),t.beginPath(),t.lineWidth=20,t.strokeStyle="#e7cc47",t.moveTo(450,780),t.lineTo(1200-750*(1-e.you.energy/e.you.maxEnergy),780),t.stroke(),t.drawImage(S.energy,360,730,95,95),t.textAlign="center",t.lineWidth=25,t.lineCap="round",t.beginPath(),t.strokeStyle="rgb(0, 0, 0)",t.moveTo(450,740),t.lineTo(800,740),t.stroke(),t.beginPath(),t.lineWidth=20,t.strokeStyle="#ca3e2c",t.moveTo(450,740),t.lineTo(800-350*(1-e.you.hp/e.you.maxHP),740),t.stroke(),t.drawImage(S.health,360,690,95,95),t.fillStyle="rgba(0, 0, 0, 0.4)",t.fillRect(30,30,310,40*(l.length+1)+13),t.textAlign="left",t.font="28px Arial",t.fillStyle="rgb(255, 255, 255)",t.fillText("Leaderboard",45,64),t.font="25px Arial";for(let n of l){if(n.id!=e.you.id){try{n.name=e.players[n.id].shortName}catch(e){}t.fillStyle="rgb(220, 220, 220)"}else{try{n.name=e.you.shortName}catch(e){}t.fillStyle="#f0ee92"}t.fillText(n.place+". "+n.name+": "+n.xp,45,104+40*l.indexOf(n))}t.textAlign="center",t.lineCap="butt";let n=e.you.slots,d=n.length,c=n.length-1;for(let o=0;o<d;o++){let i=800-c/2*100+100*o;t.globalAlpha=.3,t.fillStyle="rgb(0, 0, 0)",t.fillRect(i-40,800,80,80),t.globalAlpha=1,t.drawImage(k[n[o]].yellow,i-60,780,120,120),t.font="16px Arial",t.fillStyle="rgb(0, 0, 0)",t.fillText(o+1,i-31,872),r.x>i-40&&r.x<i+40&&r.y>800&&r.y<880&&(t.globalAlpha=.7,t.font="19px Arial",t.fillRect(i-120,660,240,130),t.globalAlpha=1,t.fillStyle="rgb(240, 240, 240)",t.font="bold 32px Arial",t.fillText(w(n[o]),i,710),t.font="19px Arial",t.fillText(f[n[o]],i,735),t.font="13px Arial",t.fillText("Energy Required",i,760),t.lineCap="round",t.lineWidth=10,t.strokeStyle="rgb(140, 140, 140)",t.beginPath(),t.moveTo(i-112,772),t.lineTo(i+112,772),t.stroke(),t.lineWidth=8,t.strokeStyle="#e7cc47",t.beginPath(),t.moveTo(i-112,772),t.lineTo(i-112+g[n[o]].energy/e.you.maxEnergy*226,772),t.stroke())}if(t.fillStyle="rgb(0, 0, 0)",t.globalAlpha=.2,t.fillRect(20,680,200,200),t.beginPath(),t.fillStyle="rgb(255, 0, 0)",t.globalAlpha=.5,t.arc(20+200*e.you.x/e.arenaWidth,680+200*e.you.y/e.arenaHeight,5,0,2*Math.PI),t.fill(),t.globalAlpha=1,0!=o){t.globalAlpha=.4;let n=g[o].size||40;t.drawImage(k[o].yellow,r.x-2*n*e.you.fov,r.y-2*n*e.you.fov,4*n*e.you.fov,4*n*e.you.fov),!1===i&&(t.globalAlpha=.3,t.beginPath(),t.fillStyle="rgb(255, 0, 0)",t.arc(r.x,r.y,n*e.you.fov,0,2*Math.PI),t.fill()),t.globalAlpha=.1,t.beginPath(),t.fillStyle="rgb(0, 0, 0)",t.arc(800,450,400*e.you.fov,0,2*Math.PI),t.fill(),t.globalAlpha=1}let h=0;for(;!(h>=s.length||e.you.xp<s[h+1]);)h++;let u=s[h],y=s[h+1],p=e.you.xp-u,b=y-u;if(t.lineCap="round",t.beginPath(),t.strokeStyle="rgb(0, 0, 0)",t.lineWidth=20,t.moveTo(1550,100),t.lineTo(1550,800),t.stroke(),t.beginPath(),t.strokeStyle="#42c2f5",t.lineWidth=16,t.moveTo(1550,800-p/b*700),t.lineTo(1550,800),t.stroke(),h>=a[e.you.element].tier){t.font="bold 40px Arial",t.fillStyle="rgb(0, 0, 0)",t.fillText("Choose Your Element",800,65);let n=a[e.you.element].upgrades,o=n.length,i=n.length-1;for(let e=0;e<o;e++){let o=800-i/2*120+120*e;t.fillStyle=n[e].color,t.globalAlpha=.4,t.fillRect(o-50,100,100,100),t.globalAlpha=1,t.font="bold 30px Arial",t.fillText(w(n[e].name),o,160),t.globalAlpha=.5,t.fillStyle="rgb(0, 0, 0)",t.fillText(w(n[e].name),o,160),r.x>o-50&&r.x<o+50&&r.y>100&&r.y<200&&(t.globalAlpha=.1,t.fillStyle="rgb(255, 255, 255)",t.fillRect(o-50,100,100,100)),t.globalAlpha=1}}}e.you.dead&&(t.globalAlpha=c,t.fillStyle="rgb(0, 0, 0)",t.fillRect(0,0,1600,900),t.globalAlpha=2*c,t.font="60px Arial",t.fillStyle="rgb(240, 240, 240)",t.fillText("You were killed by "+e.you.killer,800,300),t.fillStyle="rgb(230, 230, 230)",t.font="40px Arial",t.fillText("Final score: "+e.you.finalScore,800,620),t.fillStyle="rgb(240, 240, 240)",t.font="50px Arial",t.fillText("[ Space to Respawn ]",800,740),t.globalAlpha=1);for(let e in d){const n=d[e];t.globalAlpha=Math.max(Math.min(2*n.timer,1),0),t.font="35px Arial";let o=t.measureText(n.value).width;t.fillStyle="rgb(50, 50, 50)",t.fillRect(800-o/2-8,40+50*e,o+16,40),t.fillStyle="rgb(230, 230, 230)",t.fillText(n.value,800,70+50*e),t.globalAlpha=1}}(e,l,i,_,y,H,O,Y,B),function(e,t,n){for(let t of Object.keys(e.bullets)){const n=e.bullets[t];n.opacity<1&&(n.opacity-=.08,n.size+=.5,n.serverX+=n.dx/z,n.serverY+=n.dy/z),n.opacity<0&&delete e.bullets[t]}for(let n of Object.keys(e.players)){const o=e.players[n];o.x=T(o.x,o.middleX,t/1e3*z),o.y=T(o.y,o.middleY,t/1e3*z),o.middleX=T(o.middleX,o.serverX,t/1e3*z),o.middleY=T(o.middleY,o.serverY,t/1e3*z),o.redFlash+=(-.1-o.redFlash)/20,!0===o.chatDeletion&&(o.chatOpacity-=.08,o.chatOpacity<0&&(o.chatOpacity=0))}{const n=e.you;n.x=T(n.x,n.middleX,t/1e3*z),n.y=T(n.y,n.middleY,t/1e3*z),n.middleX=T(n.middleX,n.serverX,t/1e3*z),n.middleY=T(n.middleY,n.serverY,t/1e3*z),n.hp=T(n.hp,n.midhp,t/1e3*z),n.midhp=T(n.midhp,n.svrhp,t/1e3*z),n.energy=T(n.energy,n.midenergy,t/1e3*z),n.midenergy=T(n.midenergy,n.svrenergy,t/1e3*z),n.energy>n.maxEnergy&&(n.energy=n.maxEnergy),n.hp>n.maxHP&&(n.hp=n.maxHP),n.redFlash+=(-.1-n.redFlash)/20,!0===n.chatDeletion&&(n.chatOpacity-=.08,n.chatOpacity<0&&(n.chatOpacity=0))}for(let n of Object.keys(e.bullets)){const o=e.bullets[n];o.x=T(o.x,o.midX,t/1e3*z),o.y=T(o.y,o.midY,t/1e3*z),o.midX=T(o.x,o.serverX,t/1e3*z),o.midY=T(o.y,o.serverY,t/1e3*z)}}(e,t),requestAnimationFrame((()=>{R(e)}))}i.addEventListener("mousemove",(function(e){window.innerWidth,window.innerHeight;let t=window.innerWidth/i.width;window.innerHeight/i.height<window.innerWidth/i.width&&(t=window.innerHeight/i.height);const n=i.getBoundingClientRect();y.x=Math.round((e.clientX-n.left)/t),y.y=Math.round((e.clientY-n.top)/t)})),i.addEventListener("mousedown",(function(e){if(!1===M){if(0!=_&&1==H){const e={t:"pt",mx:y.x,my:y.y,tt:c[_]};t(n.ws,e),_=!1}let e=0;for(;!(e>=s.length||m.you.xp<s[e+1]);)e++;if(e>=a[m.you.element].tier){let e=a[m.you.element].upgrades,o=e.length,r=e.length-1;for(let e=0;e<o;e++){let o=800-r/2*120+120*e;if(y.x>o-50&&y.x<o+50&&y.y>100&&y.y<200){const o={t:"upg",c:e};t(n.ws,o)}}}}M=!0})),i.addEventListener("mouseup",(function(e){M=!1})),document.onkeydown=e=>{if(!e.repeat){if(1!=m.you.dead){if(" "===e.key&&0!=_&&1==H){const e={t:"pt",mx:y.x,my:y.y,tt:c[_]};t(n.ws,e),_=!1}for(let t=m.you.slots.length;t>0;t--)String(e.key)===String(t)&&(_=_!=m.you.slots[Number(e.key)-1]&&m.you.slots[Number(e.key)-1]);if("Enter"===e.key)if(!1===P)E.style.display="block",I.focus(),P=!0;else{if(E.style.display="none",I.blur(),/^\s*$/.test(I.value))I.value="";else{const e={t:"ch",m:I.value};t(n.ws,e),I.value=""}P=!1}}else" "===e.key&&t(n.ws,{t:"res"});["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","w","a","s","d"].includes(e.key)&&1!=m.you.dead&&!P&&t(n.ws,{t:"kd",c:e.key})}},document.onkeyup=e=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","w","a","s","d"].includes(e.key)&&1!=m.you.dead&&t(n.ws,{t:"ku",c:e.key})},n.ws.onclose=()=>{alert("You've been disconnected from the server!")},n.ws.onmessage=e=>{let t=msgpack.decode(new Uint8Array(e.data));switch(t.t){case"npj":m.players[t.i.g]=new d(t.i);break;case"res":m.you.dead=!1,m.you.xp=t.s,m.you.element="basic",B=0,m.you.fov=1,m.you.toFov=1,m.you.maxHP=100,m.you.maxEnergy=100,m.you.slots=a.basic.towers;break;case"u":for(let e of t.p)null!=m.players[e.g]?m.players[e.g].updatePack(e):m.you.gameId===e.g&&m.you.updatePack(e);for(let e of t.tp)null!=e.pi?m.towers[e.id]=new u(e):m.towers[e.id].updatePack(e);for(let e of t.bp)null!=e.pi?m.bullets[e.i]=new p(e):1!=e.rem?m.bullets[e.i].updatePack(e):delete m.bullets[e.i];null!=t.e&&(m.you.svrenergy=t.e),null!=t.h&&(m.you.svrhp=t.h),null!=t.xp&&(m.you.xp=t.xp);break;case"pl":delete m.players[t.g];break;case"ntp":m.towers[t.d.id]=new u(t.d);break;case"rt":delete m.towers[t.id];break;case"rb":m.bullets[t.i].opacity=.999,m.bullets[t.i].dx=m.bullets[t.i].serverX-m.bullets[t.i].lastX,m.bullets[t.i].dy=m.bullets[t.i].serverY-m.bullets[t.i].lastY,m.bullets[t.i].serverX=t.x,m.bullets[t.i].serverY=t.y;break;case"yd":m.you.dead=!0,m.you.killer=t.n,m.you.finalScore=t.s,_=!1,B=0,E.style.display="none",I.blur(),I.value="";break;case"pd":delete m.players[t.i];break;case"ykp":Y.push({value:"You killed "+t.n,timer:4});break;case"lb":O=t.lb;break;case"dch":null!=m.players[t.i]&&(m.players[t.i].chatDeletion=!0),t.i===m.you.id&&(m.you.chatDeletion=!0);break;case"ch":null!=m.players[t.i]&&(m.players[t.i].chatMessage=t.m,m.players[t.i].chatOpacity=1,m.players[t.i].chatDeletion=!1),t.i===m.you.id&&(m.you.chatMessage=t.m,m.you.chatOpacity=1,m.you.chatDeletion=!1);break;case"chf":Y.push({value:"You are chatting too fast!",timer:4})}},requestAnimationFrame((()=>{R(m)}))}function M(e){document.onkeydown=()=>{},document.onkeyup=()=>{};const n=document.getElementById("menu"),o=document.getElementById("server-selection");t(e.ws,{t:"ss"}),e.ws.onmessage=t=>{let r=msgpack.decode(new Uint8Array(t.data));try{switch(r.t){case"ssr":{n.style.display="none",o.style.display="flex";const t=document.getElementById("serverSelectionData");t.innerHTML="";for(let e=r.d.length;e--;e>0){const n=r.d[e];t.innerHTML+=`\n            <button id="${n.id}" class="server-card">\n\t\t\t\t      ${n.title}\n\t\t\t      </button>\n            `}const i=document.querySelectorAll(".server-card");for(let t of i)t.addEventListener("click",(()=>{H(e,t.id)}))}}}catch(e){console.log("bug with server selection response: "+e)}}}function H(e,n){t(e.ws,{t:"js",id:n,n:document.getElementById("usernameInput").value}),e.ws.onmessage=t=>{try{let n=msgpack.decode(new Uint8Array(t.data));switch(n.t){case"jsf":switch(n.m){case"sf":o("Server full!");break;case"ns":o("Server closed!")}M(e);break;case"jss":_(n,e)}}catch{}};const r=document.querySelectorAll(".server-card");for(let e of r)e.style.pointerEvents="none"}n(986);const O=n(419);(()=>{const e=document.getElementById("gameCanvas");O(e),window.onload=function(){window.addEventListener("resize",O.bind(null,e)),O(e)}})(),"https:"!==location.protocol&&location.replace(`https:${location.href.substring(location.protocol.length)}`),function(){const t=location.origin.replace(/^http/,"ws"),n=new WebSocket(t),r=new e(n);n.binaryType="arraybuffer";const i=document.getElementById("loading-screen"),a=document.getElementById("menu");document.getElementById("game"),n.onopen=()=>{i.classList.add("fade"),function(e,t){let n=function(){const e={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};let t=document.body.style;for(let n in e)if(null!=t[n])return e[n]}();e.addEventListener(n,t)}(i,(()=>{i.style.display="none",a.style.display="flex",function(e){e.ws.onopen=()=>{};const t=document.getElementById("playButton"),n=document.getElementById("menu"),o=document.getElementById("tutorial");t.style.pointerEvents="auto",t.addEventListener("click",(()=>{t.style.pointerEvents="none",t.innerHTML='<div class="loader2" style="" id="playLoader"></div>',M(e)})),document.getElementById("tutorialButton").addEventListener("click",(()=>{n.style.display="none",o.style.display="",t.style.pointerEvents="none"})),document.getElementById("backToMenu").addEventListener("click",(()=>{n.style.display="",o.style.display="none",t.style.pointerEvents="auto"}))}(r)}))},n.onclose=()=>{o("Disconnected from Server")},n.onerror=e=>{o(e)}}()})()})();