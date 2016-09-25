# GBF Logger #
![Sneak peak](https://github.com/Azryth/gbf-extension/blob/images/images/damageLogger.PNG?raw=true "Sneak Peak")
### What ###

* This is a chrome GBF extension that logs damage and DATA rates
* It simply reads out information the server sends to your browser and formats it
* It does not request any information from the server
* Use it to measure the damage output of your setups
* Or use it to log DA/TA rates of your team members
* This is a work in progress, so watch out for errors and bugs

### How to set up ###

* Go to Chrome Extensions

![Chrome Extensions](https://github.com/Azryth/gbf-extension/blob/images/images/chromeExtensions.PNG?raw=true "Chrome Extensions")

* Enable Developer mode on Chrome

![Enable Devmode](https://github.com/Azryth/gbf-extension/blob/images/images/extensionsDevmode.PNG?raw=true "Enable Devmode")
* Load unpacked extensions

![Load Extension](https://github.com/Azryth/gbf-extension/blob/images/images/loadExtension.PNG?raw=true "Load Extension")
* select the folder the extension is located in

### How to use ###

* Open Chrome Devtools

![Open Devtools](https://github.com/Azryth/gbf-extension/blob/images/images/devtools.PNG?raw=true "Open Devtools")
* Switch to GBF stats tab

![Switch Tabs](https://github.com/Azryth/gbf-extension/blob/images/images/devtoolsTab.PNG?raw=true "Switch Tabs")
### Feedback ###

If you would like to leave some feedback (bugs, opinion, whatever), use this [form](https://docs.google.com/forms/d/e/1FAIpQLSfhruGYJ6cnb4V8rY85WR3LYyJOs0cfIISMhzttRWSdJ8BkuA/viewform)

For bugs, it'd be cool if you could open an issue on this github so it's easier to keep it organized.

### Usage Notes ###

* The game only sends character names when it loads the battle (i.e. when you enter for the first time or refresh the page). So, for the logger to display the names if you opened it in battle, refreash the page. Same goes for RaidID.
* I don't know how the game updates boss hp when you're not doing anything so it only updates when you attack/ use skills / use summons.
* Click on Turns/Characters/Attacks in the battlelog to see additional details.

### TODO list ###

* Lots of testing
* Extra damage from summons are not logged yet
* Show if debuffs hit/miss (will get complicated)
* Refactoring