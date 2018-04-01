function updateStatistics() {
    var time = elapsed_seconds;
    $("#totalDamage").text(displayNumbers(totalDamage));
    $("#totalAttackDamage").text(displayNumbers(totalTurnDamage));
    $("#totalSkillDamage").text(displayNumbers(totalSkillDamage));
    $("#totalChainBurst").text(displayNumbers(totalChainBurstDamage));
    $("#totalSummonDamage").text(displayNumbers(totalSummonDamage));

    if (turnNumber != 0) {
        $("#damageTurn").text(displayNumbers(Math.round(totalDamage / turnNumber)) + " (" + turnNumber + " turns)");
        $("#skillsTurn").text((skillsUsed / turnNumber).toFixed(2) + " (" + skillsUsed + " skills)");
        $("#summonsTurn").text((summonsUsed / turnNumber).toFixed(2) + " (" + summonsUsed + " summons)");
    } else {
        $("#damageTurn").text("0");
        $("#skillsTurn").text("0");
        $("#summonsTurn").text("0");
    }

    updateCharacterInfo();
}

function setBossInfo(info) {
  var boss;
  bossInfo = [];
  for(var i = 0; i < info.number; i++) {
      boss = {
        name : info.param[i].monster,
        lv : info.param[i].Lv,
        maxhp : info.param[i].hpmax,
        hp :info.param[i].hp

      };
      //convenience feature for nightmare angel halo
      if(info.param[i].enemy_id == "6005070") {
        boss.name = info.param[i].monster + " (No Transformation)";
      } else if (info.param[i].enemy_id == "2974050") {
        boss.name = info.param[i].monster + " (Gun)";
      } else if (info.param[i].enemy_id == "2970050") {
        boss.name = info.param[i].monster + " (Fist)";
      } else if (info.param[i].enemy_id == "2968050") {
        boss.name = info.param[i].monster + " (Dagger)";
      } else if (info.param[i].enemy_id == "2967050") {
        boss.name = info.param[i].monster + " (Axe)";
      }
      bossInfo.push(boss);
  }

  updateBossInfo();
}


/*
Clears all boss information and adds the current one
*/
function updateBossInfo() {
    //clear contents
    $("#enemyInfo").html("");

    for (var i = 0; i < bossInfo.length; i++) {
        if ( bossInfo[i] != undefined && bossInfo[i].name != undefined) {
            //current hp + percentage
            var hpString = displayNumbers(bossInfo[i].hp);
            var percentage = (Number(bossInfo[i].hp) / Number(bossInfo[i].maxhp) * 100).toFixed(2);
            hpString += " (" + displayNumbers(percentage) + "%)";

            //update enemy info
            var list = $("<ul>");
            list.append(
              formatLiData(bossInfo[i].name, "", 0, ["flex-container"]),
              formatLiData("Max HP", displayNumbers(bossInfo[i].maxhp), 1, ["flex-container"]),
              formatLiData("HP", hpString, 1, ["flex-container"])
            );
            $("#enemyInfo").append(list);
        }
    }
}

function updateCharacterInfo() {
    //check which infos are hidden
    var isVisible = [];
    $("#characterInfo").children(":nth-child(even)").each(function () {
        isVisible.push($(this).is(":visible"));
    });

    //clear the contents
    $("#characterInfo").html("");

    //add new content
    for (var i = 0; i < characterInfo.length; i++) {

        var avgDmg = "N/A";
        var daRate = "N/A";
        var taRate = "N/A";

        if (characterInfo[i].attacks != 0) {
          avgDmg = (characterInfo[i].attackDamage / (characterInfo[i].attacks)).toFixed(2);
        }
        if ((characterInfo[i].turns - characterInfo[i].tas - characterInfo[i].cas) != 0) {
          daRate = (characterInfo[i].das / (characterInfo[i].turns - characterInfo[i].tas - characterInfo[i].cas) * 100).toFixed(2) + "%";
        }
        if ((characterInfo[i].turns - characterInfo[i].cas) != 0) {
          taRate = (characterInfo[i].tas / (characterInfo[i].turns - characterInfo[i].cas) * 100 ).toFixed(2) + "%";
        }

        var minDmg = (characterInfo[i].minDamage == initMinDamage) ? "N/A" : characterInfo[i].minDamage;
        var maxDmg = (characterInfo[i].maxDamage == 0) ? "N/A" : characterInfo[i].maxDamage;

        var characterTotalDamage = characterInfo[i].skillDamage + characterInfo[i].attackDamage + characterInfo[i].ougiDamage;
        var character = formatLiData("\> " + characterInfo[i].name, displayNumbers(characterTotalDamage), 0, ["flex-container", "toggleable"]);
        $("#characterInfo").append(character);

        var breakdown = $("<div>");
        if(!isVisible[i]) {
            breakdown.hide();
        }

        //turns in combat
        breakdown.append(formatLiData("Turns in combat", displayNumbers(characterInfo[i].turns), 1, ["flex-container"]));
        //attack damage
        breakdown.append(formatLiData("Attack dmg", displayNumbers(characterInfo[i].attackDamage), 1, ["flex-container"]));
        //ougi damage
        breakdown.append(formatLiData("Ougi dmg", displayNumbers(characterInfo[i].ougiDamage), 1, ["flex-container"]));
        //skill damage
        breakdown.append(formatLiData("Skill dmg", displayNumbers(characterInfo[i].skillDamage), 1, ["flex-container"]));
        //avg damage
        breakdown.append(formatLiData("Avg attack dmg", displayNumbers(avgDmg), 1, ["flex-container"]));
        //max damage per hit without extra
        breakdown.append(formatLiData("Max attack dmg (excl. extra)", displayNumbers(maxDmg), 1, ["flex-container"]));
        //min damage per hit without extra
        breakdown.append(formatLiData("Min attack dmg (excl. extra)", displayNumbers(minDmg), 1, ["flex-container"]));
        //da rate
        breakdown.append(formatLiData("DA rate", displayNumbers(daRate), 1, ["flex-container"]));
        //ta rate
        breakdown.append(formatLiData("TA rate", displayNumbers(taRate), 1, ["flex-container"]));



        breakdown.append($("</br>"));
        $("#characterInfo").append(breakdown);
        character.click(function() {
            $(this).next().toggle();
        });

    }
    //precautionary note in case character formation and names did not load
    if(characterInfo[0].name == "Ally 1") {
        var note = $("<p>");
        note.addClass("warning");
        note.css("font-size", "1.1vw");
        note.text("*Note: The logger was started after the battle has started. Ally numbering is according to the state of the party when the logger was opened. To display the names correctly refresh the page (totals will remain in the position they are in and may be incorrect after refresh).");
        $("#characterInfo").append(note);
    }
}

function showRaidId() {
    $("#raidID").html("<h2>Raid ID</h2><h2>" + raidID + "</h2>");
}

/*
Adds a line to the log containing damage done and action taken
*/
function appendTurnLog(action, damage, turnDetails) {

    //summary
    var totalTurnDmg = displayNumbers(damage);
    var turn = formatLiData("\> " + action, totalTurnDmg, 0, ["flex-container", "turn", "toggleable"]);
    $("#log").prepend(turn);

    var container = $("<div>");
    container.hide();

    var charDl = turnDetails.details;
    for(var i = 0; i < charDl.length; i++) { //character
        var charActionClasses = ["flex-container"];
        var key = "";
        var value = displayNumbers(charDl[i].total);

        var actions = charDl[i].details;
        var actionsExpandable = actions && actions.length > 0 && (actions.length > 1 || (actions[0].details && actions[0].details.length > 1));

        //action name
        if (charDl[i].pos != -1) {
          // character name + action type
          key = characterInfo[formation[charDl[i].pos]].name + "(" + charDl[i].type + ")";

          //if action is expandable
          if(actionsExpandable) {
            key = "\> " + key;
            charActionClasses.push("toggleable");
          }
        } else { //everything not attributable to a single character
          if( charDl[i].type == "Chain Burst") {
            key = charDl[i].type;
          }
        }
        var characterTurn = formatLiData(key, value, 2, charActionClasses);
        container.append(characterTurn);

        //action details if needed, i.e. not single attack, not charge attack, not chain burst
        if(actionsExpandable){
            var subContainer = $("<div>");
            subContainer.hide();

            for(var j = 0; j < actions.length; j++) { //each attack

                var actionClasses = ["flex-container"];
                var actionKey = (charDl[i].type == "CA") ? (j == 0 ? "Normal" : "Extra") : "Attack " + (j+1);
                var actionValue = displayNumbers(actions[j].total);

                if ( actions[j].details.length > 1) {
                    actionKey = "\> " + actionKey;
                    actionClasses.push("toggleable");
                }

                var action = formatLiData(actionKey, actionValue, 3, actionClasses);
                subContainer.append(action);

                var subsubContainer = $("<div>");
                subsubContainer.hide();

                if ( actions[j].details.length > 1) {
                    for (var k = 0; k < actions[j].details.length;k++){

                        var subActionKey = "";
                        var subActionValue = actions[j].details[k];

                        if( k == 0) {
                            subActionKey = "Normal";
                        } else {
                            subActionKey = "Extra";
                        }

                        var subAction = formatLiData(subActionKey, subActionValue, 4, ["flex-container"]);
                        subsubContainer.append(subAction);
                    }
                    if(j < actions.length - 1) {
                      subsubContainer.append($("<br/>"));
                    }
                    subContainer.append(subsubContainer);
                    action.click(function() {
                        $(this).next().toggle();
                    });
                }
            }
            //only add another space if it's not the last entry
            if (i < charDl.length - 1) {
              subContainer.append($("<br/>"));
            }

            container.append(subContainer);
            characterTurn.click(function() {
                $(this).next().toggle();
            });
        }
    }
    container.append($("<br/>"));

    turn.click(function() {
        $(this).next().toggle();
    });

    turn.after(container);

    totalDamage += turnDetails.total;
    if(timer != undefined) {
    	timedTotalDamage += turnDetails.total;
    }

    updateStatistics();
}

function appendOthersLog(action, damage) {
    // $("#log").prepend("<li class=\"flex-container\"><p class=\"sub1\">" + action + "</p><p>" + displayNumbers(damage) + "</p></li>");
    $("#log").prepend(formatLiData(action, displayNumbers(damage), 1, ["flex-container"]));

    totalDamage += actionDamage;
    if(timer != undefined) {
    	timedTotalDamage += actionDamage;
    }
    actionDamage = 0;

    updateStatistics();
}

function updateMinDmg(charaDetails, pos) {
  for(var i = 0; i < charaDetails.details.length; i++) {
    characterInfo[pos].minDamage = Math.min(characterInfo[pos].minDamage, charaDetails.details[i].details[0]);
  }
}

function updateMaxDmg(charaDetails, pos) {
  for(var i = 0; i < charaDetails.details.length; i++) {
    characterInfo[pos].maxDamage = Math.max(characterInfo[pos].maxDamage, charaDetails.details[i].details[0]);
  }
}
