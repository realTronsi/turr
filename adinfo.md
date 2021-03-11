Displaying Video Ads
Create a container to display the Video Ad
```javascript
<div id="preroll"></div>Initialize the Video player, this should be done only once per page load.
aiptag.cmd.player.push(function() {
	aiptag.adplayer = new aipPlayer({
		AD_WIDTH: 960,
		AD_HEIGHT: 540,
		AD_FULLSCREEN: false,
		AD_CENTERPLAYER: false,
		LOADING_TEXT: 'loading advertisement',
		PREROLL_ELEM: function(){return document.getElementById('preroll')},
		AIP_COMPLETE: function (evt)  {
			/*******************
			 ***** WARNING *****
			 *******************
			 Please do not remove the PREROLL_ELEM
			 from the page, it will be hidden automaticly.
			 If you do want to remove it use the AIP_REMOVE callback.
			*/
			console.log("Preroll Ad Completed: " + evt);
		},
		AIP_REMOVE: function ()  {
			// Here it's safe to remove the PREROLL_ELEM from the page if you want. But it's not recommend.
		}
	});
});Show the Video Ad
//check if the adslib is loaded correctly or blocked by adblockers etc.
if (typeof aiptag.adplayer !== 'undefined') {
	aiptag.cmd.player.push(function() { aiptag.adplayer.startPreRoll(); });
} else {
	//Adlib didnt load this could be due to an adblocker, timeout etc.
	//Please add your script here that starts the content, this usually is the same script as added in AIP_COMPLETE or AIP_REMOVE.
	console.log("Ad Could not be loaded, load your content here");
}
Displaying Rewarded Ads
Add the following functions to the aipPlayer initialisation.
AIP_REWARDEDCOMPLETE: function (evt)  {
	//evt can be: timeout, empty or closed
	console.log("Rewarded Ad Completed: " + evt);
},
AIP_REWARDEDGRANTED: function ()  {
	console.log("Reward Granted");
}like this
aiptag.cmd.player.push(function() {
	aiptag.adplayer = new aipPlayer({
		AIP_REWARDEDCOMPLETE: function (evt)  {
			//evt can be: timeout, empty or closed
			console.log("Rewarded Ad Completed: " + evt);
		},
		AIP_REWARDEDGRANTED: function ()  {
			console.log("Reward Granted");
		},
		AD_WIDTH: 960,
		AD_HEIGHT: 540,
		AD_FULLSCREEN: false,
		AD_CENTERPLAYER: false,
		LOADING_TEXT: 'loading advertisement',
		PREROLL_ELEM: function(){return document.getElementById('preroll')},
		AIP_COMPLETE: function ()  {
			/*******************
			 ***** WARNING *****
			 *******************
			 Please do not remove the PREROLL_ELEM
			 from the page, it will be hidden automaticly.
			 If you do want to remove it use the AIP_REMOVE callback.
			*/
			console.log("Ad Completed, load your content here");
		},
		AIP_REMOVE: function ()  {
			// Here it's save to remove the PREROLL_ELEM from the page if you want. But it's not recommend.
		}
	});
});Show the Rewarded Ad
//check if the adslib is loaded correctly or blocked by adblockers etc.
if (typeof aiptag.adplayer !== 'undefined') {
	aiptag.cmd.player.push(function() { aiptag.adplayer.startRewardedAd(); });
} else {
	//Adlib didnt load this could be due to an adblocker, timeout etc.
	//Please add your script here that starts the content, this usually is the same script as added in AIP_REWARDEDCOMPLETE.
	console.log("Rewarded Ad Could not be loaded, load your content here");
}
```