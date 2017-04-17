
////////////////
// Formatting //
////////////////

/*
Transforms seconds into hh:mm:ss format
*/
function get_elapsed_time_string(total_seconds) {
  function pretty_time_string(num) {
    return ( num < 10 ? "0" : "" ) + num;
  }

  var hours = Math.floor(total_seconds / 3600);
  total_seconds = total_seconds % 3600;

  var minutes = Math.floor(total_seconds / 60);
  total_seconds = total_seconds % 60;

  var seconds = Math.floor(total_seconds);

  // Pad the minutes and seconds with leading zeros, if required
  hours = pretty_time_string(hours);
  minutes = pretty_time_string(minutes);
  seconds = pretty_time_string(seconds);

  // Compose the string for display
  var currentTimeString = hours + ":" + minutes + ":" + seconds;

  return currentTimeString;
}

/*
Formats a number by adding ' to separate large numbers
*/
function displayNumbers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

/*
Formats the key value pair in a li and returns the html jQuery node
classes: string array of classes that should be attached to the base node
subNum: indent depth of the key
*/
function formatLiData(key, value, subNum, classes=[]) {
  //create base element
  var li = $("<li>");
  for(var i = 0; i < classes.length; i++) {
    li.addClass(classes[i]);
  }

  //key part
  var keyContainer = $("<p>");
  if(subNum > 0) {
    keyContainer.addClass("sub" + subNum);
  }
  keyContainer.text(key);
  li.append(keyContainer);

  //value part
  var valueContainer = $("<p>");
  valueContainer.text(value);
  li.append(valueContainer);

  return li;
}

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
    	timedTotalDamage += turnDetails.total;
    }
    actionDamage = 0;

    updateStatistics();
}

function updateadtChart() {

    adtlabels.push(turnNumber);
    //adtdata.labels = adtlabels.slice(Math.max(0,adtlabels.length - 10), adtlabels.length);
    //adtdata.labels.push(turnNumber);
    adtChart.data.labels.push(turnNumber);

    adtdatapoints.push(Math.round(totalDamage / turnNumber / 1000));
    dtdatapoints.push(Math.round(turnDamage / 1000));

    //adtChart.data.datasets[0].data = adtdatapoints.slice(Math.max(0, adtdatapoints.length - 10), adtdatapoints.length);
    //adtChart.data.datasets[1].data = dtdatapoints.slice(Math.max(0, dtdatapoints.length - 10), dtdatapoints.length);;
    adtChart.data.datasets[0].data.push(Math.round(totalDamage / turnNumber / 1000));
    adtChart.data.datasets[1].data.push(Math.round(turnDamage / 1000));

    adtChart.update();

    turnDamage = 0;

}

//--------------------------------------------------------------------------------------
///////////
// Timer //
///////////



var elapsed_seconds = 0;
var timer;

function startTimer() {
    if(timer === undefined) {
        timer = setInterval(function() {
            elapsed_seconds = elapsed_seconds + 1;
            $('#timer').text(get_elapsed_time_string(elapsed_seconds));
            $("#timedtotalDamage").text(displayNumbers(timedTotalDamage));
            $("#damageTime").text(displayNumbers((timedTotalDamage / elapsed_seconds).toFixed(2)) + " ("+ elapsed_seconds +"s)");
            }, 1000);
        $("#toggleTimer").text("pause timer");
    } else {
        clearInterval(timer);
        timer = undefined;
        $("#toggleTimer").text("start timer");
    }
}

function clearTimer() {
    if (timer != undefined) {
        clearInterval(timer);
    }

    elapsed_seconds = 0;
    timedTotalDamage = 0;
    $('#timer').text("00:00:00");
    $("#damageTime").text("0");
    $("#timedtotalDamage").text("0");
    timer = undefined;

    $("#toggleTimer").text("start timer");
}

document.querySelector("#toggleTimer").addEventListener('click', startTimer, false);
document.querySelector("#clearTimer").addEventListener('click', clearTimer, false);


//------- timed value update ---------

var bossUpdate;

function bossInfoTimedUpdate() {
  if(document.getElementById('setUpdateBoss').checked) {
    if(bossUpdate === undefined) {
        bossUpdate = setInterval(function() {
          // get boss info and display
          chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData.boss", (bosses, err) => {
            if (!err) {
              for(var i = 0; i < bossInfo.length; i++) {
                if(bosses.param[i].hp < bossInfo[i].hp) {
                  bossInfo[i].hp = bosses.param[i].hp;
                }
              }
              updateBossInfo();
            }
          });
        }, 300);
    }
  } else {
    clearInterval(bossUpdate);
    bossUpdate = undefined;
  }
}

document.querySelector("#setUpdateBoss").addEventListener('click', bossInfoTimedUpdate, false);

//-   -   -   -   -   -   -   -   -   -   -   -   -  -   -   -   -   -   -   -   -   -   -   -   -   -
var raidHonorUpdate;

function raidHonorsTimedUpdate() {
  if(document.getElementById('setRaidHonors').checked) {
    $("#raidHonors").show();
    if(raidHonorUpdate === undefined) {
      raidHonorUpdate = setInterval(function() {
        //get info and update
        chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData", (info, err) => {
          if (!err) {
            if(info.multi == 1) {
              console.log(data);
              var data = info.multi_raid_member_info;
              updateRaidMemberInfo(data);
            }
          } else {
            console.log("error");
          }
        });
      }, 500);
    }
  } else {
    $("#raidHonors").hide();
    clearInterval(raidHonorUpdate);
    raidHonorUpdate = undefined;
  }
}

function updateRaidMemberInfo(rmi) {
  $("#raidHonorsList").html("");
  for(var i = 0; i < rmi.length; i++) {
    $("#raidHonorsList").append(formatLiData(rmi[i].nickname + " (" + rmi[i].level + ")", displayNumbers(rmi[i].point), 0, ["flex-container"]));
  }
}

document.querySelector("#setRaidHonors").addEventListener('click', raidHonorsTimedUpdate, false);

//------------------------------------------------------------------------------

/////////////
// Buttons //
/////////////

function resetDamage() {
    //general
    totalDamage = 0;
    totalTurnDamage = 0;
    totalSummonDamage = 0;
    totalSkillDamage = 0;
    totalChainBurstDamage = 0;
    turnNumber = 0;
    skillsUsed = 0;
    summonsUsed = 0;

    //chart
    adtChart.data.labels = [];
    adtChart.data.datasets[0].data = [];
    adtChart.data.datasets[1].data = [];
    adtChart.update();

    //character info
    for(var i = 0; i < characterInfo.length; i++) {
        characterInfo[i].attackDamage = 0;
        characterInfo[i].ougiDamage = 0;
        characterInfo[i].skillDamage = 0;
        characterInfo[i].turns = 0;
        characterInfo[i].attacks = 0;
        characterInfo[i].maxDamage = 0;
        characterInfo[i].minDamage = initMinDamage;
        characterInfo[i].das = 0;
        characterInfo[i].tas = 0;
        characterInfo[i].cas = 0;
    }

    updateStatistics();
}

function clearLog() {
    $("#log").html("");
}

function clearEnemyInfo() {
    $("#enemyInfo").html("");
    bossInfo = [];
    $("#raidID").html("");
    raidID = "";
}

function resetRaidMemberInfo() {
  $("#raidHonorsList").html("");
}

$(function() {
    $("#tabs").tabs();
});

function saveLog() {
	var link = document.getElementById("saveLog");
	var logFile = $("<html>");
	var head = $("<head>");
	var body = $("<body>");
	$("<style type=\"text/css\">html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video { margin: 0;	padding: 0;	border: 0; font-size: 100%;	font: inherit; vertical-align: baseline; } article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section { display: block; } body { line-height: 1; } ol, ul { list-style: none; } blockquote, q { quotes: none; } blockquote:before, blockquote:after, q:before, q:after { content: ''; content: none; } table { border-collapse: collapse; border-spacing: 0; } </style>").appendTo(head);
	$("<style type=\"text/css\"> body { font-family: 'Lato', Verdana, Geneva, sans-serif; font-size: 1.25vw; line-height: 160%; } h1 { font-size: 2em; margin: 0.25em 0em 0.5em 0em; text-align: center; } h2 { font-size: 1.5em; text-align: center; } a, a:link, a:visited { text-decoration: none; decoration: none; color: white; } .main-flex { display: flex; justify-content: space-between; } .section { display: block; } .flex-container { display: flex; width: 100%; flex-direction: row; flex-wrap: nowrap; justify-content: space-between; margin: 0; } .flex-item { display: block; width: 31%; } .flex-container .sub1 { padding-left: 1em; border-style: none; } .flex-container .sub2 { padding-left: 2em; border-style: none; } .flex-container .sub3 { padding-left: 3em; border-style: none; } .flex-container .sub4 { padding-left: 4em; } .clock { display:flex; flex-direction: row; justify-content: space-around; text-align: center; margin-bottom: 1em; } .clock h2 { font-size: 2em; } #timer { padding-top: 0.25em; } #log-container { height: 35vh; background-color: #e6e6e6; padding: 0em 0.4em 0em 0.4em; margin-bottom: 1em; overflow-y:scroll; } #log .turn{ border: 0.05em; border-top-style: solid; border-color: whitesmoke; } .statSection { border: 0.2px; padding-bottom: 1em; } .character { border: 0.2px; border-bottom-style: solid; margin-top: 1em; } #characterInfo > div { line-height: 120%; } #raidID { color: #800000; } </style>").appendTo(head);
	$("<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css\"></style>").appendTo(head);
	$("<script   src=\"https://code.jquery.com/jquery-3.1.1.min.js\"   integrity=\"sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=\"   crossorigin=\"anonymous\"></script>").appendTo(head);
	$("<script src=\"https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js\"></script>").appendTo(head);

	$("#tabs").clone(true).appendTo(body);
	$("<script type=\"text/javascript\"> $(\".toggleable\").each( function() { $(this).click(function() { $(this).next().toggle();}) }) </script>").appendTo(body);
	$("<script type=\"text/javascript\"> $(function() { $(\"#tabs\").tabs(); });</script>").appendTo(body);
	head.appendTo(logFile);
	body.appendTo(logFile);
	body.find(".clickable").remove();
	body.find(".warning").remove();
	body.find("#chartSection").remove();
	link.href = "data:text/plain;charsset=utf-8," + encodeURIComponent(logFile.prop("outerHTML"));
}

function setRaidReset() {
  if (document.getElementById('setResetRaid').checked) {
    resetRaidOnChange = true;
  } else {
    resetRaidOnChange = false;
  }
}

document.querySelector("#resetDamage").addEventListener('click', resetDamage, false);
document.querySelector("#clearLog").addEventListener('click', clearLog, false);
document.querySelector("#clearEnemyInfo").addEventListener('click', clearEnemyInfo, false);
document.querySelector("#saveLog").addEventListener('click', saveLog, false);
document.querySelector("#setResetRaid").addEventListener('click', setRaidReset, false);
document.querySelector("#resetRaidMembers").addEventListener('click', resetRaidMemberInfo, false);

//----------------------------------------------------------------------------
/////////////////
// Read Data //
/////////////////

var initMinDamage = Number.MAX_SAFE_INTEGER - 873;
var actionDamage = 0; //damage from action
var turnDamage = 0;
var totalDamage = 0; //all damage combined
var timedTotalDamage = 0; //total damage logged while timer is running
var totalTurnDamage = 0; //all damage from attack
var totalSummonDamage = 0; //all summon damage
var totalSkillDamage = 0; //all skill damage
var totalChainBurstDamage = 0; //damage from all chain bursts
var turnNumber = 0;
var raidID = ""; //twitter raidID
var bossInfo = []; //boss info with name, lv, maxhp, hp
var characterInfo = [ //character info with name, damage dealt
    { //first character (i.e. Gran/Djeeta)
        name: "Ally 1",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0, // number of turns taken
        attacks: 0, // number of autoattacks (turns + das + 2*tas)
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //second character
        name: "Ally 2",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0,
        attacks: 0,
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //third character
        name: "Ally 3",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0,
        attacks: 0,
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //fourth character
        name: "Ally 4",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0,
        attacks: 0,
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //fifth character
        name: "Ally 5",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0,
        attacks: 0,
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //sixth character
        name: "Ally 6",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0,
        attacks: 0,
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
];
var formation = []; // length 4 array. Each position holds the character that is in the position of the index
var skillsUsed = 0;
var summonsUsed = 0;

//For resetting raid
var resetRaidOnChange = false; //when true, all stats will reset if raid id changes
var questID = ""; //Id that identifies the quest instance

chrome.devtools.network.onRequestFinished.addListener(function(req) {
    var reqURL = document.createElement('a');
    reqURL.href = req.request.url;

    if(reqURL.hostname == "gbf.game.mbga.jp" || reqURL.hostname == "game.granbluefantasy.jp") {

        //i.e. normal_attack_result.json
        var path = reqURL.pathname;
        //attack
        if(path.indexOf("normal_attack_result.json") !== -1) {
            req.getContent(function(body){
                if (formation.length == 0) {
                    formation = [0, 1, 2, 3];
                }
                var newFormation = formation.slice(0);
                var data = JSON.parse(body);
                var scenario = data.scenario;
                //safety check
                var chainBurst = false;
                //store all turn information in here
                var turnDetails = {
                    total: 0,
                    details: []
                };
                var charaDetails = {
                    total: 0,
                    pos: -1,
                    type: "", //Single, Double, Triple, CA
                    details: [],
                };
                var attackDetails = {
                    total: 0,
                    details: [],
                };
                var perChara = [];
                var bossAttacked = false;
                var counterCount = 0;
                for (var i = 0; i < scenario.length; i++) {
                    //normal attacks
                    if(scenario[i].cmd == "attack" && scenario[i].from == "player") {
                        var j;
                        if (bossAttacked) {
                            // Hack to make counter attacks the same as all the other attacks
                            // which they honestly should be by default...
                            // Cygames why is your API so damn weird?
                            scenario[i].damage = [scenario[i].damage[counterCount]];
                            counterCount++;
                        }
                        for (j = 0; j < scenario[i].damage.length; j++) { //loop for character turn (Single, DA, TA)
                            for(var k = 0; k < scenario[i].damage[j].length; k++) { //loop for attack components (extra damage)
                                attackDetails.total += scenario[i].damage[j][k].value;
                                attackDetails.details.push(scenario[i].damage[j][k].value);
                            }
                            charaDetails.total += attackDetails.total;
                            charaDetails.details.push(attackDetails);
                            attackDetails = { // reset
                                total: 0,
                                details: [],
                            };
                        }
                        //per character information
                        charaDetails.pos = Number(scenario[i].pos);
                        if (bossAttacked) {
                            // if you're attacking after the boss has, you must be countering (?)
                            charaDetails.type = "Counter";
                        } else if( j == 1) {
                            charaDetails.type = "Single";
                        } else if (j == 2) {
                            charaDetails.type = "Double";
                        } else if (j == 3) {
                            charaDetails.type = "Triple";
                        }

                        turnDetails.total += charaDetails.total;
                        turnDetails.details.push(charaDetails);
                    //charge attacks
                    } else if (scenario[i].cmd == "special" || scenario[i].cmd == "special_npc") {
                        //enable checking for chainburst
                        if(scenario[i].count > 1) {
                            chainBurst = true;
                        }
                        if(scenario[i].list !== undefined) {
                          for (var j = 0; j < scenario[i].list.length; j++) {
                                //charaDetails.total += scenario[i].list[j].damage[0].value;
                                attackDetails.total += scenario[i].list[j].damage[0].value;
                          }
                          attackDetails.details.push(attackDetails.total);
                          charaDetails.total += attackDetails.total;
                          charaDetails.details.push(attackDetails);
                          attackDetails = { // reset
                              total: 0,
                              details: [],
                          };
                        }

                        // checking for additional damage on ougi (Yoda, Juliet, etc.)
                        // TODO: this should probably make the ougi expandable
                        for (var k = 1; scenario[i+k].cmd == "damage"; k++) {
                          if (scenario[i+k].cmd == "damage" && scenario[i+1].mode == "parallel") {
                              for (var j = 0; j < scenario[i+1].list.length; j++) {
                                  //charaDetails.total += scenario[i+1].list[j].value;
                                  attackDetails.total += scenario[i+k].list[j].value;
                                  attackDetails.details.push(scenario[i+k].list[j].value);
                              }
                          }
                          charaDetails.total += attackDetails.total;
                          charaDetails.details.push(attackDetails);
                          attackDetails = { // reset
                              total: 0,
                              details: [],
                          };
                        }
                        charaDetails.type = "CA";
                        charaDetails.pos = Number(scenario[i].pos);
                        //charaDetails.details is empty for charge attack FIXME: add details for additional damage

                        turnDetails.total += charaDetails.total;
                        turnDetails.details.push(charaDetails);
                    //chain burst
                    } else if (chainBurst == true && scenario[i].cmd == "effect" && scenario[i].kind.indexOf("burst") !== -1) {
                        if ((i < scenario.length - 1) && scenario[i + 1].cmd == "damage") {
                            for (var j = 0; j < scenario[i + 1].list.length; j++) {
                                charaDetails.total += scenario[i + 1].list[j].value;
                            }
                            charaDetails.pos = -1;
                            charaDetails.type = "Chain Burst";

                            totalChainBurstDamage += charaDetails.total;
                            turnDetails.total += charaDetails.total;
                            turnDetails.details.push(charaDetails);
                    }
                    //boss info
                    } else if (scenario[i].cmd == "boss_gauge") {
                        if (bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = scenario[i].hp;
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : scenario[i].name.en,
                                maxhp : scenario[i].hpmax,
                                hp : scenario[i].hp
                            };
                        }

                        updateBossInfo();

                    } else if ((scenario[i].cmd == "die" || scenario[i].cmd == "stop") && scenario[i].to == "boss") {
                        if ( bossInfo[Number(scenario[i].pos)] != undefined) {
                            bossInfo[Number(scenario[i].pos)].hp = "0";
                        } else {
                            bossInfo[Number(scenario[i].pos)] = {
                                name : undefined
                            };
                        }

                    } else if (scenario[i].cmd == "replace" ) {
                        newFormation[scenario[i].pos] = scenario[i].npc;
                    } else if (scenario[i].cmd == "attack" && scenario[i].from == "boss") {
                        bossAttacked = true;
                    }

                    //increase individual character totals
                    if(charaDetails.pos != -1) {
                        var pos = newFormation[charaDetails.pos];
                        if (charaDetails.type != "Counter") characterInfo[pos].turns++;
                        if (charaDetails.type != "CA") {
                            characterInfo[pos].attackDamage += charaDetails.total;
                            updateMinDmg(charaDetails, pos);
                            updateMaxDmg(charaDetails, pos);
                        }

                        if (charaDetails.type == "Single") {
                            characterInfo[pos].attacks++;
                        } else if (charaDetails.type == "Double") {
                            characterInfo[pos].das++;
                            characterInfo[pos].attacks += 2;
                        } else if ( charaDetails.type == "Triple") {
                            characterInfo[pos].tas++;
                            characterInfo[pos].attacks += 3;
                        } else if ( charaDetails.type == "CA") {
                            characterInfo[pos].ougiDamage += charaDetails.total;
                            characterInfo[pos].cas++;
                        }
                    }
                    charaDetails = { //reset
                        total: 0,
                        pos: -1,
                        type: "", //Single, Double, Triple, CA
                        details: [],
                    };

                }

                if(turnDetails.details.length > 0) {
                    totalTurnDamage += turnDetails.total;
                    turnDamage += turnDetails.total;
                    turnNumber++;

                    appendTurnLog("Turn " + (Number(JSON.parse(body).status.turn) - 1), turnDetails.total, turnDetails);

                    updateadtChart();
                }

                formation = newFormation;

                turnDetails = { //reset
                    total: 0,
                    details: []
                };

                //status at the end of turn
                var status = data.status;
                if (status != undefined && status.formation != undefined) {
                    formation = status.formation; //just in case
                }

                updateBossInfo();

            });
        }

        //skill
        else if(path.indexOf("ability_result.json") !== -1) {
            req.getContent(function(body){
                if (formation.length == 0) {
                    formation = [0, 1, 2, 3];
                }
                var newFormation = formation.slice(0);
                var data = JSON.parse(body);
                var scenario = data.scenario;
                var skillName = "";
                var character;
                for (var i = 0; i < scenario.length; i++) {
                    if(scenario[i].cmd == "ability") {
                        skillName = scenario[i].name;
                        character = Number(scenario[i].pos);
                    } else if (scenario[i].cmd == "damage" && scenario[i].to == "boss") {
                        for (var j = 0; j < scenario[i].list.length; j++) {
                                actionDamage += scenario[i].list[j].value;
                         }

                    //boss info
                    } else if (scenario[i].cmd == "boss_gauge") {
                        if (bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = scenario[i].hp;
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : scenario[i].name.en,
                                maxhp : scenario[i].hpmax,
                                hp : scenario[i].hp
                            };
                        }

                        updateBossInfo();

                    } else if (scenario[i].cmd == "die" && scenario[i].to == "boss") {
                        if ( bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = "0";
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : undefined
                            };
                        }

                        updateBossInfo();
                    } else if (scenario[i].cmd == "replace" ) {
                        newFormation[scenario[i].pos] = scenario[i].npc;
                    }
                }

                if(skillName != "") {
                    skillsUsed++;
                    if(actionDamage != 0) {
                        characterInfo[newFormation[character]].skillDamage += actionDamage;
                        totalSkillDamage += actionDamage;
                        turnDamage += actionDamage;
                        appendOthersLog(skillName, actionDamage);
                    } else {
                        appendOthersLog(skillName, "");
                    }
                }

                formation = newFormation;

                //status at the end of ability
                var status = data.status;
                if (status != undefined && status.formation != undefined) {
                    formation = status.formation; //just in case
                }
            });
        }

        // summon
        else if(path.indexOf("summon_result.json") !== -1) {
            req.getContent(function(body){
                if (formation.length == 0) {
                    formation = [0, 1, 2, 3];
                }
                var newFormation = formation.slice(0);
                var data = JSON.parse(body);
                var scenario = data.scenario;
                var summonName = "";
                for (var i = 0; i < scenario.length; i++) {

                    if(scenario[i].cmd == "summon_cutin") {
                        summonName = scenario[i].name;
                    } else if(scenario[i].cmd == "summon") {
                        if(scenario[i].name != "" && summonName == "") {
                            summonName = scenario[i].name;
                        }

                        for(var j = 0; j < scenario[i].list[0].damage.length; j++) {
                            actionDamage += scenario[i].list[0].damage[j].value;
                        }


                    //boss info
                    } else if (scenario[i].cmd == "boss_gauge") {
                        if (bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = scenario[i].hp;
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : scenario[i].name.en,
                                maxhp : scenario[i].hpmax,
                                hp : scenario[i].hp
                            };
                        }

                        updateBossInfo();

                    } else if (scenario[i].cmd == "die" && scenario[i].to == "boss") {
                        if ( bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = "0";
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : undefined
                            };
                        }

                        updateBossInfo();
                    } else if (scenario[i].cmd == "replace" ) {
                        newFormation[scenario[i].pos] = scenario[i].npc;
                    }
                }
                if(summonName != "") {
                    summonsUsed++;
                    if(actionDamage != 0) {
                        totalSummonDamage += actionDamage;
                        turnDamage += actionDamage;
                        appendOthersLog(summonName, actionDamage);
                    } else {
                        appendOthersLog(summonName, "");
                    }
                }
                formation = newFormation;

                //status at the end of summon
                var status = data.status;
                if (status != undefined && status.formation != undefined) {
                    formation = status.formation; //just in case
                }
            });
        }

        //raid start information
        else if (path.indexOf("start.json") !== -1) {
            req.getContent(function(body){
                var startinfo = JSON.parse(body);

                if(resetRaidOnChange) {
                  if(questID !== startinfo.raid_id){
                      questID = startinfo.raid_id;
                      resetDamage();
                      clearLog();
                      clearEnemyInfo();
                      resetRaidMemberInfo()
                  }
                }

                //raid id
                if(startinfo.multi == 1) {
                    raidID = startinfo.twitter.battle_id;
                } else {
                    raidID = "";
                }
                showRaidId();

                //boss info
                var boss;
                bossInfo = [];
                for(var i = 0; i < startinfo.boss.param.length; i++) {
                    boss = {
                      name : startinfo.boss.param[i].monster,
                      lv : startinfo.boss.param[i].Lv,
                      maxhp : startinfo.boss.param[i].hpmax,
                      hp : startinfo.boss.param[i].hp

                    };
                    bossInfo.push(boss);
                }

                updateBossInfo();

                //character info
                for(var i = 0; i < startinfo.player.param.length; i++) {
                    characterInfo[i].name = startinfo.player.param[i].name;
                }

                updateCharacterInfo();

                //team formation
                if (startinfo.formation != undefined) {
                    formation = startinfo.formation;
                }

            });

        }

        //boss died
        else if (path.indexOf("reward.json") !== -1) {
            req.getContent(function(body){
                var scenario = JSON.parse(body).scenario;
                for (var i = 0; i < scenario.length; i++) {
                    if (scenario[i].cmd == "die" && scenario[i].to == "boss") {
                        if ( bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = "0";
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : undefined
                            };
                        }
                    } else if (scenario[i].cmd == "stop" && scenario[i].to == "boss") {
                        if ( bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = "0";
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : undefined
                            };
                        }
                    }

                }

                updateBossInfo();
            });
        }
    }
});

function init() {
  //get Formation
  chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData.formation", (res, err) => {
    if (!err) {
      formation = res.map((i) => {return parseInt(i)});
    }
  });
  // character names and display
  chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData.player", (playerInfo, err) => {
    if (!err) {
      for (var i = 0; i < playerInfo.number; i++) {
        characterInfo[i].name = playerInfo.param[i].name;
      }
      updateCharacterInfo();
    }
  });
  // get boss info and display
  chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData.boss", (bosses, err) => {
    if (!err) {
      var boss;
      bossInfo = [];
      for(var i = 0; i < bosses.number; i++) {
        boss = {
          name : bosses.param[i].monster,
          lv : bosses.param[i].Lv,
          maxhp : bosses.param[i].hpmax,
          hp : bosses.param[i].hp
        };
        bossInfo.push(boss);
      }
      updateBossInfo();
    }
  });
  // get raid id and display
  chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData", (info, err) => {
    if (!err) {
      if(info.multi == 1) {
          raidID = info.twitter.battle_id;
      } else {
          raidID = "";
      }
      questID = info.raid_id;
      showRaidId();
    }
  });

  // get raid member honors
  document.getElementById('setRaidHonors').checked = true;
  raidHonorsTimedUpdate();

}

init();

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

//--------------------------------------------------------------
////////////
// Graphs //
////////////

var adtlabels = [];
var adtdatapoints = [];
var dtdatapoints = [];

var adtdata = {
    labels: [],
    datasets: [
        {
            label: "Average Damage per Turn",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
            spanGaps: false,
        },

        {
            label: "Damage in Turn",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(255,165,0,0.4)",
            borderColor: "rgba(255,165,0,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(255,165,0,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(255,165,0,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
            spanGaps: false,
        }
    ]
};

var adtoptions = {
    scales: {
        yAxes: [{
        type: 'logarithmic',
            position: 'left'
        }]
    }
};

var graphctx = document.getElementById("graph").getContext("2d");

var adtChart = new Chart.Line(graphctx, {data: adtdata, options: adtoptions});
