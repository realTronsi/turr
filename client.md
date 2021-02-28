its mostly handled in the firsst, like, 140 lines of render.js
just add the sprites
and if u want to add towers and elements go to the "utils" folder
almost every file there is changed when a new element is added
when a new bullet type is added go to bullet.js

in the beginning of render.js make sure to add a sprite for each new element/tower/bullet and link it up to the correct element/tower/bullet, or else it will crash

game.js = controls messages from server
render.js = renders stuff
update.js = interpolation

make sure to change elementcast towercast on server side too, and bullet cast (Which is in objects.js) and make sure they match

make sure to update game/utils/energyStats.js on client side for how much energy each tower costs or else its gonna be weird

same with game/utils/tierList.js which is for element upgrades and element stats and which towers can be placed by which elements