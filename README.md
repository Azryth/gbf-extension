# GBF Logger #

### What ###

* Chrome GBF extension that logs damage and DATA rates

### How to set up ###

* Enable Developer mode on Chrome
* Load unpacked extensions
* select folder

### How to use ###

* Open Chrome Devtools
* Switch to GBF stats tab

### Usage Notes ###

* The game only sends character names when it loads the battle (i.e. when you enter for the first time or refresh the page). So, for the logger to display the names if you opened it in battle, refreash the page. Same goes for RaidID.
* I don't know how the game updates boss hp when you're not doing anything so it only updates when you attack/ use skills / use summons.
* Damage per second only updates when attacking / using skills / using summons when the timer is running.
* Click on Turns/Characters/Attacks in the battlelog to see additional details.

### TODO list ###

* There is currently a bug where backrow character's damage is not logged properly
* Extra damage from summons are not logged yet
* Show if debuffs hit/miss (will get complicated)
* Saving data